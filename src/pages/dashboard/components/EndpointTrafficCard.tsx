import { useState } from 'react'
import MapView from './MapView'
import { CloudRain, Waves, TrendingUp, Droplets, MapPin, Globe, MoreHorizontal } from 'lucide-react'
import { PIPELINE_BY_KECAMATAN, WEATHER_CURRENT, type KecPipeline } from '../data'

interface EndpointTrafficCardProps {
  isDark: boolean
  computedMetrics: { sensorAktif: { value: string } }
  onShowToast: (msg: string) => void
}

// ── Config ────────────────────────────────────────────────
const RISK = {
  critical: { color: '#ef4444', label: 'Kritis',  dot: 'bg-rose-500'    },
  high:     { color: '#f97316', label: 'Tinggi',  dot: 'bg-orange-500'  },
  medium:   { color: '#f59e0b', label: 'Sedang',  dot: 'bg-amber-500'   },
  low:      { color: '#10b981', label: 'Rendah',  dot: 'bg-emerald-500' },
}
const SIAGA_COLOR: Record<string, string> = {
  siaga1: '#ef4444', siaga2: '#f97316', siaga3: '#f59e0b', normal: '#10b981',
}
const SIAGA_LABEL: Record<string, string> = {
  siaga1: 'Siaga 1', siaga2: 'Siaga 2', siaga3: 'Siaga 3', normal: 'Normal',
}
const getRisk = (l: string) => RISK[l as keyof typeof RISK] ?? RISK.low

// Darker readable version for light mode backgrounds
const LIGHT_MAP: Record<string, string> = {
  '#ef4444': '#9f1239', // rose   → rose-800
  '#f97316': '#9a3412', // orange → orange-800
  '#f59e0b': '#92400e', // amber  → amber-800
  '#10b981': '#065f46', // emerald→ emerald-900
  '#3b82f6': '#1d4ed8', // blue   → blue-700
  '#a855f7': '#7e22ce', // purple → purple-800
}
const readable = (color: string, isDark: boolean) =>
  isDark ? color : (LIGHT_MAP[color] ?? color)

// ── Horizontal connector ──────────────────────────────────
function ConnectorH({ color }: { color: string }) {
  return (
    <div className="flex-shrink-0 flex items-center" style={{ width: 40 }}>
      <svg width="40" height="4" viewBox="0 0 40 4">
        <line x1="0" y1="2" x2="40" y2="2"
          stroke="var(--flow-line)" strokeWidth="1.5" />
        <line x1="0" y1="2" x2="40" y2="2"
          stroke={color} strokeWidth="1.5"
          strokeDasharray="4 4" className="animate-dash" />
      </svg>
    </div>
  )
}

// ── Vertical connector centered under card 3 ─────────────
// Mirrors row 1 flex layout so SVG centers on card 3's column.
function ConnectorDown({ color }: { color: string }) {
  return (
    <div className="flex items-start" style={{ height: 40 }}>
      {/* Offset matching card 1 + card 2 space */}
      <div style={{ flexGrow: 2, flexBasis: 0 }} />
      {/* Offset matching 2 horizontal connectors (40px × 2) */}
      <div style={{ width: 80, flexShrink: 0 }} />
      {/* Card 3 column — center line here */}
      <div style={{ flexGrow: 1, flexBasis: 0 }} className="flex justify-center">
        <svg width="4" height="40" viewBox="0 0 4 40">
          <line x1="2" y1="0" x2="2" y2="40"
            stroke="var(--flow-line)" strokeWidth="1.5" />
          <line x1="2" y1="0" x2="2" y2="40"
            stroke={color} strokeWidth="1.5"
            strokeDasharray="4 4" className="animate-dash" />
        </svg>
      </div>
    </div>
  )
}

// ── Horizontal connector (row 2, right-to-left) ───────────
function ConnectorH_Rev({ color }: { color: string }) {
  return (
    <div className="flex-shrink-0 flex items-center" style={{ width: 40 }}>
      <svg width="40" height="4" viewBox="0 0 40 4">
        <line x1="0" y1="2" x2="40" y2="2"
          stroke="var(--flow-line)" strokeWidth="1.5" />
        <line x1="0" y1="2" x2="40" y2="2"
          stroke={color} strokeWidth="1.5"
          strokeDasharray="4 4" className="animate-dash" />
      </svg>
    </div>
  )
}

