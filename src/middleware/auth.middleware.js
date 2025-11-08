// src/middleware/auth.middleware.js

const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  // 1. Obtener el token del header
  const token = req.header('Authorization');

  // 2. Verificar si no hay token
  if (!token) {
    return res.status(401).json({ message: 'No hay token, permiso denegado' });
  }

  // 3. Verificar si el token tiene el formato correcto ("Bearer [token]")
  if (!token.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token inválido (Formato incorrecto)' });
  }

  try {
    // 4. Quitar "Bearer " del string y verificar el token
    const tokenSinBearer = token.split(' ')[1];
    const decoded = jwt.verify(tokenSinBearer, process.env.JWT_SECRET);

    // 5. Si es válido, agregamos los datos del usuario (payload) al objeto 'req'
    // para que las rutas protegidas sepan QUIÉN está haciendo la petición
    req.user = decoded; 
    
    // 6. Continuar con la siguiente función (el controlador)
    next();

  } catch (error) {
    res.status(401).json({ message: 'Token no es válido' });
  }
};

module.exports = authMiddleware;