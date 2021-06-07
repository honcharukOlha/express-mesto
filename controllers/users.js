const User = require('../models/user');

const NOT_FOUND_ERROR_MESSAGE = 'NotFound';

module.exports.getUser = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.getUserById = (req, res) => {
  const ERROR_CODE = 400;
  const ERROR_NOT_FOUND_CODE = 404;
  User.findById(req.params.userId)
    .orFail(() => {
      Error(NOT_FOUND_ERROR_MESSAGE);
    })
    .then((user) => {
      if (user) {
        res.send({ data: user });
      }
    })
    .catch((error) => {
      if (error.message === NOT_FOUND_ERROR_MESSAGE) {
        res.status(ERROR_NOT_FOUND_CODE).send({
          message: 'Ресурс не найден'
        });
        return;
      }
      if (error.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Пользователь не найден' });
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.createUser = (req, res) => {
  const ERROR_CODE = 400;
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(ERROR_CODE).send({
          message: 'Переданы некорректные данные в методы создания пользователя'
        });
        return;
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.updateUser = (req, res) => {
  const ERROR_CODE = 400;
  const ERROR_NOT_FOUND_CODE = 404;
  const { name, about, owner = req.user._id } = req.body;
  User.findByIdAndUpdate(
    owner,
    {
      name,
      about
    },
    {
      new: true,
      runValidators: true
    }
  )
    .orFail(() => {
      Error(NOT_FOUND_ERROR_MESSAGE);
    })
    .then((user) => {
      if (user) {
        res.send({ data: user });
      }
    })
    .catch((error) => {
      if (error.message === NOT_FOUND_ERROR_MESSAGE) {
        res.status(ERROR_NOT_FOUND_CODE).send({
          message: 'Ресурс не найден'
        });
        return;
      }
      if (error.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'Пользователь не найден' });
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.updateAvatar = (req, res) => {
  const ERROR_CODE = 400;
  const ERROR_NOT_FOUND_CODE = 404;
  const { avatar, owner = req.user._id } = req.body;
  User.findByIdAndUpdate(
    owner,
    { avatar },
    {
      new: true,
      runValidators: true
    }
  )
    .orFail(() => {
      Error(NOT_FOUND_ERROR_MESSAGE);
    })
    .then((user) => {
      if (user) {
        res.send({ data: user });
      }
    })
    .catch((error) => {
      if (error.message === NOT_FOUND_ERROR_MESSAGE) {
        res.status(ERROR_NOT_FOUND_CODE).send({
          message: 'Ресурс не найден'
        });
        return;
      }
      if (error.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'Пользователь не найден' });
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};
