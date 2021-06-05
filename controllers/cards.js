const Card = require("../models/card");

module.exports.getCard = (req, res) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

module.exports.createCard = (req, res) => {
  const ERROR_CODE = 400;
  const { name, link, owner = req.user._id } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((error) => {
      if (error.name === "Error") {
        res.status(ERROR_CODE).send({
          message: "Переданы некорректные данные в методы создания карточки",
        });
        return;
      }
      res.status(500).send({ message: "Произошла ошибка" });
    });
};

module.exports.likeCard = (req, res) => {
  const ERROR_CODE = 404;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .then((card) => res.send({ data: card }))
    .catch((error) => {
      if (error.name === "Error") {
        res.status(ERROR_CODE).send({
          message: "Карточка не найдена",
        });
        return;
      }
      res.status(500).send({ message: "Произошла ошибка" });
    });
};

module.exports.dislikeCard = (req, res) => {
  const ERROR_CODE = 404;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
    .then((card) => res.send({ data: card }))
    .catch((error) => {
      if (error.name === "Error") {
        res.status(ERROR_CODE).send({
          message: "Карточка не найдена",
        });
        return;
      }
      res.status(500).send({ message: "Произошла ошибка" });
    });
};

module.exports.deleteCard = (req, res, next) => {
  const ERROR_CODE = 404;
  const owner = req.user._id;
  Card.findOneAndDelete({ _id: req.params.id, owner })
    .then((card) => res.send({ data: card }))
    .catch((error) => {
      if (error.name === "Error") {
        res.status(ERROR_CODE).send({
          message: "Карточка с указанным _id не найдена",
        });
        return;
      }
      res.status(500).send({ message: "Произошла ошибка" });
    });
};
