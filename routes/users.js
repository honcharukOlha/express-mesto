const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUser,
  getUserById,
  updateUser,
  updateAvatar,
  getUserInfo,
} = require('../controllers/users');

router.get('/', getUser);

router.get('/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().length(24).hex(),
  }),
}), getUserById);

router.patch('/:me', celebrate({
  params: Joi.object().keys({
    name: Joi.string().required().min(2).max(24),
    about: Joi.string().required().min(2).max(24),
  }).unknown(true),
}), updateUser);

router.patch('/:me/avatar', celebrate({
  params: Joi.object().keys({
    avatar: Joi.string().required().regex(/^(https?:\/\/)([\da-z.-]+)\.([a-z.]{2,6})([/\w\W.-]*)#?$/),
  }),
}), updateAvatar);

router.get('/:users/me', getUserInfo);

module.exports = router;
