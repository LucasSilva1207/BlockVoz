require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const registerRouter = require('./routes/authRoutes');

const server = express();

// Usando CORS
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

// Exportando o servidor para que o Vercel gerencie a execução
module.exports = server;
