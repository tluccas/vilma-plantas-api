import models from '../database/index.js';
import { Op } from 'sequelize';
import Category from '../database/models/Category.js';
const { Product, Image } = models;
import redis from '../config/redis.js';
import { logger } from '../util/logger.js';
import { cacheKeyGenerator } from '../util/CacheKeyGenerator.js';
import { NotFoundError, ConflictError, ValidationError, AppError } from '../util/error/index.js';

export default class ProductService {
  async findAll() {
    return await Product.findAll();
  }

  async getProducts({ page = 1, limit = 20, category, minPrice, maxPrice, sort }) {
    logger.info(`getProducts() chamado | page=${page}`);

    page = Math.max(1, parseInt(page) || 1);
    limit = Math.min(100, Math.max(1, parseInt(limit) || 20));

    if (minPrice && isNaN(parseFloat(minPrice))) {
      throw new ValidationError('Preço mínimo inválido');
    }
    if (maxPrice && isNaN(parseFloat(maxPrice))) {
      throw new ValidationError('Preço máximo inválido');
    }
    if (minPrice && maxPrice && parseFloat(minPrice) > parseFloat(maxPrice)) {
      throw new ValidationError('Preço mínimo não pode ser maior que o máximo');
    }

    const offset = (page - 1) * limit;

    // Cria chave de cache específica
    const cacheKey = cacheKeyGenerator.generateCacheKey('products', {
      page,
      limit,
      category,
      minPrice,
      maxPrice,
      sort,
    });

    // Tentar buscar no cache
    try {
      const cache = await redis.get(cacheKey);
      if (cache) {
        logger.info(`[ REDIS ] Cache hit: ${cacheKey}`);
        return JSON.parse(cache);
      }
    } catch (error) {
      logger.warn('Redis cache read failed:', error.message);
    }

    const where = {};

    if (category) {
      const categoryId = parseInt(category);
      if (isNaN(categoryId)) {
        throw new ValidationError('ID de categoria inválido');
      }
      where.category_id = categoryId;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = minPrice;
      if (maxPrice) where.price[Op.lte] = maxPrice;
    }

    const order = [];

    if (sort) {
      const [field, direction = 'ASC'] = sort.split('_');
      const allowedFields = ['name', 'price', 'createdAt', 'stock'];
      const allowedDirections = ['ASC', 'DESC'];

      if (allowedFields.includes(field) && allowedDirections.includes(direction.toUpperCase())) {
        order.push([field, direction.toUpperCase()]);
      }
    }

    const { rows: products, count: total } = await Product.findAndCountAll({
      where,
      limit,
      offset,
      order,
      attributes: [
        'id',
        'name',
        'price',
        'description',
        'category_id',
        'stock',
        'createdAt',
        'updatedAt',
      ],
      include: [
        { model: Category, as: 'category', attributes: ['name'] },
        { model: Image, as: 'images', attributes: ['url'] },
      ],
    });

    // Salvar no cache
    try {
      const ttl = page === 1 ? 300 : 600; // 5min para página 1, 10min para outras
      await redis.set(cacheKey, JSON.stringify({ products, total }), { EX: ttl });
      logger.info(`[ REDIS ] Cache set: ${cacheKey} (TTL: ${ttl}s)`);
    } catch (error) {
      logger.warn('Redis cache write failed:', error.message);
    }

    return { products, total };
  }

  // Invalidar o cache quando algum produto é criado, atualizado ou deletado
  async invalidateProductsCache() {
    try {
      const pattern = 'vilma:products:*';
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(keys);
        logger.info(`[ REDIS ] Invalidated ${keys.length} product cache keys`);
      }
    } catch (error) {
      logger.warn('Failed to invalidate product cache:', error.message);
    }
  }
  async findById(id) {
    return await Product.findByPk(id, {
      include: [{ model: Category, as: 'category', attributes: ['name'] }],
    });
  }

  async create(productData) {
    try {
      if (productData.category_id) {
        const category = await Category.findByPk(productData.category_id);
        if (!category) {
          throw new NotFoundError('Categoria');
        }
      }

      const existingProduct = await Product.findOne({ where: { name: productData.name } });
      if (existingProduct) {
        throw new ConflictError('Já existe um produto com este nome');
      }

      const newProduct = await Product.create(productData);

      // Criação da Imagem associada
      if (productData.image_url) {
        await Image.create({
          product_id: newProduct.id,
          url: productData.image_url,
        });
      }
      const responseProduct = await Product.findByPk(newProduct.id, {
        attributes: [
          'id',
          'name',
          'price',
          'category_id',
          'description',
          'stock',
          'createdAt',
          'updatedAt',
        ],
        include: [
          { model: Category, as: 'category', attributes: ['name'] },
          { model: Image, as: 'images', attributes: ['url'] },
        ],
      });

      // Invalidar cache após criar produto
      await this.invalidateProductsCache();

      return responseProduct;
    } catch (error) {
      logger.error('Erro ao criar produto:', error);

      if (error.name === 'SequelizeValidationError') {
        throw new ValidationError(
          `Dados inválidos: ${error.errors.map((e) => e.message).join(', ')}`,
        );
      }

      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new ConflictError('Produto com estes dados já existe');
      }

      if (error.isOperational) {
        throw error;
      }

      throw new AppError('Erro ao criar produto', 500);
    }
  }

  async update(id, productData) {
    try {
      // Validar se categoria existe (se fornecida)
      if (productData.category_id) {
        const category = await Category.findByPk(productData.category_id);
        if (!category) {
          throw new NotFoundError('Categoria');
        }
      }

      // Verificar se produto existe
      const product = await Product.findByPk(id);
      if (!product) {
        throw new NotFoundError(`Produto ${id} não encontrado`);
      }

      // Verificar nome duplicado
      if (productData.name && productData.name !== product.name) {
        const existingProduct = await Product.findOne({
          where: {
            name: productData.name,
            id: { [Op.ne]: id },
          },
        });
        if (existingProduct) {
          throw new ConflictError('Já existe um produto com este nome');
        }
      }

      // Atualizar produto
      const [affectedRows] = await Product.update(productData, { where: { id } });

      if (affectedRows === 0) {
        throw new NotFoundError('Produto não foi atualizado');
      }

      // Buscar produto atualizado com relacionamentos
      const updatedProduct = await Product.findByPk(id, {
        attributes: [
          'id',
          'name',
          'price',
          'category_id',
          'description',
          'stock',
          'createdAt',
          'updatedAt',
        ],
        include: [
          { model: Category, as: 'category', attributes: ['name'] },
          { model: Image, as: 'images', attributes: ['url'] },
        ],
      });

      // Invalidar cache após atualizar produto
      await this.invalidateProductsCache();

      return updatedProduct;
    } catch (error) {
      logger.error('Erro ao atualizar produto:', error);

      if (error.name === 'SequelizeValidationError') {
        throw new ValidationError(
          `Dados inválidos: ${error.errors.map((e) => e.message).join(', ')}`,
        );
      }

      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new ConflictError('Produto com estes dados já existe');
      }

      if (error.isOperational) {
        throw error;
      }

      throw new AppError('Erro ao atualizar produto', 500);
    }
  }
  async delete(id) {
    const product = await Product.findByPk(id);
    if (!product) {
      throw new NotFoundError(`Produto ${id} não encontrado`);
    }
    await product.destroy();

    // Invalidar cache após deletar produto
    await this.invalidateProductsCache();

    return true;
  }
}