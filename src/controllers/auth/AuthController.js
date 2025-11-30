import User from '../../database/models/User.js';
import JWT from 'jsonwebtoken';
import authConfig from '../../config/authConfig.js';

class AuthController {
  async create(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ message: 'Senha incorreta' });
    }

    const { id, name, role } = user;

    const token =
      ('token',
      JWT.sign({ id, role }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }));

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 48 * 60 * 60 * 1000, // 48 horas
      path: '/',
    });

    return res.json({
      user: { id, name, email, role },
      message: 'Authenticação realizada com sucesso!',
    });
  }

  async delete(req, res) {
    res.clearCookie('token', { path: '/' });
    return res.json({ message: 'Logout realizado com sucesso!' });
  }

  async profile(req, res) {
    try {
      const user = await User.findByPk(req.userId, {
        attributes: ['id', 'name', 'email', 'role'],
      });

      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      return res.json({
        user,
        authenticated: true,
      });
    } catch (error) {
      return res.status(500).json({ error, message: 'Erro interno do servidor' });
    }
  }
}

export default new AuthController();
