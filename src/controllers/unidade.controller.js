'use strict';

const prisma = require('../config/database');

const list = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = { empresaId: req.user.empresaId };
    const [data, total] = await Promise.all([
      prisma.unidade.findMany({ where, skip, take: parseInt(limit), orderBy: { nome: 'asc' } }),
      prisma.unidade.count({ where }),
    ]);
    res.json({ data, meta: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) } });
  } catch (err) { next(err); }
};

const findById = async (req, res, next) => {
  try {
    const unidade = await prisma.unidade.findUnique({ where: { id: req.params.id } });
    if (!unidade) return res.status(404).json({ code: 'RECORD_NOT_FOUND', message: 'Unit not found.' });
    res.json(unidade);
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const unidade = await prisma.unidade.create({ data: { ...req.body, empresaId: req.user.empresaId } });
    res.status(201).json(unidade);
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const unidade = await prisma.unidade.update({ where: { id: req.params.id }, data: req.body });
    res.json(unidade);
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    await prisma.unidade.update({ where: { id: req.params.id }, data: { isActive: false } });
    res.status(204).end();
  } catch (err) { next(err); }
};

module.exports = { list, findById, create, update, remove };
