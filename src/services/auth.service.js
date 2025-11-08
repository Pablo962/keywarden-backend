const authRepository = require('../repositories/auth.repository');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (nombre, email, password, rolId) => {
  
  const existingUser = await authRepository.findUserByEmail(email);
  if (existingUser) {
    throw new Error('El email ya está en uso');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  
  const newUserId = await authRepository.createUser(
    nombre, 
    email, 
    hashedPassword, 
    rolId
  );
  
  return newUserId;
};

const loginUser = async (email, password) => {
  
  const user = await authRepository.findUserByEmail(email);
  if (!user) {
    throw new Error('Credenciales inválidas');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Credenciales inválidas');
  }

  const payload = {
    id: user.id_usuario,
    rol: user.rol_id_rol,
  };

  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  delete user.password;
  return { user, token };
};

module.exports = {
  registerUser,
  loginUser,
};