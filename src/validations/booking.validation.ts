import Joi from "joi";

const validateCreateBooking = Joi.object({
  orderdedBy: Joi.string().min(2).required(),
  matchedRiders: Joi.string().allow(null),
  riderId: Joi.allow(null),
  pickUp: Joi.string().min(2).required(),
  destination: Joi.allow(null),
  price: Joi.number().required(),
  status: Joi.allow(null),
});

export { validateCreateBooking };
