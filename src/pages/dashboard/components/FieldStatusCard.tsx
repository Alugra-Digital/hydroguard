import { useState } from 'react'
import { Camera, Home, Navigation, MoreHorizontal, AlertTriangle } from 'lucide-react'
import { CCTV_LIST, SHELTER_LIST, EVAC_ROUTES } from '../data'
import FieldDetailModal from './FieldDetailModal'
import { useIsDark, adaptColor } from '../../../utils/themeColor'

interface FieldStatusCardProps {
  onShowToast: (msg: string) => void
  isDark?: boolean
}

const EVAC_CFG: Record<string, { color: string; label: string; textClass: string; borderColor: string }> = {
  aman:     { color: '#10b981', label: 'Aman',     textClass: 'text-emerald-400', borderColor: '#10b981' },
  terbatas: { color: '#f97316', label: 'Terbatas', textClass: 'text-orange-400',  borderColor: '#f97316' },
  tertutup: { color: '#ef4444', label: 'Tertutup', textClass: 'text-rose-400',    borderColor: '#ef4444' },
}

export default function FieldStatusCard({ onShowToast, isDark = true }: FieldStatusCardProps) {
  const [fieldDetail, setFieldDetail] = useState<{ type: 'cctv' | 'shelter' | 'evac'; id: string } | null>(null)
  const _isDark = useIsDark()
  const ac = (c: string) => adaptColor(c, _isDark)
  const track = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.14)'
  // ── CCTV ─────────────────────────────────────────────────
  const cctvSorted   = [...CCTV_LIST].sort((a, b) => {
    const order: Record<string, number> = { alert: 0, offline: 1, online: 2 }
    return (order[a.status] ?? 3) - (order[b.status] ?? 3)
  })
  const cctvAlert    = CCTV_LIST.filter(c => c.status === 'alert').length
  const cctvOnline   = CCTV_LIST.filter(c => c.status === 'online').length
  const cctvOffline  = CCTV_LIST.filter(c => c.status === 'offline').length
  const floodingCams = CCTV_LIST.filter(c => c.detections.flooding)
  const dotColor = (s: string) => s === 'alert' ? '#ef4444' : s === 'online' ? '#10b981' : '#3f3f46'

  // ── Posko ─────────────────────────────────────────────────
  const activeShels    = SHELTER_LIST.filter(s => s.status === 'active')
  const totalOccupy    = activeShels.reduce((sum, s) => sum + s.currentOccupancy, 0)
  const totalCapActive = activeShels.reduce((sum, s) => sum + s.capacity, 0)
  const occupyPct      = Math.round((totalOccupy / totalCapActive) * 100)

  // ── Evac ──────────────────────────────────────────────────
  const evacAman     = EVAC_ROUTES.filter(r => r.status === 'aman').length
  const evacTerbatas = EVAC_ROUTES.filter(r => r.status === 'terbatas').length
  const evacTertutup = EVAC_ROUTES.filter(r => r.status === 'tertutup').length

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)]/80 rounded-xl overflow-hidden">

      {/* Header */}
      <div className="px-5 py-4 border-b border-[var(--border-main)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-zinc-400" />
          <span className="text-sm font-bold text-zinc-200">Situasi Lapangan</span>
        </div>
        <button onClick={() => onShowToast('Detail situasi lapangan')}
          className="p-1 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-5">

        {/* ══ SECTION 1: CCTV ══ */}
        <div>
          {/* Title + count pills */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-[10.5px] font-bold text-zinc-400 uppercase tracking-wide">CCTV Monitor</span>
            </div>
            <div className="flex items-center gap-1">
              {[
                { count: cctvOnline,  color: '#10b981', label: 'Online' },
                { count: cctvAlert,   color: '#ef4444', label: 'Alert'  },
                { count: cctvOffline, color: '#52525b', label: 'Offline'},
              ].map(x => (
                <span key={x.label}
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10.5px] font-bold"
                  style={{ background: ac(x.color) + '18', color: ac(x.color) }}>
                  {x.count} {x.label}
                </span>
              ))}
            </div>
          </div>

          {/* Camera dot grid — 20 dots sorted: alert first */}
          <div className="bg-[var(--bg-inner)] rounded-xl p-3 mb-3">
            <div className="text-[10.5px] text-zinc-600 font-mono mb-2">20 kamera terpasang</div>
            <div className="flex flex-wrap gap-1.5">
              {cctvSorted.map(c => (
                <div key={c.id} title={c.name}
                  className={`rounded-sm transition-all ${c.status === 'alert' ? 'animate-pulse' : ''}`}
                  style={{ width: 10, height: 10, background: dotColor(c.status), opacity: c.status === 'offline' ? 0.4 : 1 }}
                />
              ))}
            </div>
          </div>

          {/* Flooding alert cameras */}
          {floodingCams.length > 0 && (
            <div className="space-y-1.5">
              {floodingCams.map(c => (
                <div key={c.id}
                  onClick={() => setFieldDetail({ type: 'cctv', id: c.id })}
                  className="flex items-center gap-2.5 bg-rose-950/30 border border-rose-900/40 rounded-xl px-3 py-2 cursor-pointer hover:bg-rose-950/50 transition-colors">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[10.5px] font-semibold text-rose-300 truncate">{c.name}</div>
                    <div className="text-[10.5px] text-rose-400/70 font-mono">
                      ~{c.detections.waterLevel}cm · {c.detections.vehiclesStranded} kendaraan terjebak
                    </div>
                  </div>
                  <span className="text-[10.5px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 flex-shrink-0 animate-pulse">
                    BANJIR
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ══ SECTION 2: Posko ══ */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-[10.5px] font-bold text-zinc-400 uppercase tracking-wide">Posko Pengungsian</span>
            </div>
            <span className="text-[10.5px] text-zinc-500">
              <span className="text-white font-bold">{activeShels.length}</span> posko aktif
            </span>
          </div>

          {/* Big occupancy number */}
          <div className="bg-[var(--bg-inner)] rounded-xl p-4 mb-2.5">
            <div className="flex items-end justify-between mb-2">
              <div>
                <div className="text-3xl font-bold text-white leading-none">
                  {totalOccupy}
                  <span className="text-sm font-normal text-zinc-500 ml-1">jiwa</span>
                </div>
                <div className="text-[10.5px] text-zinc-600 mt-1">dari {totalCapActive} kapasitas posko aktif</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold" style={{ color: ac(occupyPct > 75 ? '#ef4444' : occupyPct > 40 ? '#f59e0b' : '#3b82f6') }}>
                  {occupyPct}%
                </div>
                <div className="text-[10.5px] text-zinc-600">terpakai</div>
              </div>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: track }}>
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${occupyPct}%`, background: ac(occupyPct > 75 ? '#ef4444' : occupyPct > 40 ? '#f59e0b' : '#3b82f6') }} />
            </div>
          </div>

          {/* Per-posko bars */}
          <div className="space-y-1.5">
            {activeShels.map(s => {
              const pct = Math.round((s.currentOccupancy / s.capacity) * 100)
              return (
                <div key={s.id} onClick={() => setFieldDetail({ type: 'shelter', id: s.id })} className="bg-[var(--bg-inner)] rounded-xl px-3 py-2.5 cursor-pointer hover:bg-zinc-900/30 transition-colors">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10.5px] font-medium text-zinc-300 truncate flex-1 mr-2">{s.name}</span>
                    <span className="text-[10.5px] font-bold text-blue-400 flex-shrink-0">
                      {s.currentOccupancy}<span className="text-zinc-600 font-normal">/{s.capacity}</span>
                    </span>
                  </div>
                  <div className="h-1 rounded-full overflow-hidden" style={{ background: track }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: '#3b82f6' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ══ SECTION 3: Jalur Evakuasi ══ */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[10.5px] font-bold text-zinc-400 uppercase tracking-wide">Jalur Evakuasi</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10.5px] font-bold">
              {evacAman     > 0 && <span className="text-emerald-400">{evacAman} Aman</span>}
              {evacTerbatas > 0 && <span className="text-orange-400">{evacTerbatas} Terbatas</span>}
              {evacTertutup > 0 && <span className="text-rose-400">{evacTertutup} Tertutup</span>}
            </div>
          </div>

          <div className="space-y-1.5">
            {EVAC_ROUTES.map(r => {
              const cfg = EVAC_CFG[r.status]
              return (
                <div key={r.id}
                  onClick={() => setFieldDetail({ type: 'evac', id: r.id })}
                  className="bg-[var(--bg-inner)] rounded-xl px-3 py-2.5 flex items-center justify-between cursor-pointer hover:bg-zinc-900/30 transition-colors">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cfg.borderColor }} />
                    <div className="min-w-0">
                      <div className="text-[10.5px] font-medium text-zinc-300 truncate">{r.name}</div>
                      <div className="text-[10.5px] text-zinc-600 font-mono">{r.kelurahan}</div>
                    </div>
                  </div>
                  <span className={`text-[10.5px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0 ml-2 ${cfg.textClass}`}
                    style={{ background: cfg.color + '15', border: `1px solid ${cfg.color}35` }}>
                    {cfg.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

      </div>

      {fieldDetail && (
        <FieldDetailModal
          type={fieldDetail.type}
          id={fieldDetail.id}
          onClose={() => setFieldDetail(null)}
        />
      )}
    </div>
  )
}
