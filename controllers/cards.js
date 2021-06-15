const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-error');
const ValidationError = require('../errors/validation-error');
const ForbiddenError = require('../errors/forbidden-error');

module.exports.getCard = (req, res, next) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link, owner = req.user._id } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch(() => {
      throw new ValidationError({ message: 'Переданы некорректные данные' });
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new NotFoundError({ message: 'Нет пользователя с таким id' }))
    .then((card) => {
      if (card) {
        res.send({ data: card });
      }
    })
    .catch(() => {
      throw new ValidationError({ message: 'Переданы некорректные данные' });
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(() => new NotFoundError({ message: 'Нет пользователя с таким id' }))
    .then((card) => {
      if (card) {
        res.send({ data: card });
      }
    })
    .catch(() => {
      throw new ValidationError({ message: 'Переданы некорректные данные' });
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  const owner = req.user._id;
  const { _cardId } = req.params;
  const SUCCESS = 200;
  Card.findOneAndDelete({ _id: req.params.cardId, owner })
    .orFail(() => new NotFoundError({ message: 'Нет пользователя с таким id' }))
    .then((card) => {
      if (card.owner) {
        Card.findByIdAndDelete(_cardId).then(() => {
          res.status(SUCCESS).send({ message: 'Карточка успешно удалена' });
        });
      } else {
        throw new ForbiddenError({
          message: 'Удаление карточек других пользователей невозможно',
        });
      }
    })
    .catch(() => {
      throw new ValidationError({ message: 'Переданы некорректные данные' });
    })
    .catch(next);
};
