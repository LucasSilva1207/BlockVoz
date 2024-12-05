const express = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/user');  
const router = express.Router();

// Função para validar e-mail
const validarEmail = (email) => {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(email);
};

// Endpoint de Cadastro de Usuário
router.post('/register', async (req, res) => {
  const { nome, email, senha } = req.body;

  // Verifica se os campos obrigatórios foram enviados
  if (!nome || !email || !senha) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
  }

  // Valida o formato do e-mail
  if (!validarEmail(email)) {
    return res.status(400).json({ message: 'Email inválido' });
  }

  try {
    // Verifica se já existe um usuário com o mesmo email
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }

    // Cria um novo usuário no banco de dados
    const usuario = new Usuario({
      nome,
      email,
      senha, // Senha armazenada diretamente sem criptografia
    });

    // Salva o usuário no banco de dados
    await usuario.save();

    // Gera o token JWT para o usuário
    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Retorna uma resposta com sucesso e o token
    res.status(201).json({ message: 'Usuário cadastrado com sucesso', token });
  } catch (error) {
    console.error('Erro ao cadastrar o usuário:', error);
    res.status(500).json({ message: 'Erro ao cadastrar o usuário', error: error.message });
  }
});

// Endpoint de Login de Usuário
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  // Verifica se os campos obrigatórios foram enviados
  if (!email || !senha) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios' });
  }

  // Valida o formato do e-mail
  if (!validarEmail(email)) {
    return res.status(400).json({ message: 'Email inválido' });
  }

  try {
    // Verifica se o usuário existe no banco de dados
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ message: 'Usuário não encontrado' });
    }

    // Comparação direta das senhas (sem criptografia)
    if (senha !== usuario.senha) {
      return res.status(400).json({ message: 'Senha incorreta' });
    }

    // Gera o token JWT
    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login bem-sucedido', token });
  } catch (error) {
    console.error('Erro ao realizar o login:', error);
    res.status(500).json({ message: 'Erro ao realizar o login', error: error.message });
  }
});

// Endpoint de Reset de Senha (se desejar incluir esta funcionalidade)
router.post('/reset-senha', async (req, res) => {
  const { email } = req.body;

  // Verifica se o e-mail foi fornecido
  if (!email) {
    return res.status(400).json({ message: 'O e-mail é obrigatório' });
  }

  // Valida o formato do e-mail
  if (!validarEmail(email)) {
    return res.status(400).json({ message: 'Email inválido' });
  }

  try {
    // Verifica se o usuário existe no banco de dados
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ message: 'Usuário não encontrado' });
    }

    res.status(200).json({ message: 'Link de reset de senha enviado para o e-mail' });
  } catch (error) {
    console.error('Erro ao tentar resetar a senha:', error);
    res.status(500).json({ message: 'Erro ao tentar resetar a senha', error: error.message });
  }
});

// Rota para atualizar as moedas
router.post('/atualizarmoedas', async (req, res) => {
  try {
    const { userId, moedasGanhas } = req.body;

    // Verificar se os parâmetros foram passados corretamente
    if (!userId || !moedasGanhas) {
      return res.status(400).json({ message: 'ID do usuário e quantidade de moedas são obrigatórios' });
    }

    // Verificar se moedasGanhas é um número válido
    if (typeof moedasGanhas !== 'number' || moedasGanhas <= 0) {
      return res.status(400).json({ message: 'Quantidade de moedas deve ser um número positivo' });
    }

    // Encontrar o usuário pelo ID
    const user = await Usuario.findById(userId); 

    // Verificar se o usuário foi encontrado
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Atualizar as moedas do usuário
    user.moedas += moedasGanhas;

    // Adicionar transação de moedas
    user.historicoTransacoes.push({
      tipo: 'ganho',
      quantidade: moedasGanhas,
      data: new Date(),  // Adicionando data para registro da transação
    });

    // Salvar as alterações no banco de dados
    await user.save();

    // Responder com sucesso e as novas moedas
    return res.status(200).json({ message: 'Moedas atualizadas com sucesso', moedas: user.moedas });
  } catch (error) {
    console.error('Erro ao atualizar as moedas:', error);
    return res.status(500).json({ message: 'Erro interno ao atualizar as moedas', error: error.message });
  }
});

module.exports = router;
