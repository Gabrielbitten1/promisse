'use strict';

const prisma = require('../config/database');

const getDashboardMetrics = async (empresaId) => {
  const [
    totalMaquinas,
    maquinasInterditadas,
    maquinasVencidas,
    totalRiscos,
    riscosAltos,
    laudosVigentes,
    laudosVencidos,
    naoConformidadesAbertas,
  ] = await Promise.all([
    prisma.maquina.count({
      where: { unidade: { empresaId }, status: { not: 'DESATIVADA' } },
    }),
    prisma.maquina.count({
      where: { unidade: { empresaId }, status: 'INTERDITADA' },
    }),
    prisma.maquina.count({
      where: {
        unidade: { empresaId },
        dataProximaInspecao: { lt: new Date() },
        status: 'OPERACIONAL',
      },
    }),
    prisma.risco.count({
      where: { unidade: { empresaId }, ativo: true },
    }),
    prisma.risco.count({
      where: {
        unidade: { empresaId },
        ativo: true,
        nivelRisco: { in: ['ALTO', 'MUITO_ALTO'] },
      },
    }),
    prisma.laudoGRO.count({
      where: {
        empresaId,
        status: 'VIGENTE',
        dataValidade: { gte: new Date() },
      },
    }),
    prisma.laudoGRO.count({
      where: { empresaId, status: 'VIGENTE', dataValidade: { lt: new Date() } },
    }),
    prisma.naoConformidade.count({
      where: { maquina: { unidade: { empresaId } }, sanada: false },
    }),
  ]);

  const complianceScore = calculateComplianceScore({
    totalMaquinas,
    maquinasInterditadas,
    maquinasVencidas,
    riscosAltos,
    laudosVigentes,
    laudosVencidos,
    naoConformidadesAbertas,
  });

  return {
    maquinas: { total: totalMaquinas, interditadas: maquinasInterditadas, inspecaoVencida: maquinasVencidas },
    riscos: { total: totalRiscos, alto_criticidade: riscosAltos },
    laudos: { vigentes: laudosVigentes, vencidos: laudosVencidos },
    naoConformidades: { abertas: naoConformidadesAbertas },
    complianceScore,
  };
};

const calculateComplianceScore = ({ totalMaquinas, maquinasInterditadas, maquinasVencidas, riscosAltos, laudosVigentes, laudosVencidos, naoConformidadesAbertas }) => {
  let score = 100;

  if (totalMaquinas > 0) {
    score -= (maquinasInterditadas / totalMaquinas) * 25;
    score -= (maquinasVencidas / totalMaquinas) * 15;
  }

  score -= Math.min(riscosAltos * 3, 20);
  score -= Math.min(naoConformidadesAbertas * 2, 20);

  if (laudosVencidos > 0) score -= Math.min(laudosVencidos * 10, 20);
  if (laudosVigentes === 0) score -= 20;

  return Math.max(0, Math.round(score));
};

const getActiveAlerts = async (empresaId) => {
  const now = new Date();
  const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const [maquinasInterditadas, inspecoesVencendo, laudosVencendo, ncsAbertas] = await Promise.all([
    prisma.maquina.findMany({
      where: { unidade: { empresaId }, status: 'INTERDITADA' },
      select: { id: true, tag: true, descricao: true, unidade: { select: { nome: true } } },
      take: 10,
    }),
    prisma.maquina.findMany({
      where: {
        unidade: { empresaId },
        dataProximaInspecao: { lte: in30Days },
        status: 'OPERACIONAL',
      },
      select: { id: true, tag: true, descricao: true, dataProximaInspecao: true },
      orderBy: { dataProximaInspecao: 'asc' },
      take: 10,
    }),
    prisma.laudoGRO.findMany({
      where: { empresaId, status: 'VIGENTE', dataValidade: { lte: in30Days } },
      select: { id: true, titulo: true, dataValidade: true, unidade: { select: { nome: true } } },
      orderBy: { dataValidade: 'asc' },
      take: 5,
    }),
    prisma.naoConformidade.findMany({
      where: { maquina: { unidade: { empresaId } }, sanada: false },
      select: { id: true, descricao: true, artigo_nr12: true, dataIdentificacao: true, maquina: { select: { tag: true } } },
      orderBy: { dataIdentificacao: 'asc' },
      take: 10,
    }),
  ]);

  return {
    maquinas_interditadas: maquinasInterditadas,
    inspecoes_vencendo: inspecoesVencendo,
    laudos_vencendo: laudosVencendo,
    ncs_abertas: ncsAbertas,
  };
};

module.exports = { getDashboardMetrics, getActiveAlerts };
