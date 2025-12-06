import models from '../database/index.js';
const { User } = models;
import { NotFoundError, ConflictError, AppError } from '../util/error/index.js';

export default class UserService {
  async findAll() {
    const allUsers = await User.findAll({ attributes: { exclude: ['password'] } });
    return allUsers;
  }

  async findById(id) {
    const user = await User.findByPk(id, { attributes: { exclude: ['password'] } });
    if (!user) {
      throw new NotFoundError('Usuário não encontrado');
    }
    return user;
  }

  async create(userData) {
    try {
      const emailExists = await User.findOne({ where: { email: userData.email } });
      if (emailExists) {
        throw new ConflictError('Email já cadastrado.');
      }

      const newUser = await User.create(userData);
      return { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role };
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }

      throw new AppError('Erro ao criar usuário', 500);
    }
  }
}
