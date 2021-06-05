const User = require("../models/user");

module.exports.getUser = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

module.exports.getUserById = (req, res) => {
  const ERROR_CODE = 404;
  User.findById(req.params.userId)
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error.name === "Error") {
        res.status(ERROR_CODE).send({
          message: "Пользователь не найден",
        });
        return;
      }
      res.status(500).send({ message: "Произошла ошибка" });
    });
};

module.exports.createUser = (req, res) => {
  const ERROR_CODE = 400;
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error.name === "Error") {
        res.status(ERROR_CODE).send({
          message:
            "Переданы некорректные данные в методы создания пользователя",
        });
        return;
      }
      res.status(500).send({ message: "Произошла ошибка" });
    });
};

module.exports.updateUser = (req, res) => {
  const ERROR_CODE = 400;
  const { name, about, owner = req.user._id } = req.body;
  User.findByIdAndUpdate(
    owner,
    {
      name,
      about,
    },
    {
      new: true,
    }
  )
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error.name === "Error") {
        res.status(ERROR_CODE).send({
          message: "Переданы некорректные данные в методы обновления профиля",
        });
        return;
      }
      res.status(500).send({ message: "Произошла ошибка" });
    });
};

module.exports.updateAvatar = (req, res) => {
  const ERROR_CODE = 400;
  const { avatar, owner = req.user._id } = req.body;
  User.findByIdAndUpdate(
    owner,
    { avatar },
    {
      new: true,
    }
  )
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error.name === "Error") {
        res.status(ERROR_CODE).send({
          message: "Переданы некорректные данные в методы обновления аватара",
        });
        return;
      }
      res.status(500).send({ message: "Произошла ошибка" });
    });
};
