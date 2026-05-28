import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Users, Anchor, Zap, MoreHorizontal, X } from 'lucide-react'
import { RESOURCE_SUMMARY, PUMPS_DATA, BOATS_DATA, PERSONNEL_DATA } from '../data'

interface ResourceCardProps {
  onShowToast: (msg: string) => void
}

type ModalType = 'personil' | 'pompa' | 'perahu' | null

// ── Resource Detail Modal ─────────────────────────────────
function ResourceModal({ type, onClose }: { type: ModalType; onClose: () => void }) {
  if (!type) return null

  const config = {
    personil: { title: 'Personil Lapangan', color: '#6366f1', total: RESOURCE_SUMMARY.personnelTotal },
    pompa:    { title: 'Armada Pompa Air',  color: '#f59e0b', total: RESOURCE_SUMMARY.pumpsTotal    },
    perahu:   { title: 'Armada Perahu',     color: '#3b82f6', total: RESOURCE_SUMMARY.boatsTotal    },
  }[type]

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
         style={{ zIndex: 99999 }}>
      <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl shadow-black/60 overflow-hidden">

        {/* Header */}
        <div className="px-5 py-4 border-b border-[var(--border-main)] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: config.color }} />
            <h3 className="text-sm font-bold text-white">{config.title}</h3>
            <span className="text-[10.5px] font-mono text-zinc-500 bg-[var(--bg-inner)] px-2 py-0.5 rounded border border-[var(--border-subtle)]">
              {config.total} unit
            </span>
          </div>
          <button onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List */}
        <div className="overflow-y-auto flex-1 p-4 space-y-2">

          {type === 'personil' && (
            <>
              {/* Group by role */}
              {['BPBD', 'Damkar', 'PPSU', 'Tagana', 'Relawan'].map(role => {
                const group = PERSONNEL_DATA.filter((p: any) => p.role === role)
                if (!group.length) return null
                return (
                  <div key={role}>
                    <div className="text-[10.5px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 mt-2 first:mt-0">
                      {role} ({group.filter((p: any) => p.status === 'active').length}/{group.length})
                    </div>
                    {group.map((p: any) => (
                      <div key={p.id} className="flex items-center justify-between bg-[var(--bg-inner)] rounded-xl px-3 py-2 mb-1">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${p.status === 'active' ? 'bg-emerald-500' : 'bg-zinc-600'}`} />
                          <span className="text-[11px] font-medium text-zinc-200 truncate">{p.name}</span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 text-right">
                          <span className="text-[10.5px] text-zinc-500 truncate max-w-[90px]">{p.location}</span>
                          <span className={`text-[10.5px] font-bold px-1.5 py-0.5 rounded ${
                            p.status === 'active'
                              ? 'text-emerald-400 bg-emerald-950/40'
                              : 'text-zinc-500 bg-zinc-900/40'
                          }`}>
                            {p.status === 'active' ? 'Aktif' : 'Standby'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              })}
            </>
          )}

          {type === 'pompa' && [...PUMPS_DATA].sort((a: any, b: any) =>
            a.status === 'deployed' && b.status !== 'deployed' ? -1 : 1
          ).map((p: any) => (
            <div key={p.id} className="bg-[var(--bg-inner)] rounded-xl px-4 py-3 flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${p.status === 'deployed' ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-600'}`} />
                  <span className="text-xs font-semibold text-zinc-200 truncate">{p.name}</span>
                  <span className="text-[10.5px] text-zinc-600 font-mono flex-shrink-0">{p.capacity}</span>
                </div>
                <div className="text-[10.5px] text-zinc-500 pl-3.5">
                  {p.type === 'mobile' ? 'Mobile' : 'Stasioner'} · {p.location}
                  {p.operator && p.operator !== '-' && <span> · {p.operator}</span>}
                </div>
              </div>
              <span className={`text-[10.5px] font-bold px-2 py-1 rounded-lg flex-shrink-0 ${
                p.status === 'deployed'
                  ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-900/40'
                  : 'text-zinc-500 bg-zinc-900/40 border border-zinc-800/40'
              }`}>
                {p.status === 'deployed' ? 'Deploy' : 'Standby'}
              </span>
            </div>
          ))}

          {type === 'perahu' && [...BOATS_DATA].sort((a: any, b: any) =>
            a.status === 'deployed' && b.status !== 'deployed' ? -1 : 1
          ).map((b: any) => (
            <div key={b.id} className="bg-[var(--bg-inner)] rounded-xl px-4 py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${b.status === 'deployed' ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-600'}`} />
                <span className="text-xs font-semibold text-zinc-200 truncate">{b.name}</span>
                <span className="text-[10.5px] text-zinc-600 font-mono flex-shrink-0">{b.capacity}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[10.5px] text-zinc-500 truncate max-w-[80px]">{b.location}</span>
                <span className={`text-[10.5px] font-bold px-2 py-1 rounded-lg ${
                  b.status === 'deployed'
                    ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-900/40'
                    : 'text-zinc-500 bg-zinc-900/40 border border-zinc-800/40'
                }`}>
                  {b.status === 'deployed' ? 'Deploy' : 'Standby'}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="px-5 py-3 border-t border-[var(--border-main)] flex justify-end flex-shrink-0">
          <button onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-white transition-colors">
            Tutup
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

// ── Main card ─────────────────────────────────────────────
export default function ResourceCard({ onShowToast }: ResourceCardProps) {
  const [activeModal, setActiveModal] = useState<ModalType>(null)

  const cards = [
    {
      key: 'personil' as ModalType,
      icon: <Users className="w-3.5 h-3.5 text-indigo-400" />,
      label: 'Personil Aktif',
      active: RESOURCE_SUMMARY.personnelActive,
      total:  RESOURCE_SUMMARY.personnelTotal,
    },
    {
      key: 'pompa' as ModalType,
      icon: <Zap className="w-3.5 h-3.5 text-amber-400" />,
      label: 'Pompa Deploy',
      active: RESOURCE_SUMMARY.pumpsDeployed,
      total:  RESOURCE_SUMMARY.pumpsTotal,
    },
    {
      key: 'perahu' as ModalType,
      icon: <Anchor className="w-3.5 h-3.5 text-blue-400" />,
      label: 'Perahu Deploy',
      active: RESOURCE_SUMMARY.boatsDeployed,
      total:  RESOURCE_SUMMARY.boatsTotal,
    },
  ]

  return (
    <>
      <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)]/80 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--border-main)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-white">Sumber Daya Operasional</span>
          </div>
          <button onClick={() => onShowToast('Detail sumber daya')}
            className="p-1 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 grid grid-cols-3 gap-3">
          {cards.map(card => (
            <button
              key={card.key}
              onClick={() => setActiveModal(card.key)}
              className="bg-[var(--bg-inner)] rounded-xl p-3 text-left hover:ring-1 hover:ring-[var(--border-subtle)] transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-1.5 mb-2">
                {card.icon}
                <span className="text-[10.5px] font-bold text-zinc-500 uppercase tracking-wide">{card.label}</span>
              </div>
              <div className="text-2xl font-bold text-white group-hover:text-white">
                {card.active}
                <span className="text-sm text-zinc-500 font-normal">/{card.total}</span>
              </div>
              <div className="text-[10.5px] text-zinc-600 mt-1.5">Klik untuk detail →</div>
            </button>
          ))}
        </div>
      </div>

      <ResourceModal type={activeModal} onClose={() => setActiveModal(null)} />
    </>
  )
}
