import { Sidebar }         from '@/components/dashboard/Sidebar'
import { MetricCard }      from '@/components/dashboard/MetricCard'
import { ComplianceGauge } from '@/components/dashboard/ComplianceGauge'
import { AlertPanel }      from '@/components/dashboard/AlertPanel'
import { NRStatusTable }   from '@/components/dashboard/NRStatusTable'

// Static mock data — replace with server-side fetch from /api/v1/dashboard/metrics
const MOCK_METRICS = {
  complianceScore: 73,
  maquinas: { total: 48, interditadas: 3, inspecaoVencida: 5 },
  riscos:   { total: 112, alto_criticidade: 18 },
  laudos:   { vigentes: 4, vencidos: 1 },
  naoConformidades: { abertas: 22 },
}

const MOCK_ALERTS = [
  { id: '1', severity: 'CRITICO' as const, tipo: 'Maquina Interditada', descricao: 'Prensa hidraulica TAG-042 sem protetor de ponto de operacao', origem: 'Unidade Sao Paulo - Linha A', data: '02/06/2026' },
  { id: '2', severity: 'CRITICO' as const, tipo: 'Laudo GRO Vencido',   descricao: 'PGR nao renovado apos data de validade', origem: 'Filial Campinas', data: '30/05/2026' },
  { id: '3', severity: 'ALTO' as const,    tipo: 'Inspecao NR-12',      descricao: '5 equipamentos com inspecao periodica vencida', origem: 'Deposito Central', data: '28/05/2026' },
  { id: '4', severity: 'ALTO' as const,    tipo: 'Risco Ergonomico',    descricao: 'Posturas inadequadas detectadas em 12 postos de trabalho', origem: 'Centro Administrativo', data: '25/05/2026' },
  { id: '5', severity: 'MEDIO' as const,   tipo: 'NC Aberta',           descricao: 'Sinalizacao de segurança ausente em corredor de transito', origem: 'Unidade Porto Alegre', data: '20/05/2026' },
]

const MOCK_NR_STATUS = [
  { norma: 'NR-1',  descricao: 'Disposicoes Gerais e Gerenciamento de Riscos',        status: 'ATENCAO' as const,     laudos: 4,  vencimento: '15/09/2026' },
  { norma: 'NR-9',  descricao: 'Avaliacao e Controle das Exposicoes Ocupacionais',    status: 'VIGENTE' as const,     laudos: 7,  vencimento: '30/11/2026' },
  { norma: 'NR-12', descricao: 'Seguranca no Trabalho em Maquinas e Equipamentos',   status: 'CRITICO' as const,     laudos: 3,  vencimento: '01/06/2026' },
  { norma: 'NR-17', descricao: 'Ergonomia',                                           status: 'VIGENTE' as const,     laudos: 2,  vencimento: '10/03/2027' },
  { norma: 'NR-35', descricao: 'Trabalho em Altura',                                  status: 'NAO_AVALIADO' as const, laudos: 0, vencimento: null },
]

export default function DashboardPage() {
  const { complianceScore, maquinas, riscos, laudos, naoConformidades } = MOCK_METRICS

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Painel de Compliance Industrial</h1>
            <p className="text-sm text-slate-500 mt-0.5">Ultima atualizacao: 02 jun. 2026 — 14:35</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="status-badge bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 text-xs">
              Ind. Metalurgica Ltda.
            </span>
            <button className="px-4 py-2 bg-blue-900 text-white text-sm font-semibold rounded-md hover:bg-blue-800 transition-colors">
              Gerar Relatorio
            </button>
          </div>
        </header>

        <div className="px-8 py-6 space-y-6">
          {/* KPI Row */}
          <section>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <MetricCard
                label="Maquinas Ativas"
                value={maquinas.total}
                subtitle={`${maquinas.interditadas} interditadas · ${maquinas.inspecaoVencida} com inspecao vencida`}
                variant={maquinas.interditadas > 0 ? 'warning' : 'success'}
                trend={{ value: 6, direction: 'up', label: 'vs. mes anterior' }}
              />
              <MetricCard
                label="Riscos Identificados"
                value={riscos.total}
                subtitle={`${riscos.alto_criticidade} de alta criticidade`}
                variant={riscos.alto_criticidade > 10 ? 'critical' : 'warning'}
              />
              <MetricCard
                label="Laudos GRO Vigentes"
                value={laudos.vigentes}
                subtitle={laudos.vencidos > 0 ? `${laudos.vencidos} vencido — acao imediata` : 'Todos dentro da validade'}
                variant={laudos.vencidos > 0 ? 'critical' : 'success'}
              />
              <MetricCard
                label="Nao Conformidades (NR-12)"
                value={naoConformidades.abertas}
                subtitle="Pendentes de sanacao"
                variant={naoConformidades.abertas > 15 ? 'critical' : 'warning'}
              />
            </div>
          </section>

          {/* Gauge + Alerts */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <ComplianceGauge score={complianceScore} />
            <div className="lg:col-span-2">
              <AlertPanel alerts={MOCK_ALERTS} />
            </div>
          </section>

          {/* NR Status Table */}
          <section>
            <NRStatusTable nrs={MOCK_NR_STATUS} />
          </section>

          {/* Footer note */}
          <footer className="text-center pt-4 pb-2">
            <p className="text-xs text-slate-400">
              EngiShield AI — Dados consolidados com base nas NRs vigentes (MTE). Nao substitui laudo tecnico assinado por profissional habilitado.
            </p>
          </footer>
        </div>
      </main>
    </div>
  )
}
