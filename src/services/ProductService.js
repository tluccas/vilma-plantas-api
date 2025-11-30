import models from '../database/index.js';
import { Op } from 'sequelize';
import Category from '../database/models/Category.js';
const { Product } = models;

export default class ProductService {
  async findAll() {
    return await Product.findAll();
  }

  async getProducts({ page = 1, limit = 20, category, minPrice, maxPrice, sort }) {
    const offset = (page - 1) * limit;
    const where = {};

    page = Math.max(1, parseInt(page) || 1);
    limit = Math.min(100, Math.max(1, parseInt(limit) || 20));

    if (category) {
      where.category_id = category;
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
      attributes: ['id', 'name', 'price', 'category_id', 'stock', 'createdAt', 'updatedAt'],
      include: [{ model: Category, as: 'category', attributes: ['name'] }],
    });

    return { products, total };
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
          throw new Error('Categoria não encontrada');
        }
      }

      const existingProduct = await Product.findOne({ where: { name: productData.name } });
      if (existingProduct) {
        throw new Error('Produto com esse nome já existe');
      }

      const newProduct = await Product.create(productData);

      const responseProduct = await Product.findByPk(newProduct.id, {
        attributes: ['id', 'name', 'price', 'category_id', 'stock', 'createdAt', 'updatedAt'],
        include: [{ model: Category, as: 'category', attributes: ['name'] }],
      });

      return responseProduct;
    } catch (error) {
      console.error('Erro ao criar produto:', error);

      if (error.name === 'SequelizeValidationError') {
        throw new Error(`Dados inválidos: ${error.errors.map((e) => e.message).join(', ')}`);
      }

      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new Error('Produto com estes dados já existe');
      }

      if (
        error.message.includes('Categoria não encontrada') ||
        error.message.includes('Já existe um produto')
      ) {
        throw error;
      }

      throw new Error( error.message ||'Não foi possível criar o produto');
    }
  }

  // async update(id, productData) {}

  async delete(id) {
    const product = await Product.findByPk(id);
    if (!product) {
      throw new Error('Produto não encontrado');
    }
    await product.destroy();
    return true;
  }
}
