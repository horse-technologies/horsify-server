import Joi from "joi";

const validateSiteVisit = Joi.object({
  appSite: Joi.string().min(2).required(),
  page: Joi.string().min(1).required(),
  time: Joi.date(),
  geoData: Joi.object({
    query: Joi.allow(null),
    status: Joi.allow(null),
    country: Joi.allow(null),
    countryCode: Joi.allow(null),
    region: Joi.allow(null),
    regionName: Joi.allow(null),
    city: Joi.allow(null),
    zip: Joi.allow(null),
    lat: Joi.number().allow(null),
    lon: Joi.number().allow(null),
    timezone: Joi.allow(null),
    isp: Joi.allow(null),
    org: Joi.allow(null),
    as: Joi.allow(null),
  }),
});

export { validateSiteVisit };
