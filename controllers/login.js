const jwt = require('jsonwebtoken');
const User = require('../models/user');
const AutorizeError = require('../errors/authorize-error');

const { JWT_SECRET = 'yandex-dev-key-21' } = process.env;

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: '7d',
      });
      req.headers.authorization = `Bearer ${token}`;
      return res.send({ token });
    })
    .catch(() => {
      throw new AutorizeError('Неправильная почта или пароль');
    })
    .catch(next);
};
