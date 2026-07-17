import Joi from 'joi';

export const createProject = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    subtitle: Joi.string().allow('', null),
    description: Joi.string().required(),
    location: Joi.string().allow('', null),
    googleMapUrl: Joi.string().allow('', null),
    emirate: Joi.string().valid('Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah').allow('', null),
    category: Joi.string().allow('', null),
    duration: Joi.string().allow('', null),
    bestTime: Joi.string().allow('', null),
    bestSeason: Joi.string().allow('', null),
    outdoor: Joi.boolean().allow(null),
    highlights: Joi.array().items(Joi.object({
      icon: Joi.string().allow('', null),
      text: Joi.string().allow('', null)
    })).allow(null),
    idealFor: Joi.array().items(Joi.object({
      icon: Joi.string().allow('', null),
      text: Joi.string().allow('', null)
    })).allow(null),
    distanceFromCity: Joi.string().allow('', null),
    nearbyLandmarks: Joi.array().items(Joi.string()).allow(null),
    dressCode: Joi.object({
      recommended: Joi.string().allow('', null),
      avoid: Joi.string().allow('', null)
    }).allow(null),
    safetyAndComfort: Joi.array().items(Joi.object({
      icon: Joi.string().allow('', null),
      title: Joi.string().allow('', null),
      description: Joi.string().allow('', null)
    })).allow(null),
    accessibility: Joi.array().items(Joi.object({
      icon: Joi.string().allow('', null),
      title: Joi.string().allow('', null),
      description: Joi.string().allow('', null)
    })).allow(null),
    experienceSteps: Joi.array().items(Joi.object({
      title: Joi.string().allow('', null),
      content: Joi.string().allow('', null)
    })).allow(null),
    platformUrl: Joi.string().uri().allow('', null),
    status: Joi.string().valid('active', 'inactive', 'completed'),
    images: Joi.array().items(Joi.string()),
  }),
};

export const updateProject = {
  body: Joi.object().keys({
    title: Joi.string(),
    subtitle: Joi.string().allow('', null),
    description: Joi.string(),
    location: Joi.string().allow('', null),
    googleMapUrl: Joi.string().allow('', null),
    emirate: Joi.string().valid('Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah').allow('', null),
    category: Joi.string().allow('', null),
    duration: Joi.string().allow('', null),
    bestTime: Joi.string().allow('', null),
    bestSeason: Joi.string().allow('', null),
    outdoor: Joi.boolean().allow(null),
    highlights: Joi.array().items(Joi.object({
      icon: Joi.string().allow('', null),
      text: Joi.string().allow('', null)
    })).allow(null),
    idealFor: Joi.array().items(Joi.object({
      icon: Joi.string().allow('', null),
      text: Joi.string().allow('', null)
    })).allow(null),
    distanceFromCity: Joi.string().allow('', null),
    nearbyLandmarks: Joi.array().items(Joi.string()).allow(null),
    dressCode: Joi.object({
      recommended: Joi.string().allow('', null),
      avoid: Joi.string().allow('', null)
    }).allow(null),
    safetyAndComfort: Joi.array().items(Joi.object({
      icon: Joi.string().allow('', null),
      title: Joi.string().allow('', null),
      description: Joi.string().allow('', null)
    })).allow(null),
    accessibility: Joi.array().items(Joi.object({
      icon: Joi.string().allow('', null),
      title: Joi.string().allow('', null),
      description: Joi.string().allow('', null)
    })).allow(null),
    experienceSteps: Joi.array().items(Joi.object({
      title: Joi.string().allow('', null),
      content: Joi.string().allow('', null)
    })).allow(null),
    platformUrl: Joi.string().uri().allow('', null),
    status: Joi.string().valid('active', 'inactive', 'completed'),
    images: Joi.array().items(Joi.string()),
  }).min(1),
};
