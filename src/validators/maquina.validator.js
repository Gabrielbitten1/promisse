'use strict';

const Joi = require('joi');

const maquinaSchema = Joi.object({
  unidadeId:           Joi.string().required(),
  tag:                 Joi.string().max(50).required(),
  descricao:           Joi.string().max(255).required(),
  fabricante:          Joi.string().max(100).required(),
  modelo:              Joi.string().max(100).required(),
  anoFabricacao:       Joi.number().integer().min(1900).max(new Date().getFullYear()).required(),
  numeroDeSerie:       Joi.string().max(100).optional(),
  potenciaKw:          Joi.number().positive().optional(),
  status:              Joi.string().valid('OPERACIONAL','EM_MANUTENCAO','INTERDITADA','DESATIVADA').optional(),
  nivelRisco:          Joi.string().valid('BAIXO','MEDIO','ALTO','CRITICO').optional(),
  dataUltimaInspecao:  Joi.date().iso().optional(),
  dataProximaInspecao: Joi.date().iso().optional(),
  laudoNr12Url:        Joi.string().uri().max(500).optional(),
  observacoes:         Joi.string().max(2000).optional(),
});

module.exports = { maquinaSchema };
