import { createPortal } from 'react-dom'
import { X, AlertTriangle, Clock, MapPin, Cpu, Brain } from 'lucide-react'
import { ALERT_DETAILS } from '../data'

interface AlertDetailModalProps {
  alertId: string
  onClose: () => void
}

const SIAGA_COLOR: Record<string, string> = {
  siaga1: '#ef4444',
  siaga2: '#f97316',
  siaga3: '#f59e0b',
}

const SIAGA_LABEL: Record<string, string> = {
  siaga1: 'Siaga 1',
  siaga2: 'Siaga 2',
  siaga3: 'Siaga 3',
}

export default function AlertDetailModal({ alertId, onClose }: AlertDetailModalProps) {
  const alert = ALERT_DETAILS.find(a => a.id === alertId)
  if (!alert) return null

  const levelColor = SIAGA_COLOR[alert.level] ?? '#94a3b8'
  const levelLabel = SIAGA_LABEL[alert.level] ?? alert.level

  const probBarColor =
    alert.level === 'siaga1' ? '#ef4444' :
    alert.level === 'siaga2' ? '#f97316' :
    '#f59e0b'

  const formattedTime = new Date(alert.timestamp).toLocaleString('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      style={{ zIndex: 99999 }}
    >
      <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="px-5 py-4 border-b border-[var(--border-main)] flex items-start justify-between gap-3 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Detail Alert</h3>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10.5px] font-mono text-zinc-400">{alert.id}</span>
              <span className="text-zinc-600">·</span>
              <div className="flex items-center gap-1 text-[10.5px] text-zinc-500">
                <Clock className="w-3 h-3" />
                {formattedTime}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 p-5 space-y-4">

          {/* Level badge */}
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase border"
              style={{
                borderColor: levelColor + '50',
                background: levelColor + '18',
                color: levelColor,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: levelColor }}
              />
              {levelLabel}
            </span>
          </div>

          {/* Lokasi */}
          <div className="bg-[var(--bg-inner)] rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-1.5 text-[10.5px] text-zinc-500 uppercase font-bold tracking-wide mb-1">
              <MapPin className="w-3 h-3" />
              Lokasi
            </div>
            <div className="text-sm font-bold text-white">{alert.location}</div>
            <div className="text-xs text-zinc-400">{alert.kecamatan}</div>
            <div className="flex items-center gap-1.5 mt-1">
              <Cpu className="w-3 h-3 text-zinc-500" />
              <span
                className="text-[10.5px] font-mono px-1.5 py-0.5 rounded bg-zinc-900/60 border border-[var(--border-subtle)] text-zinc-300"
              >
                {alert.sensorId}
              </span>
            </div>
          </div>

          {/* Trigger */}
          <div className="bg-[var(--bg-inner)] rounded-xl p-4 space-y-1">
            <div className="text-[10.5px] text-zinc-500 uppercase font-bold tracking-wide mb-1">Trigger</div>
            <div className="text-xs text-zinc-200 leading-relaxed">{alert.trigger}</div>
          </div>

          {/* Prediksi AI */}
          <div className="bg-[var(--bg-inner)] rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-1.5 text-[10.5px] text-zinc-500 uppercase font-bold tracking-wide">
              <Brain className="w-3 h-3" />
              Prediksi AI
            </div>

            {/* Probabilitas */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10.5px] text-zinc-400">Probabilitas</span>
                <span className="text-xs font-bold font-mono" style={{ color: probBarColor }}>
                  {alert.aiPrediction.probability}%
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${alert.aiPrediction.probability}%`,
                    background: probBarColor,
                  }}
                />
              </div>
            </div>

            {/* Grid metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-0.5">
                <div className="text-[10.5px] text-zinc-600 uppercase tracking-wide font-bold">Estimasi waktu</div>
                <div className="text-lg font-bold font-mono text-white">
                  {alert.aiPrediction.estimatedTime}
                  <span className="text-xs font-normal text-zinc-500 ml-1">menit</span>
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="text-[10.5px] text-zinc-600 uppercase tracking-wide font-bold">Kedalaman estimasi</div>
                <div className="text-lg font-bold font-mono text-white">
                  {alert.aiPrediction.estimatedDepth}
                  <span className="text-xs font-normal text-zinc-500 ml-1">cm</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[var(--border-main)] flex items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-[10.5px] font-bold px-2 py-0.5 rounded-full border ${
                alert.status === 'active'
                  ? 'bg-rose-950/50 border-rose-900/50 text-rose-400'
                  : 'bg-emerald-950/50 border-emerald-900/50 text-emerald-400'
              }`}
            >
              {alert.status === 'active' ? 'Aktif' : 'Selesai'}
            </span>
            <span className="text-[10.5px] text-zinc-500 font-mono">
              {alert.acknowledgedBy ? `Diakui: ${alert.acknowledgedBy}` : 'Belum diakui'}
            </span>
          </div>
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
