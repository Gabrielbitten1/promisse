'use strict';

const prisma = require('../config/database');

const INCLUDE_UNIDADE = { unidade: { select: { id: true, nome: true, empresaId: true } } };

const list = async (req, res, next) => {
  try {
    const { unidadeId, status, nivelRisco, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {
      ...(unidadeId && { unidadeId }),
      ...(status && { status }),
      ...(nivelRisco && { nivelRisco }),
      unidade: { empresaId: req.user.empresaId },
    };

    const [data, total] = await Promise.all([
      prisma.maquina.findMany({ where, include: INCLUDE_UNIDADE, skip, take: parseInt(limit), orderBy: { createdAt: 'desc' } }),
      prisma.maquina.count({ where }),
    ]);

    res.json({ data, meta: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) } });
  } catch (err) {
    next(err);
  }
};

const findById = async (req, res, next) => {
  try {
    const maquina = await prisma.maquina.findUnique({
      where: { id: req.params.id },
      include: { ...INCLUDE_UNIDADE, naoConformidades: { orderBy: { dataIdentificacao: 'desc' } } },
    });
    if (!maquina) return res.status(404).json({ code: 'RECORD_NOT_FOUND', message: 'Machine not found.' });
    res.json(maquina);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const maquina = await prisma.maquina.create({ data: req.body, include: INCLUDE_UNIDADE });
    res.status(201).json(maquina);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const maquina = await prisma.maquina.update({ where: { id: req.params.id }, data: req.body, include: INCLUDE_UNIDADE });
    res.json(maquina);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await prisma.maquina.update({ where: { id: req.params.id }, data: { status: 'DESATIVADA' } });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

const getNaoConformidades = async (req, res, next) => {
  try {
    const ncs = await prisma.naoConformidade.findMany({
      where: { maquinaId: req.params.id },
      orderBy: { dataIdentificacao: 'desc' },
    });
    res.json(ncs);
  } catch (err) {
    next(err);
  }
};

module.exports = { list, findById, create, update, remove, getNaoConformidades };
