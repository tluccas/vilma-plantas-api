import { createProductSchema, updateProductSchema } from '../validators/productValidator.js';
import ProductService from '../services/ProductService.js ';

const service = new ProductService();

class ProductController {
  async getProducts(req, res, next) {
    try {
      const productsData = await service.getProducts(req.query);
      return res.status(200).json(productsData);
    } catch (error) {
       next(error);
    }
  }

  async create(req, res, next) {
    try {
      await createProductSchema.validate(req.body, { abortEarly: false });

      const newProduct = await service.create(req.body);

      return res.status(201).json(newProduct);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const productData = req.body;

      await updateProductSchema.validate(productData, { abortEarly: false });

      const updatedProduct = await service.update(id, productData);

      return res.status(200).json(updatedProduct);
    } catch (error) {
      next(error);
    }
  }
  
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await service.delete(id);
      return res.status(200).json({ message: 'Produto deletado com sucesso.' });
    } catch (error) {
      next(error);
    }
  }
}

export default new ProductController();
