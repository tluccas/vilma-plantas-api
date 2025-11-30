import { createProductSchema } from '../validators/productValidator.js';
import ProductService from '../services/ProductService.js ';

const service = new ProductService();

class ProductController {

    async getProducts(req, res) {
        try {
            const productsData = await service.getProducts(req.query);
            return res.status(200).json(productsData);
        } catch (error) {
            console.error('Erro no Controller ao buscar produtos:', error);
            return res.status(500).json({ message: 'Erro interno ao buscar produtos.' });
        }
    }

    async create(req, res){
        try {
            await createProductSchema.validate(req.body, { abortEarly: false });

            const newProduct = await service.create(req.body);

            return res.status(201).json(newProduct);
        } catch (error) {
            console.error('Erro no Controller ao criar produto:', error);
            return res.status(500).json({ message: 'Erro interno ao criar produto.' });
        }
    }
}

export default new ProductController();