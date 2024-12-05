require('dotenv').config(); // Carrega as variáveis do .env

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Importando o CORS
const userRoutes = require('./routes/userRoutes'); // Rota para usuários
const registerRouter = require('./routes/authRoutes'); // Rota para autenticação
const server = express(); // Criando a instância do servidor

// Configuração do CORS (permite requisições de qualquer origem)
server.use(cors());

// Conexão com o MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Conectado ao MongoDB Atlas'))
  .catch((err) => console.log('Erro ao conectar ao MongoDB', err));

// Middleware para parsear JSON
server.use(express.json());

// Rotas
server.use('/api/users', userRoutes); // Rota de usuários
server.use('/api/auth', registerRouter); // Rota de autenticação (registro e login)
server.use('/api/quiz', quizRouter); // Rota do quiz
server.use('/api/wallet', walletRouter); // Rota da wallet

// Porta do servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
