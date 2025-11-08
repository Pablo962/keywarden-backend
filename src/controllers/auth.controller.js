// src/controllers/auth.controller.js

const authService = require('../services/auth.service');

const register = async (req, res) => {
  try {
    // --- ¡CAMBIO! Ya no leemos id_usuario ---
    const { nombre, email, password, rol_id_rol } = req.body;

    // Actualizamos la validación
    if (!nombre || !email || !password || !rol_id_rol) {
      return res.status(400).json({ message: 'Los campos nombre, email, password y rol_id_rol son obligatorios' });
    }

    const newUserId = await authService.registerUser(
      nombre, 
      email, 
      password, 
      rol_id_rol
    );
    
    res.status(201).json({ 
      message: 'Usuario registrado exitosamente', 
      userId: newUserId // Devolvemos el ID que generó la BD
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email y password son obligatorios' });
    }
    const data = await authService.loginUser(email, password);
    res.status(200).json(data);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
};