import { ShieldAlert, MoreHorizontal } from 'lucide-react'
import { KECAMATAN_RISK } from '../data'
import { useIsDark, adaptColor } from '../../../utils/themeColor'

interface KecamatanRiskCardProps {
  onShowToast: (msg: string) => void
}

const RISK_CONFIG = {
  critical: { label: 'Kritis',  badge: 'bg-rose-950/50 border-rose-900/50 text-rose-400',   bar: '#ef4444', dot: 'bg-rose-500' },
  high:     { label: 'Tinggi',  badge: 'bg-orange-950/50 border-orange-900/50 text-orange-400', bar: '#f97316', dot: 'bg-orange-500' },
  medium:   { label: 'Sedang',  badge: 'bg-amber-950/50 border-amber-900/50 text-amber-400',  bar: '#f59e0b', dot: 'bg-amber-500' },
  low:      { label: 'Rendah',  badge: 'bg-emerald-950/50 border-emerald-900/50 text-emerald-400', bar: '#10b981', dot: 'bg-emerald-500' },
}

export default function KecamatanRiskCard({ onShowToast }: KecamatanRiskCardProps) {
  const isDark = useIsDark()
  const ac = (c: string) => adaptColor(c, isDark)
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)]/80 rounded-xl overflow-hidden">

      {/* Header */}
      <div className="px-5 py-4 border-b border-[var(--border-main)] flex justify-between items-center select-none">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-zinc-400" />
          <h2 className="text-sm font-bold text-zinc-200">Status Risiko per Kecamatan</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10.5px] font-mono text-zinc-600 px-2 py-0.5 rounded bg-[var(--bg-inner)] border border-[var(--border-subtle)]">
            Top 5 Tertinggi
          </span>
          <button
            onClick={() => onShowToast('Detail risiko per kecamatan')}
            className="text-zinc-500 hover:text-zinc-300 p-1"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="p-4 space-y-2">
        {KECAMATAN_RISK.slice(0, 5).map((row) => {
          const cfg = RISK_CONFIG[row.maxRiskLevel]
          return (
            <div
              key={row.kecamatan}
              onClick={() => onShowToast(`Detail ${row.kecamatan}`)}
              className="bg-[var(--bg-inner)] rounded-xl px-4 py-3 cursor-pointer hover:bg-zinc-900/30 transition-colors"
            >
              {/* Row top */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
                  <span className="text-xs font-semibold text-zinc-200 truncate">{row.kecamatan}</span>
                  <span className="text-[10.5px] text-zinc-600 font-mono flex-shrink-0">
                    {row.monitoredCount}/{row.kelurahanCount} kel
                  </span>
                </div>
                <span className={`inline-flex items-center px-1.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wider rounded border flex-shrink-0 ${cfg.badge}`}>
                  {cfg.label}
                </span>
              </div>

              {/* Score bar */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 rounded-full bg-zinc-800/60 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${row.avgScore}%`, backgroundColor: ac(cfg.bar) }}
                  />
                </div>
                <span className="text-[10.5px] font-bold font-mono flex-shrink-0" style={{ color: ac(cfg.bar) }}>
                  {row.avgScore}
                </span>
              </div>

              {/* Drivers */}
              <div className="mt-1.5 flex flex-wrap gap-1">
                {row.drivers.map((d) => (
                  <span key={d} className="text-[10.5px] text-zinc-500 bg-zinc-900/50 px-1.5 py-0.5 rounded font-mono">
                    {d}
                  </span>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
