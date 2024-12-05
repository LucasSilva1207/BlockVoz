const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  moedas: { type: Number, default: 0 },
  historicoJogos: [
    {
      data: { type: String }, 
      perguntasRespondidas: { type: Number, default: 0 },
    },
  ],
  historicoTransacoes: [
    {
      tipo: { type: String },
      quantidade: { type: Number },
    },
  ],
});

module.exports = mongoose.model('User', userSchema);
