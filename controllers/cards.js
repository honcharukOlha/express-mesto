const Card = require('../models/card');

const NOT_FOUND_ERROR_MESSAGE = 'NotFound';

module.exports.getCard = (req, res) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const ERROR_CODE = 400;
  const { name, link, owner = req.user._id } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(ERROR_CODE).send({
          message: 'Переданы некорректные данные в методы создания карточки',
        });
        return;
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.likeCard = (req, res) => {
  const ERROR_CODE = 400;
  const ERROR_NOT_FOUND_CODE = 404;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => {
      Error(NOT_FOUND_ERROR_MESSAGE);
    })
    .then((card) => {
      if (card) {
        res.send({ data: card });
      }
    })
    .catch((error) => {
      if (error.message === NOT_FOUND_ERROR_MESSAGE) {
        res.status(ERROR_NOT_FOUND_CODE).send({
          message: 'Ресурс не найден',
        });
        return;
      }
      if (error.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Карточка не найдена' });
      }
    });
  res.status(500).send({ message: 'Произошла ошибка' });
};

module.exports.dislikeCard = (req, res) => {
  const ERROR_CODE = 400;
  const ERROR_NOT_FOUND_CODE = 404;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(() => {
      Error(NOT_FOUND_ERROR_MESSAGE);
    })
    .then((card) => {
      if (card) {
        res.send({ data: card });
      }
    })
    .catch((error) => {
      if (error.message === NOT_FOUND_ERROR_MESSAGE) {
        res.status(ERROR_NOT_FOUND_CODE).send({
          message: 'Ресурс не найден',
        });
        return;
      }
      if (error.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Карточка не найдена' });
      }
    });
  res.status(500).send({ message: 'Произошла ошибка' });
};

module.exports.deleteCard = (req, res) => {
  const ERROR_CODE = 400;
  const ERROR_NOT_FOUND_CODE = 404;
  const owner = req.user._id;
  Card.findOneAndDelete({ _id: req.params.id, owner })
    .orFail(() => {
      Error(NOT_FOUND_ERROR_MESSAGE);
    })
    .then((card) => {
      if (card) {
        res.send({ data: card });
      }
    })
    .catch((error) => {
      if (error.message === NOT_FOUND_ERROR_MESSAGE) {
        res.status(ERROR_NOT_FOUND_CODE).send({
          message: 'Ресурс не найден',
        });
        return;
      }
      if (error.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Карточка не найдена' });
      }
    });
  res.status(500).send({ message: 'Произошла ошибка' });
};
