import { useState } from 'react'
import { Camera, X, ExternalLink, WifiOff, AlertTriangle } from 'lucide-react'
import PageKpiCard from '../../components/PageKpiCard'
import { cctvData } from '../../mock/cctvMonitor'

type FilterStatus = 'all' | 'online' | 'alert' | 'offline'

interface CameraItem {
  id: string
  name: string
  location: string
  status: string
  detections: {
    flooding: boolean
    waterLevel: number
    vehiclesStranded: number
    crowdDensity: string
  }
  embedUrl: string | null
  lastUpdate: string
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'alert') return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-950/50 border border-rose-900/50 text-rose-400 text-[10.5px] font-bold uppercase tracking-wider">
      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" /> ALERT
    </span>
  )
  if (status === 'online') return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-900/40 text-emerald-400 text-[10.5px] font-bold uppercase tracking-wider">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-900/50 border border-zinc-700/50 text-zinc-500 text-[10.5px] font-bold uppercase tracking-wider">
      <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" /> Offline
    </span>
  )
}

function formatTs(iso: string) {
  return new Date(iso).toLocaleString('id-ID', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' })
}

// ── Camera preview — iframe jika ada embedUrl, placeholder jika tidak ─────
function CameraPreview({ cam, height = 160 }: { cam: CameraItem; height?: number }) {
  const [errored, setErrored] = useState(false)

  if (cam.status === 'offline') {
    return (
      <div className="w-full bg-zinc-950 flex flex-col items-center justify-center gap-2" style={{ height }}>
        <WifiOff className="w-7 h-7 text-zinc-700" />
        <span className="text-[10.5px] text-zinc-600 font-mono">Kamera Offline</span>
      </div>
    )
  }

  if (cam.embedUrl && !errored) {
    return (
      <div className="relative w-full bg-zinc-950" style={{ height }}>
        {/* Loading backdrop */}
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-950 z-0">
          <Camera className="w-7 h-7 text-zinc-700 animate-pulse" />
        </div>
        <iframe
          src={cam.embedUrl}
          title={cam.name}
          className="relative z-10 w-full h-full border-0"
          allow="autoplay; fullscreen; picture-in-picture"
          loading="lazy"
          onError={() => setErrored(true)}
          style={{ height }}
        />
        {/* Flood overlay on top */}
        {cam.detections.flooding && (
          <div className="absolute inset-0 z-20 bg-rose-900/50 flex items-center justify-center pointer-events-none">
            <span className="text-rose-200 font-black text-lg tracking-widest uppercase drop-shadow-lg">BANJIR</span>
          </div>
        )}
        {/* Status dot */}
        <div className="absolute top-2 right-2 z-20">
          <span className={`w-2.5 h-2.5 rounded-full block ${cam.status === 'alert' ? 'bg-rose-400 animate-pulse' : 'bg-emerald-400'}`} />
        </div>
      </div>
    )
  }

  // Fallback — no embedUrl or errored
  return (
    <div className={`relative w-full flex items-center justify-center ${cam.status === 'alert' ? 'bg-rose-950/40' : 'bg-zinc-950/80'}`} style={{ height }}>
      <Camera className="w-8 h-8 text-zinc-700" />
      <div className="absolute top-2 right-2">
        <span className={`w-2.5 h-2.5 rounded-full block ${cam.status === 'alert' ? 'bg-rose-400 animate-pulse' : 'bg-emerald-400'}`} />
      </div>
      <div className="absolute top-2 left-2 text-[10.5px] font-mono text-zinc-600">{cam.id}</div>
      {cam.detections.flooding && (
        <div className="absolute inset-0 bg-rose-900/60 flex items-center justify-center">
          <span className="text-rose-300 font-black text-base tracking-widest uppercase">BANJIR</span>
        </div>
      )}
      {errored && (
        <div className="absolute bottom-2 left-2 right-2 text-center">
          <span className="text-[10.5px] text-zinc-600 font-mono">Stream tidak tersedia</span>
        </div>
      )}
    </div>
  )
}

export default function CCTVMonitorPage() {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [selectedCam, setSelectedCam]   = useState<CameraItem | null>(null)

  const onlineCount  = cctvData.filter(c => c.status === 'online').length
  const alertCount   = cctvData.filter(c => c.status === 'alert').length
  const offlineCount = cctvData.filter(c => c.status === 'offline').length
  const streamCount  = cctvData.filter(c => c.embedUrl).length

  const filtered = cctvData.filter(c =>
    filterStatus === 'all' ? true : c.status === filterStatus
  ) as CameraItem[]

  return (
    <div className="flex-1 overflow-y-auto px-6 pb-8 space-y-5 pt-5">

      {/* KPI Header */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)]/80 rounded-xl p-5">
        <div className="flex items-center gap-2.5 mb-4">
          <Camera className="w-4 h-4 text-purple-400" />
          <div>
            <h1 className="text-sm font-bold text-zinc-200">CCTV Monitor</h1>
            <p className="text-[10.5px] text-zinc-500">{cctvData.length} Kamera · {streamCount} Live Stream · Jakarta Selatan</p>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <PageKpiCard
            icon={<Camera className="w-3.5 h-3.5" />}
            label="Kamera Online"
            value={onlineCount}
            sub="Live stream aktif"
            color="#10b981"
          />
          <PageKpiCard
            icon={<AlertTriangle className="w-3.5 h-3.5" />}
            label="Kamera Alert"
            value={alertCount}
            sub="Terdeteksi flooding"
            color="#ef4444"
          />
          <PageKpiCard
            icon={<WifiOff className="w-3.5 h-3.5" />}
            label="Kamera Offline"
            value={offlineCount}
            sub="Tidak terhubung"
            color="#71717a"
          />
          <PageKpiCard
            icon={<Camera className="w-3.5 h-3.5" />}
            label="Live Stream"
            value={streamCount}
            sub="Memiliki embed URL"
            color="#3b82f6"
          />
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-1 bg-[var(--bg-card)] border border-[var(--border-subtle)]/80 p-0.5 rounded-lg w-fit select-none">
        {(['all', 'online', 'alert', 'offline'] as const).map(s => (
          <button key={s} onClick={() => setFilterStatus(s)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              filterStatus === s ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
            }`}>
            {s === 'all' ? 'Semua' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Camera Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map(cam => (
          <div key={cam.id}
            onClick={() => setSelectedCam(selectedCam?.id === cam.id ? null : cam)}
            className={`bg-[var(--bg-card)] border rounded-xl overflow-hidden cursor-pointer transition-all hover:ring-1 hover:ring-zinc-600 ${
              cam.status === 'alert' ? 'border-rose-500/50' :
              cam.status === 'offline' ? 'border-[var(--border-subtle)]/80 opacity-60' :
              'border-[var(--border-subtle)]/80'
            } ${selectedCam?.id === cam.id ? 'ring-2 ring-zinc-400' : ''}`}
          >
            {/* Live preview / iframe */}
            <CameraPreview cam={cam} height={160} />

            {/* Info */}
            <div className="p-3">
              <div className="font-semibold text-zinc-200 text-xs truncate">{cam.name}</div>
              <div className="text-[10.5px] text-zinc-500 mt-0.5 truncate">{cam.location}</div>
              <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                <StatusBadge status={cam.status} />
                {cam.detections.flooding && (
                  <span className="text-[10.5px] font-bold text-rose-400">~{cam.detections.waterLevel}cm</span>
                )}
                {cam.embedUrl && cam.status !== 'offline' && (
                  <span className="text-[10.5px] font-mono text-blue-400 ml-auto">LIVE</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Panel */}
      {selectedCam && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)]/80 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--border-main)] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Camera className="w-4 h-4 text-purple-400" />
              <div>
                <div className="text-sm font-bold text-zinc-200">{selectedCam.name}</div>
                <div className="text-[10.5px] text-zinc-500">{selectedCam.location} · {selectedCam.id}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {selectedCam.embedUrl && (
                <a href={selectedCam.embedUrl} target="_blank" rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0077b6] hover:bg-[#005f92] text-white text-[10.5px] font-semibold transition-colors">
                  <ExternalLink className="w-3 h-3" /> Buka Full Screen
                </a>
              )}
              <button onClick={() => setSelectedCam(null)}
                className="text-zinc-500 hover:text-zinc-300 p-1 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
            {/* Large stream preview */}
            <div className="lg:col-span-3 border-r border-[var(--border-main)]">
              <CameraPreview cam={selectedCam} height={320} />
            </div>

            {/* Detection details */}
            <div className="lg:col-span-2 p-5 space-y-3">
              <div className="text-[10.5px] font-bold text-zinc-500 uppercase tracking-wider mb-3">Deteksi & Status</div>
              {[
                { label: 'Status Kamera',      val: <StatusBadge status={selectedCam.status} /> },
                { label: 'Ketinggian Air',      val: <span className={`text-sm font-bold ${selectedCam.detections.flooding ? 'text-rose-400' : 'text-emerald-400'}`}>{selectedCam.detections.waterLevel} cm</span> },
                { label: 'Kendaraan Terdampak', val: <span className={`text-sm font-bold ${selectedCam.detections.vehiclesStranded > 0 ? 'text-amber-400' : 'text-zinc-400'}`}>{selectedCam.detections.vehiclesStranded}</span> },
                { label: 'Kepadatan Area',      val: <span className="text-sm font-bold text-zinc-300 capitalize">{selectedCam.detections.crowdDensity}</span> },
                { label: 'Banjir Terdeteksi',   val: selectedCam.detections.flooding
                    ? <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-rose-400"><span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />Ya</span>
                    : <span className="text-[10.5px] text-emerald-400 font-bold">Tidak</span> },
                { label: 'Update Terakhir',     val: <span className="text-[10.5px] font-mono text-zinc-400">{formatTs(selectedCam.lastUpdate)}</span> },
              ].map(row => (
                <div key={row.label} className="bg-[var(--bg-inner)] rounded-xl px-3 py-2.5 flex items-center justify-between gap-2">
                  <span className="text-[10.5px] text-zinc-500">{row.label}</span>
                  {row.val}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
