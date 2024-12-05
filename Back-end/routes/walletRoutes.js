const express = require('express');
const router = express.Router();
const Usuario = require('../models/user');

// Endpoint para ver o saldo de moedas do usuário
router.get('/saldo', async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: 'O ID do usuário é obrigatório' });
  }

  try {
    const usuario = await Usuario.findById(userId);
    if (!usuario) {
      return res.status(400).json({ message: 'Usuário não encontrado' });
    }

    res.status(200).json({ saldo: usuario.moedas });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar o saldo', error: error.message });
  }
});

// Endpoint para visualizar o histórico de transações (supondo que você tenha essa estrutura)
router.get('/historico', async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: 'O ID do usuário é obrigatório' });
  }

  try {
    const usuario = await Usuario.findById(userId);
    if (!usuario) {
      return res.status(400).json({ message: 'Usuário não encontrado' });
    }

    // Supondo que você tenha um histórico de transações armazenado no modelo de usuário
    res.status(200).json({ historico: usuario.historicoTransacoes || [] });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar o histórico', error: error.message });
  }
});

module.exports = router;
