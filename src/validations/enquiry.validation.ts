import Joi from "joi";

const validateCreateEnquiry = Joi.object({
  fullName: Joi.string().min(2).required(),
  phone: Joi.string().allow(null),
  email: Joi.allow(null),
  contactChoice: Joi.string().min(2).required(),
  role: Joi.allow(null),
  message: Joi.allow(null),
});

export { validateCreateEnquiry };
