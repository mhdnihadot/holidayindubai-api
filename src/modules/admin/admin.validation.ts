import Joi from 'joi';

export const register = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
};

export const login = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

export const updateProfile = {
  body: Joi.object().keys({
    name: Joi.string(),
    email: Joi.string().email(),
  }).min(1),
};
