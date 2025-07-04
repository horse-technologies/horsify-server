import Joi from "joi";

const validateLicenseRequest = Joi.object({
  fullName: Joi.string().min(2).required(),
  phone: Joi.string().min(2).required(),
  email: Joi.string().allow(null),
  dateOfBirth: Joi.date().required(),
  region: Joi.string().min(2).required(),
  idMeans: Joi.string().min(2).required(),
});

export { validateLicenseRequest };
