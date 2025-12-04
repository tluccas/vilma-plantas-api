import { createProductSchema } from '../validators/productValidator.js';
import ProductService from '../services/ProductService.js ';
import { logger } from '../util/logger.js';

const service = new ProductService();

class ProductController {
  async getProducts(req, res) {
    try {
      const productsData = await service.getProducts(req.query);
      return res.status(200).json(productsData);
    } catch (error) {
      logger.error('Erro no Controller ao buscar produtos:', error);
      return res.status(500).json({ error: 'Erro interno ao buscar produtos.' });
    }
  }

  async create(req, res) {
    try {
      await createProductSchema.validate(req.body, { abortEarly: false });

      const newProduct = await service.create(req.body);

      return res.status(201).json(newProduct);
    } catch (error) {
      logger.error('Erro no Controller ao criar produto:', error);
      return res.status(500).json({ error: error.message || 'Erro interno ao criar produto.' });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      await service.delete(id);
      return res.status(200).json({ message: 'Produto deletado com sucesso.' });
    } catch (error) {
      logger.error('Erro no Controller ao deletar produto:', error);
      return res.status(500).json({ error: error.message || 'Erro interno ao deletar produto.' });
    }
  }
}

export default new ProductController();
