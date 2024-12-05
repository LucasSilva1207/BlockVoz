const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Registro
exports.register = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    // Verifica se o usuário já está cadastrado
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'E-mail já cadastrado!' });
    }

    // Criptografa a senha antes de salvar
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(senha, salt);

    // Cria um novo usuário
    const newUser = await User.create({ nome, email, senha: hashedPassword });

    res.status(201).json({ message: 'Usuário registrado com sucesso!', user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro no servidor!' });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Verifica se o usuário existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado!' });
    }

    // Verifica se a senha está correta
    const isMatch = await bcrypt.compare(senha, user.senha);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciais inválidas!' });
    }

    // Gera um token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login bem-sucedido!', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro no servidor!' });
  }
};
