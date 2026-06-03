'use strict';

const Joi = require('joi');

const loginSchema = Joi.object({
  email:    Joi.string().email().lowercase().trim().required(),
  password: Joi.string().min(8).max(128).required(),
});

const refreshSchema = Joi.object({
  refresh_token: Joi.string().required(),
});

module.exports = { loginSchema, refreshSchema };
