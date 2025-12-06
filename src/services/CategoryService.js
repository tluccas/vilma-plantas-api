import models from '../database/index.js';
import { NotFoundError, AppError, ConflictError } from '../util/error/index.js';
import { logger } from '../util/logger.js';
import { Op } from 'sequelize';
import { cacheKeyGenerator } from '../util/CacheKeyGenerator.js';
import redis from '../config/redis.js';

export default class CategoryService {
  async getAllCategories() {
    try {
      const cacheKey = cacheKeyGenerator.generateCacheKey('categories');

      try {
        const cache = await redis.get(cacheKey);
        if (cache) {
          logger.info(`[ REDIS ] Cache hit: ${cacheKey}`);
          return JSON.parse(cache);
        }
      } catch (cacheError) {
        logger.warn('Failed to retrieve cache:', cacheError);
      }

      const categories = await models.Category.findAll();

      try {
        await redis.set(cacheKey, JSON.stringify(categories), { EX: 3600 });
        logger.info(`[ REDIS ] Cache set: ${cacheKey} TTL(3600s)`);
      } catch (cacheError) {
        logger.warn('Failed to set cache:', cacheError);
      }

      return categories;
    } catch (error) {
      logger.error('Erro ao buscar categorias:', error);
      throw new AppError('Erro interno ao buscar categorias');
    }
  }

  async getCategoryById(id) {
    try {
      const category = await models.Category.findByPk(id);
      if (!category) {
        throw new NotFoundError('Categoria não encontrada');
      }

      return category;
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }

      throw new AppError('Erro ao buscar categoria', 500);
    }
  }

  async create(categoryData) {
    try {
      const existingCategory = await models.Category.findOne({
        where: { name: categoryData.name },
      });

      if (existingCategory) {
        throw new ConflictError('Já existe uma categoria com este nome');
      }
      const newCategory = await models.Category.create(categoryData);
      cacheKeyGenerator.invalidateCacheKey('categories');
      return newCategory;
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }

      throw new AppError('Erro ao criar categoria: ' + error.message, 500);
    }
  }

  async update(id, categoryData) {
    try {
      const category = await models.Category.findByPk(id);
      if (!category) {
        throw new NotFoundError('Categoria não encontrada');
      }

      // Verificar nome duplicado
      if (categoryData.name && categoryData.name !== category.name) {
        const existingCategory = await models.Category.findOne({
          where: {
            name: categoryData.name,
            id: { [Op.ne]: id },
          },
        });
        if (existingCategory) {
          throw new ConflictError('Já existe uma categoria com este nome');
        }
      }

      const [affectedRows] = await models.Category.update(categoryData, { where: { id } });
      logger.info(`Categorias atualizadas: ${affectedRows}`);
      cacheKeyGenerator.invalidateCacheKey('categories');
      return await models.Category.findByPk(id);
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError('Erro ao atualizar categoria', 500);
    }
  }

  async delete(id) {
    try {
      const category = await models.Category.findByPk(id);
      if (!category) {
        throw new NotFoundError('Categoria não encontrada');
      }

      await models.Category.destroy({ where: { id } });
      cacheKeyGenerator.invalidateCacheKey('categories');
      logger.info(`Categoria deletada: ${id}`);
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }

      throw new AppError('Erro ao deletar categoria', 500);
    }
  }
}
