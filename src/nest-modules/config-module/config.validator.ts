import Joi from 'joi';
import { DB_SCHEMA_TYPE } from './config.types';

export const CONFIG_DB_SCHEMA: Joi.StrictSchemaMap<DB_SCHEMA_TYPE> = {
  DB_VENDOR: Joi.string().required().valid('postgres', 'sqlite'),
  DB_HOST: Joi.string().required(),
  DB_DATABASE: Joi.string().when('DB_VENDOR', {
    is: 'postgres',
    then: Joi.required(),
  }),
  DB_USERNAME: Joi.string().when('DB_VENDOR', {
    is: 'postgres',
    then: Joi.required(),
  }),
  DB_PASSWORD: Joi.string().when('DB_VENDOR', {
    is: 'postgres',
    then: Joi.required(),
  }),
  DB_PORT: Joi.number().integer().when('DB_VENDOR', {
    is: 'postgres',
    then: Joi.required(),
  }),
  DB_LOGGING: Joi.boolean().required(),
  DB_AUTO_LOAD_MODELS: Joi.boolean().required(),
};

export type CONFIG_SCHEMA_TYPE = DB_SCHEMA_TYPE;
