'use strict';

const prisma = require('../config/database');

const list = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [data, total] = await Promise.all([
      prisma.empresa.findMany({ skip, take: parseInt(limit), orderBy: { razaoSocial: 'asc' } }),
      prisma.empresa.count(),
    ]);
    res.json({ data, meta: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) } });
  } catch (err) { next(err); }
};

const findById = async (req, res, next) => {
  try {
    const empresa = await prisma.empresa.findUnique({ where: { id: req.params.id }, include: { unidades: true } });
    if (!empresa) return res.status(404).json({ code: 'RECORD_NOT_FOUND', message: 'Company not found.' });
    res.json(empresa);
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const empresa = await prisma.empresa.create({ data: req.body });
    res.status(201).json(empresa);
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const empresa = await prisma.empresa.update({ where: { id: req.params.id }, data: req.body });
    res.json(empresa);
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    await prisma.empresa.update({ where: { id: req.params.id }, data: { isActive: false } });
    res.status(204).end();
  } catch (err) { next(err); }
};

module.exports = { list, findById, create, update, remove };
