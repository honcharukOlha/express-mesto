// если на сервере возникает ошибка,
// которую мы не предусмотрели, возвращаем ошибку 500
module.exports.handlingErrors = (res, req, err, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
};
