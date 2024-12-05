const jwt = require('jsonwebtoken');

// Middleware para autenticar o token JWT
const authenticateToken = (req, res, next) => {
  // Recuperando o token do cabeçalho Authorization
  const token = req.header('Authorization')?.replace('Bearer ', '');

  // Se o token não for fornecido, retorna erro 403
  if (!token) {
    return res.status(403).json({ message: 'Acesso negado. Token não fornecido.' });
  }

  // Verificando o token com a chave secreta
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      // Se o token for inválido ou expirado, retorna erro 403
      return res.status(403).json({ message: 'Token inválido' });
    }

    // Armazenando os dados do usuário no objeto `req` para uso posterior
    req.user = user;

    // Continuar para o próximo middleware ou rota
    next();
  });
};

module.exports = authenticateToken;
