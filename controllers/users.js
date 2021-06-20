const bcrypt = require('bcryptjs'); // импортируем bcrypt
const validator = require('validator');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const ValidationError = require('../errors/validation-error');
const ConflictError = require('../errors/conflict-error');

module.exports.getUser = (req, res, next) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => new NotFoundError({ message: 'Нет пользователя с таким id' }))
    .then((user) => {
      if (user) {
        res.send({ data: user });
      }
    })
    .catch(() => {
      throw new ValidationError({ message: 'Переданы некорректные данные' });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  if (!email || !password) {
    throw new ConflictError({ message: 'Не заполнены обязательные поля' });
  }
  if (!validator.isEmail(email)) {
    throw new ValidationError({ message: 'Переданы некорректные данные' });
  }
  // хешируем пароль
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(200).send({
      _id: user._id,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        const error = new ConflictError({ message: 'Пользователь с указанным email уже существует' });
        error.statusCode = error;
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
    .orFail(() => new NotFoundError({ message: 'Нет пользователя с таким id' }))
    .then((user) => {
      if (user) {
        res.send({ data: user });
      }
    })
    .catch(() => {
      throw new ValidationError({ message: 'Переданы некорректные данные' });
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
    .orFail(() => new NotFoundError({ message: 'Нет пользователя с таким id' }))
    .then((user) => {
      if (user) {
        res.send({ data: user });
      }
    })
    .catch(() => {
      throw new ValidationError({ message: 'Переданы некорректные данные' });
    })
    .catch(next);
};

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => new NotFoundError({ message: 'Нет пользователя с таким id' }))
    .then((user) => {
      if (user) {
        res.send({ data: user });
      }
    })
    .catch(() => {
      throw new ValidationError({ message: 'Переданы некорректные данные' });
    })
    .catch(next);
};
