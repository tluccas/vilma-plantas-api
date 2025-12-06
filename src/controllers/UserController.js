import UserService from '../services/UserService.js';
import { createUserSchema } from '../validators/userValidator.js';

const service = new UserService();

class UserController {
  async findAll(req, res, next) {
    try {
      const users = await service.findAll();
      return res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }

  async findById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await service.findById(id);
      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      await createUserSchema.validate(req.body, { abortEarly: false });

      const newUser = await service.create(req.body);

      return res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
