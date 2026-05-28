import { useState, useMemo } from 'react'
import { Bell, SlidersHorizontal } from 'lucide-react'
import type { AlertItem, AlertFilter } from '../types'
import { ALERT_LOGS, ALERT_DETAILS } from '../data'
import AlertDetailModal from './AlertDetailModal'

interface GuardrailExceptionsProps {
  searchTerm: string
  onShowToast: (msg: string) => void
}

const LEVEL_STYLE: Record<AlertItem['level'], string> = {
  siaga1: 'bg-rose-950/50 border-rose-900/50 text-rose-400',
  siaga2: 'bg-amber-950/50 border-amber-900/50 text-amber-400',
  siaga3: 'bg-sky-950/50 border-sky-900/50 text-sky-400',
}

const LEVEL_LABEL: Record<AlertItem['level'], string> = {
  siaga1: 'Siaga 1',
  siaga2: 'Siaga 2',
  siaga3: 'Siaga 3',
}

const FILTERS: AlertFilter[] = ['Semua', 'Siaga 1', 'Siaga 2', 'Siaga 3']

export default function GuardrailExceptions({ searchTerm, onShowToast }: GuardrailExceptionsProps) {
  const [alertFilter, setAlertFilter] = useState<AlertFilter>('Semua')
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return ALERT_LOGS.filter((item) => {
      const matchSearch =
        item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.trigger.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sensorId.toLowerCase().includes(searchTerm.toLowerCase())

      const matchFilter =
        alertFilter === 'Semua' || LEVEL_LABEL[item.level] === alertFilter

      return matchSearch && matchFilter
    })
  }, [searchTerm, alertFilter])

  return (
    <>
    <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)]/80 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-[var(--border-main)] flex justify-between items-center select-none">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-zinc-400" />
          <h2 className="text-sm font-bold text-zinc-200">Alert Banjir Aktif</h2>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 bg-zinc-950 border border-[var(--border-subtle)] p-0.5 rounded-md text-[10.5px] font-medium mr-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => {
                  setAlertFilter(f)
                  onShowToast(`Filter alert: ${f}`)
                }}
                className={`px-1.5 py-0.5 rounded transition-all ${
                  alertFilter === f ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <button
            onClick={() => onShowToast('Filter lanjutan alert')}
            className="px-2.5 py-1 rounded-md border border-[var(--border-subtle)] hover:border-zinc-700 bg-zinc-900/30 hover:bg-zinc-900 text-[10.5px] font-semibold text-zinc-300 flex items-center gap-1 transition-colors"
          >
            <SlidersHorizontal className="w-2.5 h-2.5" />
            Filter
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--border-main)] text-[10.5px] font-bold text-zinc-500 uppercase bg-zinc-950/40 select-none">
              <th className="py-3 px-5">Waktu</th>
              <th className="py-3 px-4">Sensor ID</th>
              <th className="py-3 px-4">Trigger / Kondisi</th>
              <th className="py-3 px-4">Lokasi</th>
              <th className="py-3 px-5 text-right">Level</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-main)] text-xs font-medium">
            {filtered.length > 0 ? (
              filtered.map((item, index) => (
                <tr
                  key={index}
                  onClick={() => setSelectedAlertId(ALERT_DETAILS.find(a => a.sensorId === item.sensorId)?.id ?? null)}
                  className="hover:bg-zinc-900/30 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-5 text-zinc-400 font-mono select-none">{item.time}</td>
                  <td className="py-3.5 px-4 text-zinc-200 font-semibold">{item.sensorId}</td>
                  <td className="py-3.5 px-4 text-zinc-300 max-w-[200px] truncate" title={item.trigger}>
                    {item.trigger}
                  </td>
                  <td className="py-3.5 px-4 text-zinc-500 font-mono text-[10.5px] truncate max-w-[200px]" title={item.location}>
                    {item.location}
                    <span className="text-[10.5px] text-zinc-500 font-mono ml-1">±{item.estTimeMin}m</span>
                  </td>
                  <td className="py-3.5 px-5 text-right select-none">
                    <span className={`inline-flex px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wider rounded border ${LEVEL_STYLE[item.level]}`}>
                      {LEVEL_LABEL[item.level]}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-8 text-center text-zinc-500 text-xs select-none">
                  Tidak ada alert yang sesuai filter
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>

      {selectedAlertId && (
        <AlertDetailModal alertId={selectedAlertId} onClose={() => setSelectedAlertId(null)} />
      )}
    </>
  )
}
