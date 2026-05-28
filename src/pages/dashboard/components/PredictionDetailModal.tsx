import { createPortal } from 'react-dom'
import { X, Brain, TrendingUp, Droplets, Clock } from 'lucide-react'
import { PREDICTION_DETAILS } from '../data'

interface PredictionDetailModalProps {
  kelurahan: string
  onClose: () => void
}

const DRIVER_LABEL: Record<string, string> = {
  curah_hujan: 'Curah Hujan',
  backwater: 'Backwater (Luapan Sungai)',
  kombinasi: 'Kombinasi',
}

const RISK_COLOR: Record<string, string> = {
  critical: '#ef4444',
  high:     '#f97316',
  medium:   '#f59e0b',
  low:      '#10b981',
}

const RISK_LABEL: Record<string, string> = {
  critical: 'Kritis',
  high:     'Tinggi',
  medium:   'Sedang',
  low:      'Rendah',
}

function probBarColor(prob: number): string {
  if (prob > 80) return '#f43f5e'   // rose
  if (prob > 60) return '#f59e0b'   // amber
  return '#10b981'                   // emerald
}

const FORECAST_ROWS: { key: string; label: string }[] = [
  { key: '1h', label: '1j' },
  { key: '3h', label: '3j' },
  { key: '6h', label: '6j' },
]

export default function PredictionDetailModal({ kelurahan, onClose }: PredictionDetailModalProps) {
  const pred = PREDICTION_DETAILS.find(p => p.kelurahan === kelurahan)
  if (!pred) return null

  const riskColor = RISK_COLOR[pred.riskLevel] ?? '#94a3b8'
  const riskLabel = RISK_LABEL[pred.riskLevel] ?? pred.riskLevel
  const driverLabel = DRIVER_LABEL[pred.primaryDriver] ?? pred.primaryDriver

  const formattedUpdate = new Date(pred.lastUpdated).toLocaleString('id-ID', {
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
              <Brain className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">Prediksi Risiko</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-zinc-300">{pred.kelurahan}</span>
              <span className="text-zinc-600">·</span>
              <span className="text-[10.5px] text-zinc-500">{pred.kecamatan}</span>
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

          {/* Risk section */}
          <div className="bg-[var(--bg-inner)] rounded-xl p-4 flex items-center gap-4">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold uppercase border"
              style={{
                borderColor: riskColor + '50',
                background: riskColor + '18',
                color: riskColor,
              }}
            >
              <span className="w-2 h-2 rounded-full" style={{ background: riskColor }} />
              {riskLabel}
            </span>
            <div>
              <div className="text-2xl font-bold font-mono" style={{ color: riskColor }}>
                {pred.riskScore}
                <span className="text-sm font-normal text-zinc-500">/100</span>
              </div>
              <div className="text-[10.5px] text-zinc-500 flex items-center gap-1 mt-0.5">
                <TrendingUp className="w-3 h-3" />
                {driverLabel}
              </div>
            </div>
          </div>

          {/* Forecast table */}
          <div className="space-y-2">
            <div className="text-[10.5px] text-zinc-500 uppercase font-bold tracking-wide flex items-center gap-1.5">
              <Droplets className="w-3 h-3" />
              Proyeksi Banjir
            </div>
            {FORECAST_ROWS.map(({ key, label }) => {
              const f = pred.forecast[key]
              if (!f) return null
              const barColor = probBarColor(f.probability)
              return (
                <div key={key} className="bg-[var(--bg-inner)] rounded-xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-zinc-300">{label}</span>
                    <span className="text-[10.5px] font-mono font-bold" style={{ color: barColor }}>
                      {f.probability}%
                    </span>
                  </div>
                  {/* Probability bar */}
                  <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden mb-2">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${f.probability}%`, background: barColor }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10.5px] text-zinc-500 font-mono">
                    <span>Est. kedalaman: <span className="text-zinc-300">{f.estimatedDepth}cm</span></span>
                    <span>Confidence: <span className="text-zinc-300">{f.confidence}%</span></span>
                  </div>
                </div>
              )
            })}
          </div>

        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[var(--border-main)] flex items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-1.5 text-[10.5px] text-zinc-500 font-mono">
            <Clock className="w-3 h-3" />
            Diperbarui: {formattedUpdate}
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
