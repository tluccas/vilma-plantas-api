import models from '../database/index.js';
const { User } = models;

export default class UserService {
    async findAll() {
        return await User.findAll({ attributes: { exclude: ['password'] } });
    }

    async findById(id) {
        return await User.findByPk(id, { attributes: { exclude: ['password'] } });
    }

    async create(userData) {
        try {
            const emailExists = await User.findOne({ where: { email: userData.email } });
            if (emailExists) {
                const error = new Error('Email já está em uso');
                error.status = 400;
                throw error;
            }

            const newUser = await User.create(userData);
            return { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role };
        }catch (error) {
             console.error('Erro ao criar usuário:', error);
             throw error.status ? error : new Error('Não foi possível criar o usuário.');
        }
    }
}
