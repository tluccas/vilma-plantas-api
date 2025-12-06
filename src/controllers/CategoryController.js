import {
  createCategorySchema,
  updateCategorySchema,
  categoryIdSchema,
} from '../validators/categoryValidator.js';
import CategoryService from '../services/CategoryService.js';

const service = new CategoryService();

class CategoryController {
  async getAll(req, res, next) {
    try {
      const categories = await service.getAllCategories();
      return res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = await categoryIdSchema.validate(req.params, { abortEarly: false });
      const category = await service.getCategoryById(id);
      return res.status(200).json(category);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const { name, description } = await createCategorySchema.validate(req.body, {
        abortEarly: false,
      });
      const newCategory = await service.create({ name, description });

      return res.status(201).json(newCategory);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = await categoryIdSchema.validate(req.params, { abortEarly: false });
      const { name, description } = await updateCategorySchema.validate(req.body, {
        abortEarly: false,
      });
      const updatedCategory = await service.update(id, { name, description });
      return res.status(200).json(updatedCategory);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = await categoryIdSchema.validate(req.params, { abortEarly: false });
      await service.delete(id);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default new CategoryController();
