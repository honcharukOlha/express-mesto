const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { login } = require('./controllers/login');
const { createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-error');

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

// регистрация и логин
app.post('/signup', createUser);
app.post('/signin', login);

// авторизация
app.use(auth);

app.use(bodyParser.json());
app.use('/users', auth, userRouter);
app.use('/cards', auth, cardRouter);
app.use('/*', (req, res) => {
  res.status(NotFoundError).send({
    message: 'Ресурс не найден',
  });
});

// если на сервере возникает ошибка,
// которую мы не предусмотрели, возвращаем ошибку 500
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT);
