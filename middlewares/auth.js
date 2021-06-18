const jwt = require('jsonwebtoken');
const AuthorizeError = require('../errors/authorize-error');

const { JWT_SECRET = 'yandex-dev-key-21' } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new AuthorizeError({ message: 'Необходима авторизация' }));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    // отправляем ошибку, если не получилось
    next(new AuthorizeError({ message: 'Необходима авторизация' }));
  }
  req.user = payload; // записываем пейлоуд в объект запроса
  return next(); // пропускаем запрос дальше
};
