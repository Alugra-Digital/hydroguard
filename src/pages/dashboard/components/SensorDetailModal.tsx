import { createPortal } from 'react-dom'
import { X, Wifi, Battery, Activity, Droplets, CloudRain, Zap } from 'lucide-react'
import { SENSOR_LIST, SENSOR_DETAILS } from '../data'
import type { RiskKelurahan } from '../types'

interface SensorDetailModalProps {
  kelurahan: RiskKelurahan
  onClose:   () => void
  isDark?:   boolean
}

const RISK_COLOR: Record<string, string> = {
  critical: '#ef4444', high: '#f97316', medium: '#f59e0b', low: '#10b981',
}
const SIAGA_COLOR: Record<string, string> = {
  siaga1: '#ef4444', siaga2: '#f97316', siaga3: '#f59e0b', normal: '#10b981', offline: '#94a3b8',
}

// Darker readable version for light backgrounds (same mapping as EndpointTrafficCard)
const LIGHT_MAP: Record<string, string> = {
  '#ef4444': '#9f1239',
  '#f97316': '#9a3412',
  '#f59e0b': '#92400e',
  '#10b981': '#065f46',
  '#94a3b8': '#475569',
}
const rd = (color: string, isDark: boolean) =>
  isDark ? color : (LIGHT_MAP[color] ?? color)
const SIAGA_LABEL: Record<string, string> = {
  siaga1: 'Siaga 1', siaga2: 'Siaga 2', siaga3: 'Siaga 3', normal: 'Normal', offline: 'Offline',
}
const TYPE_LABEL: Record<string, { label: string; icon: React.ReactNode }> = {
  water_level: { label: 'TMA',       icon: <Droplets className="w-3 h-3" /> },
  rain_gauge:  { label: 'Curah Hujan', icon: <CloudRain className="w-3 h-3" /> },
  combined:    { label: 'Kombinasi',  icon: <Zap className="w-3 h-3" /> },
}

// ── Signal dots ───────────────────────────────────────────
function SignalDots({ signal, color }: { signal: number; color: string }) {
  return (
    <div className="flex items-end gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          style={{
            width: 4,
            height: 4 + i * 2,
            borderRadius: 1,
            background: i <= signal ? color : 'var(--flow-line)',
            opacity: i <= signal ? 1 : 0.3,
          }}
        />
      ))}
    </div>
  )
}

