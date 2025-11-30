export default function roleMiddleware(...allowedRoles) {
    return (req, res, next) => {
        
        if (!req.userRole) {
            return res.status(403).json({ error: 'Usuário sem role' });
        }

        if (!allowedRoles.includes(req.userRole)) {
            return res.status(403).json({ error: 'Acesso negado: role não autorizada. Roles permitidas: ' + allowedRoles.join(', ') 
                
            });
        }

        return next();
    };

}