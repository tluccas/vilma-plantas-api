import JWT from 'jsonwebtoken';
import authConfig from '../../config/authConfig.js';

export default function authMiddleware (req, res, next) {
    const token = req.cookies.token;

    if(!token) {
        return res.status(401).json({ error: 'Não autenticado' });
    }
    
    try {
        const decoded = JWT.verify(token, authConfig.secret);
        req.userId = decoded.id;
        req.userRole = decoded.role;
        return next();
    // eslint-disable-next-line no-unused-vars
    }catch (error) {
        return res.status(401).json({ error: 'Token inválido' });
    }
}