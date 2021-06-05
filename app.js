const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/users");
const cardRouter = require("./routes/cards");

const { PORT = 3000 } = process.env;
// создаем приложение
const app = express();

// подключаемся к серверу mongo
mongoose.connect("mongodb://localhost:27017/mongodb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use((req, res, next) => {
  req.user = {
    _id: "60bbd155ced30743a0df97b5",
  };

  next();
});

app.use("/users", userRouter);
app.use("/cards", cardRouter);

app.listen(PORT, () => {
  console.log("Ссылка на сервер");
});
