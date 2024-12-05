const express = require('express');
const router = express.Router();
const Usuario = require('../models/user');
const authenticateToken = require('../middlewares/authMiddleware');

// Endpoint de Obter Dados do Usuário
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.user.id);
    if (!usuario) return res.status(404).json({ message: 'Usuário não encontrado' });
    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao obter dados do usuário' });
  }
});

module.exports = router;
