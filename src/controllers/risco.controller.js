'use strict';

const prisma = require('../config/database');

const list = async (req, res, next) => {
  try {
    const { tipo, nivelRisco, unidadeId, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = {
      unidade: { empresaId: req.user.empresaId },
      ativo: true,
      ...(tipo && { tipo }),
      ...(nivelRisco && { nivelRisco }),
      ...(unidadeId && { unidadeId }),
    };
    const [data, total] = await Promise.all([
      prisma.risco.findMany({ where, skip, take: parseInt(limit), orderBy: { nivelRisco: 'desc' }, include: { unidade: { select: { nome: true } } } }),
      prisma.risco.count({ where }),
    ]);
    res.json({ data, meta: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) } });
  } catch (err) { next(err); }
};

const findById = async (req, res, next) => {
  try {
    const risco = await prisma.risco.findUnique({ where: { id: req.params.id }, include: { unidade: true, maquina: true, exposicoes: { include: { funcionario: true } } } });
    if (!risco) return res.status(404).json({ code: 'RECORD_NOT_FOUND', message: 'Risk not found.' });
    res.json(risco);
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const risco = await prisma.risco.create({ data: req.body });
    res.status(201).json(risco);
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const risco = await prisma.risco.update({ where: { id: req.params.id }, data: req.body });
    res.json(risco);
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    await prisma.risco.update({ where: { id: req.params.id }, data: { ativo: false } });
    res.status(204).end();
  } catch (err) { next(err); }
};

module.exports = { list, findById, create, update, remove };