// ── Stage card ────────────────────────────────────────────
interface StageProps {
  icon: React.ReactNode
  title: string
  value: React.ReactNode
  sub: string
  badge?: React.ReactNode
  color: string
  isDark?: boolean
}

function StageCard({ icon, title, value, sub, badge, color, isDark = true }: StageProps) {
  const c = readable(color, isDark)
  return (
    <div className="flex-1 min-w-0 bg-[var(--bg-inner)] rounded-xl p-3 flex flex-col gap-2 border border-[var(--border-subtle)]/60">
      <div className="flex items-center justify-between gap-1">
        <div className="flex items-center gap-1.5 min-w-0">
          <span style={{ color: c }} className="flex-shrink-0">{icon}</span>
          <span className="text-[10.5px] font-bold text-zinc-500 uppercase tracking-wider truncate">
            {title}
          </span>
        </div>
        {badge}
      </div>
      <div className="text-xl font-bold leading-none tracking-tight" style={{ color: c }}>
        {value}
      </div>
      <div className="text-[10.5px] text-zinc-500 font-mono leading-relaxed line-clamp-2">{sub}</div>
    </div>
  )
}

// ── Badge ─────────────────────────────────────────────────
function StageBadge({ label, color, isDark = true }: { label: string; color: string; isDark?: boolean }) {
  const c = readable(color, isDark)
  return (
    <span
      className="flex-shrink-0 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider border"
      style={{ borderColor: c + '50', background: c + '18', color: c }}
    >
      <span className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0"
            style={{ background: c }} />
      {label}
    </span>
  )
}

