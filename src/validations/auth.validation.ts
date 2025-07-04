import Joi from "joi";

const loginValidation = Joi.object({
  email: Joi.string(),
  password: Joi.string(),
});

const validateUser = Joi.object({
  firstName: Joi.string().min(1),
  lastName: Joi.string().min(1),
  email: Joi.string().email(),
  password: Joi.string(),
  mobile: Joi.string(),
  country: Joi.string(),
  birth_date: Joi.string(),
  gender: Joi.string(),
  city: Joi.string(),
});

const validateRevokeRefreshToken = Joi.object({
  userId: Joi.string(),
});

const validateResetPassword = Joi.object({
  token: Joi.string(),
  newpassword: Joi.string().min(5).max(15),
  mobile: Joi.string(),
});

const validateChangePassword = Joi.object({
  oldpassword: Joi.string().min(5).max(15),
  newpassword: Joi.string().min(5).max(15),
});

export {
  validateUser,
  validateRevokeRefreshToken,
  validateResetPassword,
  validateChangePassword,
  loginValidation,
};
