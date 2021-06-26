const bcrypt = require('bcryptjs'); // импортируем bcrypt
const validator = require('validator');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const ValidationError = require('../errors/validation-error');
const ConflictError = require('../errors/conflict-error');

module.exports.getUser = (req, res, next) => {
  User.find({})
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params._id)
    .orFail(() => new NotFoundError('Пользователь не найден'))
    .then((user) => {
      if (user) {
        res.send(user);
      }
    })
    .catch(() => {
      throw new ValidationError('Переданы некорректные данные');
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;
  if (!email || !password) {
    throw new ConflictError('Не заполнены обязательные поля');
  }
  if (!validator.isEmail(email)) {
    throw new ValidationError('Переданы некорректные данные');
  }
  // хешируем пароль
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) =>
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      }),
    )
    .then((user) =>
      res.status(200).send({
        _id: user._id,
        email: user.email,
      }),
    )
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        const error = new ConflictError(
          'Пользователь с указанным email уже существует',
        );
        error.statusCode = 409;
        next(error);
      }
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, about, owner = req.user._id } = req.body;
  User.findByIdAndUpdate(
    owner,
    {
      name,
      about,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => new NotFoundError('Пользователь не найден'))
    .then((user) => {
      if (user) {
        res.send(user);
      }
    })
    .catch(() => {
      throw new ValidationError('Переданы некорректные данные');
    })
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar, owner = req.user._id } = req.body;
  User.findByIdAndUpdate(
    owner,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => new NotFoundError('Пользователь не найден'))
    .then((user) => {
      if (user) {
        res.send(user);
      }
    })
    .catch(() => {
      throw new ValidationError('Переданы некорректные данные');
    })
    .catch(next);
};

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => new NotFoundError('Нет пользователя с таким id'))
    .then((user) => {
      if (user) {
        res.send(user);
      }
    })
    .catch(() => {
      throw new ValidationError('Переданы некорректные данные');
    })
    .catch(next);
};
