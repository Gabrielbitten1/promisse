'use strict';

const prisma = require('../config/database');
const groqService = require('../services/groq.service');

const list = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = { empresaId: req.user.empresaId, ...(status && { status }) };

    const [data, total] = await Promise.all([
      prisma.laudoGRO.findMany({
        where, skip, take: parseInt(limit),
        select: { id: true, titulo: true, versao: true, status: true, dataElaboracao: true, dataValidade: true, responsavelTecnico: true, unidade: { select: { nome: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.laudoGRO.count({ where }),
    ]);

    res.json({ data, meta: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) } });
  } catch (err) {
    next(err);
  }
};

const findById = async (req, res, next) => {
  try {
    const laudo = await prisma.laudoGRO.findUnique({
      where: { id: req.params.id },
      include: { autor: { select: { id: true, email: true } }, unidade: true },
    });
    if (!laudo) return res.status(404).json({ code: 'RECORD_NOT_FOUND', message: 'Report not found.' });
    res.json(laudo);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const laudo = await prisma.laudoGRO.create({
      data: { ...req.body, autorId: req.user.id, empresaId: req.user.empresaId },
    });
    res.status(201).json(laudo);
  } catch (err) {
    next(err);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const laudo = await prisma.laudoGRO.update({ where: { id: req.params.id }, data: { status } });
    res.json(laudo);
  } catch (err) {
    next(err);
  }
};

const generateWithAI = async (req, res, next) => {
  try {
    const laudo = await prisma.laudoGRO.findUnique({
      where: { id: req.params.id },
      include: {
        unidade: {
          include: {
            riscos: { where: { ativo: true }, take: 20 },
            maquinas: { where: { status: { not: 'DESATIVADA' } }, take: 20 },
          },
        },
      },
    });

    if (!laudo) return res.status(404).json({ code: 'RECORD_NOT_FOUND', message: 'Report not found.' });

    const prompt = `
Gere um sumario executivo para o Laudo GRO (NR-1) com base nos dados abaixo. Retorne JSON:
{
  "sumario_executivo": "...",
  "principais_riscos": ["..."],
  "recomendacoes_prioritarias": ["..."],
  "cronograma_sugerido": [{ "acao": "...", "prazo_dias": 30 }],
  "conclusao_tecnica": "..."
}

Dados: ${JSON.stringify({ riscos: laudo.unidade.riscos, maquinas: laudo.unidade.maquinas }, null, 2)}
    `.trim();

    const generated = await groqService.chat(prompt, undefined, 1500);

    const updated = await prisma.laudoGRO.update({
      where: { id: req.params.id },
      data: { conteudoJson: { ...laudo.conteudoJson, ai_generated: generated } },
    });

    res.json({ laudo_id: req.params.id, ai_content: generated, updated_at: updated.updatedAt });
  } catch (err) {
    next(err);
  }
};

module.exports = { list, findById, create, updateStatus, generateWithAI };
