const express = require('express');
const router = express.Router();
const Usuario = require('../models/user');

// Função para validar se o ID é um ObjectId válido do MongoDB
const mongoose = require('mongoose');
const validarObjectId = (id) => mongoose.Types.ObjectId.isValid(id);


// Rota para processar a resposta do quiz e somar moedas
router.post('/resposta', async (req, res) => {
  const { userId, perguntaId, respostaSelecionada, respostaCorreta } = req.body;

  if (!userId || !validarObjectId(userId)) {
    return res.status(400).json({ message: 'ID do usuário inválido ou ausente' });
  }

  if (!perguntaId || respostaSelecionada === undefined) {
    return res.status(400).json({ message: 'Pergunta ou resposta ausente' });
  }

  try {
    const usuario = await Usuario.findById(userId);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Verificar se o usuário já jogou hoje
    const hoje = new Date().toISOString().split('T')[0]; // Data atual no formato AAAA-MM-DD
    const jaJogouHoje = usuario.historicoJogos.some(
      (jogo) => jogo.data === hoje
    );

    if (jaJogouHoje) {
      return res.status(400).json({ 
        message: 'Você já jogou hoje. Tente novamente amanhã.' 
      });
    }

    // Verificar se a resposta está correta
    let mensagem = 'Resposta incorreta.';
    if (respostaSelecionada === respostaCorreta) {
      usuario.moedas += 10;
      mensagem = 'Resposta correta! Moedas somadas.';
    }

    // Registrar o jogo no histórico
    usuario.historicoJogos.push({ data: hoje, perguntasRespondidas: 1 });

    // Salvar as alterações
    await usuario.save();

    // Retornar a resposta com o saldo atualizado
    res.status(200).json({ 
      message: mensagem,
      saldo: usuario.moedas,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: 'Erro ao processar a resposta', 
      error: error.message 
    });
  }
});


module.exports = router;
