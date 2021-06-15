const jwt = require('jsonwebtoken');
const User = require('../models/user');
const AutorizeError = require('../errors/autorize-error');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', {
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
