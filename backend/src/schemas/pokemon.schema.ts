import * as Joi from 'joi';

export const pokemonListItemSchema = Joi.object({
  name: Joi.string().required(),
  url: Joi.string().uri().required(),
}).unknown(true);

export const pokemonDetailsSchema = Joi.object({
  name: Joi.string().required(),
  height: Joi.number().integer().required(),
  weight: Joi.number().integer().required(),
  baseExperience: Joi.number().integer().required(),
  sprite_front: Joi.string().uri().required(),
  sprite_back: Joi.string().uri().allow(null),
  stat_speed: Joi.number().integer().required(),
  url: Joi.string().uri().required(),
}).unknown(true);

export const pokemonListSchema = Joi.object({
  results: Joi.array().items(pokemonListItemSchema).required(),
}).unknown(true);
