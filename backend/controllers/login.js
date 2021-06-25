require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const AutorizeError = require('../errors/authorize-error');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', {
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