// ── Battery bar ───────────────────────────────────────────
function BatteryBar({ battery, isDark = true }: { battery: number; isDark?: boolean }) {
  const rawColor = battery >= 70 ? '#10b981' : battery >= 30 ? '#f59e0b' : '#ef4444'
  const color = rd(rawColor, isDark)
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-16 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${battery}%`, background: color }} />
      </div>
      <span className="text-[10.5px] font-mono" style={{ color }}>{battery}%</span>
    </div>
  )
}

function HistorySparkline({ history, color }: { history: { time: string; value: number }[]; color: string }) {
  if (!history || history.length < 2) return null
  const vals = history.slice(-24).map((h) => h.value)
  const min = Math.min(...vals)
  const max = Math.max(...vals)
  const range = max - min || 1
  const w = 200, h = 40
  const pts = vals
    .map((v, i) => {
      const x = (i / (vals.length - 1)) * w
      const y = h - ((v - min) / range) * h
      return `${x},${y}`
    })
    .join(' ')
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: 40 }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" opacity="0.8" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={`0,${h} ${pts} ${w},${h}`} fill={color} fillOpacity="0.08" stroke="none" />
    </svg>
  )
}

export default function SensorDetailModal({ kelurahan, onClose, isDark = true }: SensorDetailModalProps) {
  const sensors = SENSOR_LIST.filter(
    (s) => s.kelurahan === kelurahan.name || s.area === kelurahan.kecamatan
  )

  const riskColor = rd(RISK_COLOR[kelurahan.riskLevel] ?? '#94a3b8', isDark)
  const riskLabel = { critical: 'Kritis', high: 'Tinggi', medium: 'Sedang', low: 'Rendah' }[kelurahan.riskLevel] ?? ''

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm" style={{ zIndex: 99999 }}>
      <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl shadow-black/60 overflow-hidden">

        {/* Header */}
        <div className="px-5 py-4 border-b border-[var(--border-main)] flex items-start justify-between gap-3 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Activity className="w-4 h-4 text-zinc-400" />
              <h3 className="text-sm font-bold text-white">Detail Sensor</h3>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-zinc-400 font-semibold">{kelurahan.name}</span>
              <span className="text-zinc-600">·</span>
              <span className="text-[10.5px] text-zinc-500">{kelurahan.kecamatan}</span>
              <span
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase border"
                style={{ borderColor: riskColor + '50', background: riskColor + '18', color: riskColor }}
              >
                {riskLabel}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sensor list */}
        <div className="overflow-y-auto flex-1 p-4 space-y-3">
          {sensors.length === 0 ? (
            <div className="text-center text-zinc-500 text-sm py-8">
              Tidak ada data sensor untuk area ini.
            </div>
          ) : (
            sensors.map((sensor) => {
              const scRaw  = SIAGA_COLOR[sensor.status] ?? '#94a3b8'
              const sc     = rd(scRaw, isDark)          // readable in both modes
              const typeInfo = TYPE_LABEL[sensor.type]
              const isUp   = sensor.rateOfChange > 0
              const isDown = sensor.rateOfChange < 0
              const detail = SENSOR_DETAILS.find((d) => d.id === sensor.id)

              return (
                <div
                  key={sensor.id}
                  className="bg-[var(--bg-inner)] rounded-xl p-4 border border-[var(--border-subtle)]/60 space-y-3"
                  style={{ opacity: sensor.isOnline ? 1 : 0.5 }}
                >
                  {/* Sensor header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono text-white">{sensor.id}</span>
                      <span className="flex items-center gap-1 text-[10.5px] px-1.5 py-0.5 rounded bg-zinc-900/60 border border-[var(--border-subtle)] text-zinc-300">
                        {typeInfo?.icon}
                        {typeInfo?.label ?? sensor.type}
                      </span>
                    </div>
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold uppercase border"
                      style={{ borderColor: sc + '50', background: sc + '18', color: sc }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: sc }} />
                      {SIAGA_LABEL[sensor.status]}
                    </span>
                  </div>

                  {/* Sensor name */}
                  <div className="text-[11px] text-zinc-400 leading-snug">{sensor.name}</div>

                  {/* Key metrics grid */}
                  <div className="grid grid-cols-2 gap-3">

                    {/* TMA / Value */}
                    <div className="space-y-0.5">
                      <div className="text-[10.5px] text-zinc-600 uppercase tracking-wide font-bold">Nilai Terkini</div>
                      <div className="text-xl font-bold font-mono" style={{ color: sc }}>
                        {sensor.tma} <span className="text-sm font-medium">{sensor.unit}</span>
                      </div>
                    </div>

                    {/* Rate of change */}
                    <div className="space-y-0.5">
                      <div className="text-[10.5px] text-zinc-600 uppercase tracking-wide font-bold">Perubahan/jam</div>
                      <div className={`text-lg font-bold font-mono ${isUp ? 'text-rose-400' : isDown ? 'text-emerald-400' : 'text-zinc-500'}`}>
                        {isUp ? '▲' : isDown ? '▼' : '—'}
                        {sensor.rateOfChange !== 0
                          ? ` ${Math.abs(sensor.rateOfChange)} ${sensor.unit}/j`
                          : ' Stabil'}
                      </div>
                    </div>

                    {/* Battery */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1 text-[10.5px] text-zinc-600 uppercase tracking-wide font-bold">
                        <Battery className="w-3 h-3" /> Baterai
                      </div>
                      <BatteryBar battery={sensor.battery} isDark={isDark} />
                    </div>

                    {/* Signal */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1 text-[10.5px] text-zinc-600 uppercase tracking-wide font-bold">
                        <Wifi className="w-3 h-3" /> Sinyal
                      </div>
                      <SignalDots
                        signal={sensor.signal}
                        color={rd(sensor.signal >= 4 ? '#10b981' : sensor.signal >= 2 ? '#f59e0b' : '#ef4444', isDark)}
                      />
                    </div>
                  </div>

                  {/* History sparkline */}
                  {detail && detail.history && detail.history.length > 0 && (
                    <div className="space-y-1">
                      <div className="text-[10.5px] text-zinc-600 uppercase tracking-wide font-bold">
                        Tren TMA 24 Jam
                      </div>
                      <div className="bg-[var(--bg-card)]/60 rounded-lg p-2">
                        <HistorySparkline history={detail.history} color={sc} />
                      </div>
                    </div>
                  )}

                  {/* Thresholds */}
                  {detail && (
                    <div className="space-y-1">
                      <div className="text-[10.5px] text-zinc-600 uppercase tracking-wide font-bold">Ambang Batas</div>
                      <div className="flex items-center gap-3 text-[10.5px] font-mono flex-wrap">
                        <span className="text-amber-400">Siaga 3: {detail.threshold.siaga3} cm</span>
                        <span className="text-orange-400">Siaga 2: {detail.threshold.siaga2} cm</span>
                        <span className="text-red-400">Siaga 1: {detail.threshold.siaga1} cm</span>
                      </div>
                    </div>
                  )}

                  {/* Kelurahan */}
                  <div className="pt-2 border-t border-[var(--border-main)] flex items-center justify-between text-[10.5px] text-zinc-600 font-mono">
                    <span>{sensor.kelurahan} · {sensor.area}</span>
                    <span>{sensor.isOnline ? '● Online' : '○ Offline'}</span>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[var(--border-main)] flex items-center justify-between flex-shrink-0">
          <span className="text-[10.5px] text-zinc-600 font-mono">
            {sensors.filter(s => s.isOnline).length}/{sensors.length} sensor online
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
