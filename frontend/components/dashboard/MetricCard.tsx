import { clsx } from 'clsx'

type Variant = 'default' | 'success' | 'warning' | 'critical'

interface MetricCardProps {
  label:      string
  value:      string | number
  subtitle?:  string
  variant?:   Variant
  trend?:     { value: number; direction: 'up' | 'down'; label: string }
}

const VARIANT_STYLES: Record<Variant, { border: string; badge: string; value: string }> = {
  default:  { border: 'border-slate-200',   badge: 'bg-slate-100 text-slate-700',   value: 'text-slate-900' },
  success:  { border: 'border-emerald-200', badge: 'bg-emerald-50 text-emerald-700', value: 'text-emerald-600' },
  warning:  { border: 'border-amber-200',   badge: 'bg-amber-50 text-amber-700',    value: 'text-amber-600' },
  critical: { border: 'border-red-200',     badge: 'bg-red-50 text-red-700',        value: 'text-red-600' },
}

export function MetricCard({ label, value, subtitle, variant = 'default', trend }: MetricCardProps) {
  const styles = VARIANT_STYLES[variant]

  return (
    <div className={clsx('metric-card border-l-4', styles.border)}>
      <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase">{label}</p>
      <p className={clsx('mt-2 text-4xl font-bold tabular-nums', styles.value)}>{value}</p>
      {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      {trend && (
        <div className="mt-3 flex items-center gap-1.5">
          <span className={clsx('text-xs font-semibold', trend.direction === 'up' ? 'text-red-600' : 'text-emerald-600')}>
            {trend.direction === 'up' ? '+' : '-'}{trend.value}%
          </span>
          <span className="text-xs text-slate-400">{trend.label}</span>
        </div>
      )}
    </div>
  )
}
