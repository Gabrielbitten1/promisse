interface NRStatus {
  norma:      string
  descricao:  string
  status:     'VIGENTE' | 'ATENCAO' | 'CRITICO' | 'NAO_AVALIADO'
  laudos:     number
  vencimento: string | null
}

interface NRStatusTableProps {
  nrs: NRStatus[]
}

const STATUS_CELL: Record<NRStatus['status'], string> = {
  VIGENTE:       'text-emerald-600 font-semibold',
  ATENCAO:       'text-amber-600 font-semibold',
  CRITICO:       'text-red-600 font-semibold',
  NAO_AVALIADO:  'text-slate-400',
}

const STATUS_BADGE: Record<NRStatus['status'], string> = {
  VIGENTE:       'bg-emerald-50 text-emerald-700 border border-emerald-200',
  ATENCAO:       'bg-amber-50 text-amber-700 border border-amber-200',
  CRITICO:       'bg-red-50 text-red-700 border border-red-200',
  NAO_AVALIADO:  'bg-slate-100 text-slate-500 border border-slate-200',
}

export function NRStatusTable({ nrs }: NRStatusTableProps) {
  return (
    <div className="metric-card">
      <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase mb-4">
        Status por Norma Regulamentadora
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="pb-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Norma</th>
              <th className="pb-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Escopo</th>
              <th className="pb-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="pb-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Laudos</th>
              <th className="pb-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Vencimento</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {nrs.map((nr) => (
              <tr key={nr.norma} className="hover:bg-slate-50 transition-colors">
                <td className="py-3 font-bold text-slate-900">{nr.norma}</td>
                <td className="py-3 text-slate-600 max-w-[200px] truncate">{nr.descricao}</td>
                <td className="py-3 text-center">
                  <span className={`status-badge ${STATUS_BADGE[nr.status]}`}>{nr.status.replace('_', ' ')}</span>
                </td>
                <td className={`py-3 text-center tabular-nums ${STATUS_CELL[nr.status]}`}>{nr.laudos}</td>
                <td className="py-3 text-right text-slate-500 tabular-nums">
                  {nr.vencimento ?? <span className="text-slate-300">-</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
