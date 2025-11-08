// src/middleware/role.middleware.js

/**
 * Middleware de Autorización Basado en Roles.
 * @param {Array<number>} rolesPermitidos - Un array de IDs de rol que tienen permiso. Ej: [1, 2]
 */
const checkRole = (rolesPermitidos) => {
  // Esta es la función de middleware real que usará Express
  return (req, res, next) => {
    
    // 1. Damos por sentado que authMiddleware (el anterior) ya se ejecutó
    // y nos dejó los datos del usuario en req.user
    if (!req.user || !req.user.rol) {
      // Esto no debería pasar si authMiddleware se usó primero
      return res.status(401).json({ message: 'Error de autenticación: datos de usuario no encontrados en el token.' });
    }

    const rolUsuario = req.user.rol; // Ej: 1 (Admin)

    // 2. Verificamos si el rol del usuario (del token) está en la lista de roles permitidos
    if (!rolesPermitidos.includes(rolUsuario)) {
      // 403 Forbidden: "Sé quién eres, pero tú no tienes permiso para esto"
      return res.status(403).json({ message: 'Acceso denegado: No tiene permisos para esta acción.' });
    }

    // 3. Si el rol es correcto, ¡adelante!
    next();
  };
};

module.exports = checkRole;