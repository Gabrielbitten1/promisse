'use strict';

const groqService = require('../services/groq.service');
const prisma = require('../config/database');
const logger = require('../config/logger');

const analyzeRisk = async (req, res, next) => {
  try {
    const { riscoId } = req.body;

    const risco = await prisma.risco.findUnique({
      where: { id: riscoId },
      include: { unidade: { select: { empresaId: true } } },
    });

    if (!risco) return res.status(404).json({ code: 'RECORD_NOT_FOUND', message: 'Risk record not found.' });
    if (risco.unidade.empresaId !== req.user.empresaId && req.user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ code: 'FORBIDDEN', message: 'Access denied to this resource.' });
    }

    const prompt = groqService.analyzeRiskPrompt(risco);
    const analysis = await groqService.chat(prompt, undefined, 1024);

    res.json({ risco_id: riscoId, analysis, generated_at: new Date().toISOString() });
  } catch (err) {
    next(err);
  }
};

const complianceCheck = async (req, res, next) => {
  try {
    const { maquinaId } = req.body;

    const maquina = await prisma.maquina.findUnique({
      where: { id: maquinaId },
      include: {
        naoConformidades: { where: { sanada: false } },
        unidade: { select: { empresaId: true } },
      },
    });

    if (!maquina) return res.status(404).json({ code: 'RECORD_NOT_FOUND', message: 'Machine record not found.' });

    const prompt = groqService.complianceCheckPrompt(maquina);
    const result = await groqService.chat(prompt, undefined, 1024);

    res.json({ maquina_id: maquinaId, compliance: result, generated_at: new Date().toISOString() });
  } catch (err) {
    next(err);
  }
};

const suggestControls = async (req, res, next) => {
  try {
    const { exposicaoData } = req.body;
    const suggestions = await groqService.chat(groqService.suggestControlsPrompt(exposicaoData), undefined, 1024);
    res.json({ suggestions, generated_at: new Date().toISOString() });
  } catch (err) {
    next(err);
  }
};

module.exports = { analyzeRisk, complianceCheck, suggestControls };
