import { createPortal } from 'react-dom'
import { X, Camera, Home, Navigation, AlertTriangle, Users, ExternalLink } from 'lucide-react'
import { CCTV_LIST, SHELTER_LIST, EVAC_ROUTES } from '../data'

type FieldDetailType =
  | { type: 'cctv';    id: string; onClose: () => void }
  | { type: 'shelter'; id: string; onClose: () => void }
  | { type: 'evac';    id: string; onClose: () => void }

const EVAC_STATUS_CFG: Record<string, { color: string; label: string }> = {
  aman:     { color: '#10b981', label: 'Aman'     },
  terbatas: { color: '#f97316', label: 'Terbatas' },
  tertutup: { color: '#ef4444', label: 'Tertutup' },
}

function CctvModal({ id, onClose }: { id: string; onClose: () => void }) {
  const c = CCTV_LIST.find(x => x.id === id)
  if (!c) return null

  const statusColor =
    c.status === 'alert'   ? '#ef4444' :
    c.status === 'online'  ? '#10b981' :
    '#71717a'
  const statusLabel =
    c.status === 'alert'   ? 'ALERT' :
    c.status === 'online'  ? 'Live'  :
    'Offline'

  const lastUpdateFormatted = new Date(c.lastUpdate).toLocaleString('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  return (
    <>
      {/* Header */}
      <div className="px-5 py-4 border-b border-[var(--border-main)] flex items-start justify-between gap-3 flex-shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Camera className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-white">Detail CCTV</h3>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-zinc-300">{c.name}</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      <div className="overflow-y-auto flex-1 p-5 space-y-4">

        {/* Name + location + status */}
        <div className="bg-[var(--bg-inner)] rounded-xl p-4 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="text-sm font-bold text-white">{c.name}</div>
              <div className="text-xs text-zinc-400 mt-0.5">{c.location}</div>
            </div>
            <span
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10.5px] font-bold uppercase border flex-shrink-0"
              style={{ borderColor: statusColor + '50', background: statusColor + '18', color: statusColor }}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${c.status === 'alert' ? 'animate-pulse' : ''}`} style={{ background: statusColor }} />
              {statusLabel}
            </span>
          </div>
        </div>

        {/* Flooding alert */}
        {c.detections.flooding && (
          <div className="bg-rose-950/30 border border-rose-900/40 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span className="text-sm font-bold text-rose-300">Terdeteksi Banjir</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-[10.5px] text-rose-400/70 uppercase font-bold tracking-wide">Tinggi Air</div>
                <div className="text-xl font-bold font-mono text-rose-300">
                  ~{c.detections.waterLevel}<span className="text-xs font-normal text-rose-400/70 ml-1">cm</span>
                </div>
              </div>
              <div>
                <div className="text-[10.5px] text-rose-400/70 uppercase font-bold tracking-wide">Kendaraan Terjebak</div>
                <div className="text-xl font-bold font-mono text-rose-300">
                  {c.detections.vehiclesStranded}
                  <span className="text-xs font-normal text-rose-400/70 ml-1">unit</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Grid info */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[var(--bg-inner)] rounded-xl p-3 space-y-0.5">
            <div className="text-[10.5px] text-zinc-600 uppercase font-bold tracking-wide flex items-center gap-1">
              <Users className="w-3 h-3" /> Kepadatan Area
            </div>
            <div className="text-sm font-semibold text-zinc-200 capitalize">{c.detections.crowdDensity}</div>
          </div>
          <div className="bg-[var(--bg-inner)] rounded-xl p-3 space-y-0.5">
            <div className="text-[10.5px] text-zinc-600 uppercase font-bold tracking-wide">Pembaruan Terakhir</div>
            <div className="text-[10.5px] font-mono text-zinc-300">{lastUpdateFormatted}</div>
          </div>
        </div>

        {/* Live feed link */}
        {c.embedUrl && (
          <a
            href={c.embedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-blue-950/40 border border-blue-900/40 text-blue-400 hover:bg-blue-950/60 transition-colors text-xs font-semibold"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Buka Live Feed
          </a>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-[var(--border-main)] flex items-center justify-end flex-shrink-0">
        <button
          onClick={onClose}
          className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
        >
          Tutup
        </button>
      </div>
    </>
  )
}

function ShelterModal({ id, onClose }: { id: string; onClose: () => void }) {
  const s = SHELTER_LIST.find(x => x.id === id)
  if (!s) return null

  const occupyPct = Math.round((s.currentOccupancy / s.capacity) * 100)
  const occupyBarColor =
    occupyPct > 75 ? '#ef4444' :
    occupyPct > 40 ? '#f59e0b' :
    '#3b82f6'

  const statusColor = s.status === 'active' ? '#3b82f6' : '#71717a'
  const statusLabel = s.status === 'active' ? 'Aktif' : 'Siaga'

  return (
    <>
      {/* Header */}
      <div className="px-5 py-4 border-b border-[var(--border-main)] flex items-start justify-between gap-3 flex-shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Home className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white">Detail Posko</h3>
          </div>
          <span className="text-xs font-semibold text-zinc-300">{s.name}</span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      <div className="overflow-y-auto flex-1 p-5 space-y-4">

        {/* Name + address + status */}
        <div className="bg-[var(--bg-inner)] rounded-xl p-4 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="text-sm font-bold text-white">{s.name}</div>
              <div className="text-xs text-zinc-400 mt-0.5">{s.address}</div>
            </div>
            <span
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10.5px] font-bold uppercase border flex-shrink-0"
              style={{ borderColor: statusColor + '50', background: statusColor + '18', color: statusColor }}
            >
              {statusLabel}
            </span>
          </div>
        </div>

        {/* Occupancy */}
        <div className="bg-[var(--bg-inner)] rounded-xl p-4 space-y-3">
          <div className="text-[10.5px] text-zinc-500 uppercase font-bold tracking-wide">Kapasitas Pengungsian</div>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-3xl font-bold text-white leading-none">
                {s.currentOccupancy}
                <span className="text-sm font-normal text-zinc-500 ml-1">jiwa</span>
              </div>
              <div className="text-[10.5px] text-zinc-600 mt-1">dari {s.capacity} kapasitas</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold" style={{ color: occupyBarColor }}>
                {occupyPct}%
              </div>
              <div className="text-[10.5px] text-zinc-600">terpakai</div>
            </div>
          </div>
          <div className="h-2 rounded-full overflow-hidden bg-zinc-800">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${occupyPct}%`, background: occupyBarColor }}
            />
          </div>
        </div>

        {/* Coordinates */}
        <div className="bg-[var(--bg-inner)] rounded-xl p-4 space-y-1">
          <div className="text-[10.5px] text-zinc-500 uppercase font-bold tracking-wide">Koordinat</div>
          <div className="text-xs font-mono text-zinc-300">
            {s.lat.toFixed(6)}, {s.lng.toFixed(6)}
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-[var(--border-main)] flex items-center justify-end flex-shrink-0">
        <button
          onClick={onClose}
          className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
        >
          Tutup
        </button>
      </div>
    </>
  )
}