// ── Main ──────────────────────────────────────────────────
export default function EndpointTrafficCard({ isDark, onShowToast }: EndpointTrafficCardProps) {
  const [view, setView]     = useState<'flow' | 'map'>('map')
  const [activeKec, setIdx] = useState(0)

  const kec: KecPipeline = PIPELINE_BY_KECAMATAN[activeKec]
  const risk              = getRisk(kec.maxRiskLevel)
  const siagaColor        = SIAGA_COLOR[kec.tmaStatus] ?? '#10b981'
  const siagaLabel        = SIAGA_LABEL[kec.tmaStatus] ?? 'Normal'
  const C                 = risk.color

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)]/80 rounded-xl overflow-hidden">

      {/* Header */}
      <div className="px-5 py-4 border-b border-[var(--border-main)] flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Waves className="w-4 h-4 text-zinc-400" />
          <h2 className="text-sm font-bold text-zinc-200">Pemantauan Zona Risiko</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5 bg-zinc-950 border border-[var(--border-subtle)] p-0.5 rounded-md">
            <button onClick={() => setView('flow')}
              className={`px-2 py-0.5 rounded text-[10.5px] font-medium flex items-center gap-1 transition-all ${view === 'flow' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>
              <TrendingUp className="w-3 h-3" /> Proses
            </button>
            <button onClick={() => setView('map')}
              className={`px-2 py-0.5 rounded text-[10.5px] font-medium flex items-center gap-1 transition-all ${view === 'map' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>
              <Globe className="w-3 h-3" /> Peta
            </button>
          </div>
          <button onClick={() => onShowToast(`Proses banjir ${kec.kecamatan}`)}
            className="text-zinc-500 hover:text-zinc-300 p-1">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {view === 'flow' ? (
        <div>
          {/* Tabs */}
          <div className="border-b border-[var(--border-main)] px-4 py-2.5">
            <div className="flex flex-wrap gap-1">
              {PIPELINE_BY_KECAMATAN.map((k, i) => {
                const r = getRisk(k.maxRiskLevel)
                return (
                  <button key={k.kecamatan} onClick={() => setIdx(i)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10.5px] font-medium transition-all flex-shrink-0 ${
                      i === activeKec
                        ? 'bg-zinc-800 text-white'
                        : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/30'
                    }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${r.dot} flex-shrink-0`} />
                    {k.kecamatan}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Active label */}
          <div className="px-5 pt-4 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">{kec.kecamatan}</span>
              <StageBadge label={`${risk.label} · ${kec.riskScore}`} color={C} isDark={isDark} />
            </div>
            <span className="text-[10.5px] text-zinc-600 font-mono">
              {kec.river} · {kec.sensorLabel}
            </span>
          </div>

          {/* Pipeline */}
          <div className="px-5 pb-5">

            {/* Row 1 — Stage 1, 2, 3 */}
            <div className="flex items-stretch gap-0">
              <StageCard
                icon={<CloudRain className="w-3.5 h-3.5" />}
                title="1 · Curah Hujan"
                value={<>{WEATHER_CURRENT.rainfall}<span className="text-sm font-medium ml-0.5">mm/j</span></>}
                sub={`Radar: ${WEATHER_CURRENT.radarLabel} · Kelembaban ${WEATHER_CURRENT.humidity}%`}
                color="#f59e0b" isDark={isDark}
                badge={<StageBadge label="BMKG" color="#f59e0b" isDark={isDark} />}
              />
              <ConnectorH color={C} />
              <StageCard
                icon={<Waves className="w-3.5 h-3.5" />}
                title="2 · Aliran Sungai"
                value={<>{kec.tma}<span className="text-sm font-medium ml-0.5">cm</span></>}
                sub={`${kec.river} · naik +${kec.tmaChange} cm/j · ambang ${kec.threshold} cm`}
                color={siagaColor} isDark={isDark}
                badge={<StageBadge label={siagaLabel} color={siagaColor} isDark={isDark} />}
              />
              <ConnectorH color={C} />
              <StageCard
                icon={<TrendingUp className="w-3.5 h-3.5" />}
                title="3 · Risiko Meluap"
                value={<>{kec.overflowProb}<span className="text-sm font-medium ml-0.5">%</span></>}
                sub={`Probabilitas luapan 1 jam ke depan · driver: ${kec.driver}`}
                color={C} isDark={isDark}
                badge={
                  <span className="flex-shrink-0 text-[10.5px] font-mono px-1.5 py-0.5 rounded border"
                    style={{ borderColor: readable(C, isDark) + '40', background: readable(C, isDark) + '18', color: readable(C, isDark) }}>
                    ±{kec.estTimeMin}m
                  </span>
                }
              />
            </div>

            {/* Vertical connector — right side */}
            <ConnectorDown color={C} />

            {/* Row 2 — reversed: card 4 on RIGHT, card 5 on LEFT */}
            <div className="flex flex-row-reverse items-stretch gap-0">
              <StageCard
                icon={<Droplets className="w-3.5 h-3.5" />}
                title="4 · Estimasi Genangan"
                value={<>{kec.estDepth}<span className="text-sm font-medium ml-0.5">cm</span></>}
                sub={`Kedalaman air diperkirakan dalam ±${kec.estTimeMin} menit ke depan`}
                color={C} isDark={isDark}
              />
              <ConnectorH_Rev color={C} />
              <StageCard
                icon={<MapPin className="w-3.5 h-3.5" />}
                title="5 · Kelurahan Terdampak"
                value={<>{kec.monitored.length}<span className="text-sm font-medium ml-0.5">kelurahan</span></>}
                sub={kec.monitored.join(' · ')}
                color={C} isDark={isDark}
                badge={<StageBadge label={risk.label} color={C} isDark={isDark} />}
              />
            </div>

            {/* Footer */}
            <div className="mt-3 pt-3 border-t border-[var(--border-main)] flex items-center justify-between text-[10.5px] text-zinc-600 font-mono">
              <span>Sumber: BMKG + Sensor Lapangan · 27 Mei / 10:30 WIB</span>
              <span>
                {PIPELINE_BY_KECAMATAN.filter(k => k.maxRiskLevel === 'critical').length}× kritis ·{' '}
                {PIPELINE_BY_KECAMATAN.filter(k => k.maxRiskLevel === 'high').length}× tinggi ·{' '}
                {PIPELINE_BY_KECAMATAN.filter(k => k.maxRiskLevel === 'medium').length}× sedang
              </span>
            </div>
          </div>
        </div>
      ) : (
        <MapView isDark={isDark} />
      )}
    </div>
  )
}
