interface Alert {
  id:       string
  severity: 'CRITICO' | 'ALTO' | 'MEDIO'
  tipo:     string
  descricao: string
  origem:   string
  data:     string
}

interface AlertPanelProps {
  alerts: Alert[]
}

const SEVERITY_STYLES: Record<Alert['severity'], string> = {
  CRITICO: 'bg-red-50 border-red-300 text-red-800',
  ALTO:    'bg-amber-50 border-amber-300 text-amber-800',
  MEDIO:   'bg-blue-50 border-blue-300 text-blue-800',
}

const SEVERITY_DOT: Record<Alert['severity'], string> = {
  CRITICO: 'bg-red-500',
  ALTO:    'bg-amber-500',
  MEDIO:   'bg-blue-500',
}

export function AlertPanel({ alerts }: AlertPanelProps) {
  return (
    <div className="metric-card">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase">Alertas Ativos</p>
        <span className="status-badge bg-red-100 text-red-700">{alerts.length} pendentes</span>
      </div>
      <div className="space-y-2.5">
        {alerts.length === 0 && (
          <p className="text-sm text-slate-500 text-center py-4">Nenhum alerta ativo.</p>
        )}
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`flex items-start gap-3 px-3 py-2.5 rounded-md border text-sm ${SEVERITY_STYLES[alert.severity]}`}
          >
            <span className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${SEVERITY_DOT[alert.severity]}`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold truncate">{alert.tipo}</p>
                <time className="text-xs opacity-70 flex-shrink-0">{alert.data}</time>
              </div>
              <p className="text-xs opacity-80 mt-0.5 truncate">{alert.descricao}</p>
              <p className="text-xs opacity-60 mt-0.5">{alert.origem}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
