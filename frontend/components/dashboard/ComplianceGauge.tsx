'use client'

interface ComplianceGaugeProps {
  score: number
}

function getScoreConfig(score: number): { color: string; label: string; ringColor: string } {
  if (score >= 85) return { color: '#059669', label: 'Conforme',           ringColor: 'stroke-emerald-500' }
  if (score >= 65) return { color: '#D97706', label: 'Atencao Necessaria', ringColor: 'stroke-amber-500' }
  return             { color: '#DC2626', label: 'Nao Conforme',            ringColor: 'stroke-red-500' }
}

export function ComplianceGauge({ score }: ComplianceGaugeProps) {
  const { color, label, ringColor } = getScoreConfig(score)
  const circumference = 2 * Math.PI * 54
  const dashOffset = circumference - (score / 100) * circumference

  return (
    <div className="metric-card flex flex-col items-center justify-center gap-4">
      <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase self-start">
        Indice de Conformidade Global
      </p>
      <div className="relative">
        <svg width="160" height="160" className="-rotate-90">
          <circle cx="80" cy="80" r="54" fill="none" stroke="#E2E8F0" strokeWidth="12" />
          <circle
            cx="80" cy="80" r="54"
            fill="none"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className={ringColor}
            style={{ transition: 'stroke-dashoffset 1s ease-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold tabular-nums" style={{ color }}>{score}</span>
          <span className="text-xs font-medium text-slate-500">/ 100</span>
        </div>
      </div>
      <span
        className="status-badge text-white px-4 py-1.5"
        style={{ backgroundColor: color }}
      >
        {label}
      </span>
    </div>
  )
}