function EvacModal({ id, onClose }: { id: string; onClose: () => void }) {
  const r = EVAC_ROUTES.find(x => x.id === id)
  if (!r) return null

  const cfg = EVAC_STATUS_CFG[r.status] ?? { color: '#94a3b8', label: r.status }

  return (
    <>
      {/* Header */}
      <div className="px-5 py-4 border-b border-[var(--border-main)] flex items-start justify-between gap-3 flex-shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Navigation className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Detail Jalur Evakuasi</h3>
          </div>
          <span className="text-xs font-semibold text-zinc-300">{r.name}</span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      <div className="overflow-y-auto flex-1 p-5 space-y-4">

        {/* Name + kelurahan + status */}
        <div className="bg-[var(--bg-inner)] rounded-xl p-4 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="text-sm font-bold text-white">{r.name}</div>
              <div className="text-xs text-zinc-400 mt-0.5">{r.kelurahan}</div>
            </div>
            <span
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10.5px] font-bold uppercase border flex-shrink-0"
              style={{ borderColor: cfg.color + '50', background: cfg.color + '18', color: cfg.color }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.color }} />
              {cfg.label}
            </span>
          </div>
        </div>

        {/* Path info */}
        <div className="bg-[var(--bg-inner)] rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-[10.5px] text-zinc-500 uppercase font-bold tracking-wide">Titik Koordinat</div>
            <span className="text-xs font-bold font-mono text-zinc-300">{r.path.length} titik</span>
          </div>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {r.path.map((pt, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-[10.5px] font-mono text-zinc-400"
              >
                <span className="w-4 h-4 rounded-full bg-zinc-800 border border-[var(--border-subtle)] flex items-center justify-center text-[9px] text-zinc-500 flex-shrink-0">
                  {i + 1}
                </span>
                [{pt[0].toFixed(4)}, {pt[1].toFixed(4)}]
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-[var(--border-main)] flex items-center justify-end flex-shrink-0">
        <button
          onClick={onClose}
          className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
        >
          Tutup
        </button>
      </div>
    </>
  )
}

export default function FieldDetailModal(props: FieldDetailType) {
  const { onClose } = props

  const inner =
    props.type === 'cctv'    ? <CctvModal    id={props.id} onClose={onClose} /> :
    props.type === 'shelter' ? <ShelterModal id={props.id} onClose={onClose} /> :
                               <EvacModal    id={props.id} onClose={onClose} />

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      style={{ zIndex: 99999 }}
    >
      <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
        {inner}
      </div>
    </div>,
    document.body
  )
}
