import UserService from '../services/UserService.js';
import { createUserSchema } from '../validators/userValidator.js';

const service = new UserService();

class UserController {

    async findAll(req, res) {
        const users = await service.findAll();
        return res.status(200).json(users);
    }

    async findById(req, res) {
        const { id } = req.params;
        const user = await service.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        return res.status(200).json(user);
    
    }

    async create(req, res) {
        try {
            await createUserSchema.validate(req.body, { abortEarly: false });

            const newUser = await service.create(req.body);

            return res.status(201).json(newUser);
        } catch (error) {

            if (error.name === 'ValidationError') {
                return res.status(400).json({ message: error.errors });
            }

            if (error.status) {
              return res.status(error.status).json({ message: error.message });
            }
            console.error('Erro no Controller ao criar usuário:', error);
            return res.status(500).json({ message: 'Erro interno ao criar usuário.' });
        }
    }
}

export default new UserController();