import { MoreHorizontal } from 'lucide-react'
import { useIsDark, adaptColor } from '../utils/themeColor'

interface PageKpiCardProps {
  icon:    React.ReactNode
  label:   string
  value:   string | number
  unit?:   string
  sub:     string
  color:   string
  spark?:  number[]
}

function Sparkline({ values, color }: { values: number[]; color: string }) {
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  // Normalise to heights 4–36 (same range as KpiCardsAnimated)
  const heights = values.map(v => Math.max(4, Math.round(((v - min) / range) * 32) + 4))
  return (
    <svg className="w-16 h-8 flex-shrink-0" viewBox="0 0 100 40">
      {heights.map((h, i) => (
        <rect
          key={i}
          x={i * 16}
          y={40 - h}
          width={10}
          height={h}
          rx={1.5}
          fill={color}
          className="transition-all duration-300 hover:opacity-80 cursor-pointer"
        />
      ))}
    </svg>
  )
}

// Generate a plausible rising sparkline ending at `value`
function genSpark(value: number): number[] {
  const end = typeof value === 'number' ? value : parseFloat(String(value)) || 10
  const base = Math.max(0, end * 0.5)
  return Array.from({ length: 6 }, (_, i) =>
    parseFloat((base + (end - base) * (i / 5) * (0.8 + Math.random() * 0.4)).toFixed(1))
  )
}

export default function PageKpiCard({ icon, label, value, unit, sub, color, spark }: PageKpiCardProps) {
  const isDark = useIsDark()
  const ac = (c: string) => adaptColor(c, isDark)
  const sparkValues = spark ?? genSpark(typeof value === 'number' ? value : parseFloat(String(value)) || 10)

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)]/80 rounded-xl p-4 flex flex-col justify-between hover:border-zinc-800 transition-colors duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-1.5 text-[10.5px] font-semibold text-zinc-500">
          <span style={{ color: ac(color) }}>{icon}</span>
          <span>{label}</span>
        </div>
        <button className="text-zinc-600 hover:text-zinc-300 transition-colors p-0.5">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Value + Sparkline */}
      <div className="flex items-end justify-between my-1">
        <div className="text-3xl font-bold text-white tracking-tight leading-none">
          {value}
          {unit && <span className="text-base font-medium text-zinc-500 ml-1">{unit}</span>}
        </div>
        <div className="pb-0.5">
          <Sparkline values={sparkValues} color={ac(color)} />
        </div>
      </div>

      {/* Sub / footer */}
      <div className="text-[10.5px] text-zinc-500 mt-1 leading-snug">{sub}</div>
    </div>
  )
}
