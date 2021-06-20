// если на сервере возникает ошибка,
// которую мы не предусмотрели, возвращаем ошибку 500
module.exports = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode)
    .header('Content-Type', 'application/json')
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
};
