const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const ERROR_CODE = 404;

const { PORT = 3000 } = process.env;
// создаем приложение
const app = express();

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mongodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use((req, res, next) => {
  req.user = {
    _id: '60bbd155ced30743a0df97b5',
  };

  next();
});

app.use(bodyParser.json());
app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use('/*', (req, res) => {
  res.status(ERROR_CODE).send({
    message: 'Ресурс не найден',
  });
});

app.listen(PORT);
