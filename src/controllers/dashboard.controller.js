'use strict';

const complianceService = require('../services/compliance.service');
const prisma = require('../config/database');

const getMetrics = async (req, res, next) => {
  try {
    const empresaId = req.user.empresaId;
    if (!empresaId) return res.status(400).json({ code: 'EMPRESA_REQUIRED', message: 'User is not associated with a company.' });

    const metrics = await complianceService.getDashboardMetrics(empresaId);
    res.json(metrics);
  } catch (err) {
    next(err);
  }
};

const getActiveAlerts = async (req, res, next) => {
  try {
    const alerts = await complianceService.getActiveAlerts(req.user.empresaId);
    res.json(alerts);
  } catch (err) {
    next(err);
  }
};

const getComplianceTimeline = async (req, res, next) => {
  try {
    const { months = 6 } = req.query;
    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - parseInt(months));

    const laudos = await prisma.laudoGRO.findMany({
      where: {
        empresaId: req.user.empresaId,
        createdAt: { gte: cutoff },
      },
      select: { status: true, createdAt: true, dataValidade: true },
      orderBy: { createdAt: 'asc' },
    });

    res.json({ timeline: laudos, period_months: parseInt(months) });
  } catch (err) {
    next(err);
  }
};

module.exports = { getMetrics, getActiveAlerts, getComplianceTimeline };
