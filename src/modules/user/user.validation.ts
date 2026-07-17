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
    phone: Joi.string().allow('', null).optional(),
    avatar: Joi.string().uri().allow('', null).optional(),
  }).min(1),
};
