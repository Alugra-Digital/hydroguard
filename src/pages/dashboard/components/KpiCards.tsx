import { Activity, Gauge, CloudRain, AlertTriangle, MoreHorizontal } from 'lucide-react'
import type { ComputedMetrics } from '../types'
import Sparkline from './Sparkline'

interface KpiCardsProps {
  computedMetrics: ComputedMetrics
  metricsModifier: { multiplier: number; suffix: string }
  onShowToast: (msg: string) => void
}

export default function KpiCards({ computedMetrics, metricsModifier, onShowToast }: KpiCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

      {/* CARD 1: Sensor Aktif */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)]/80 rounded-xl p-4 flex flex-col justify-between hover:border-zinc-800 transition-colors duration-300 relative group">
        <div className="flex justify-between items-center text-xs font-semibold text-zinc-500 mb-2">
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-indigo-400" />
            <span>Sensor Aktif</span>
          </div>
          <button
            onClick={() => onShowToast('Detail status sensor')}
            className="text-zinc-600 hover:text-zinc-300 transition-colors p-0.5"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-end justify-between my-2">
          <div className="text-3xl font-bold text-white tracking-tight">
            {computedMetrics.sensorAktif.value}
          </div>
          <div className="pb-1">
            <Sparkline color="#3b82f6" heights={computedMetrics.sensorAktif.spark} />
          </div>
        </div>

        <div className="text-[10.5px] flex items-center gap-1 font-medium mt-1">
          <span className="text-zinc-500">Online dari total sensor</span>
          <span className="text-emerald-500 flex items-center font-bold">
            ▲ {computedMetrics.sensorAktif.change}
          </span>
          <span className="text-zinc-600">{metricsModifier.suffix || 'status normal'}</span>
        </div>
      </div>

      {/* CARD 2: Rata-rata TMA */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)]/80 rounded-xl p-4 flex flex-col justify-between hover:border-zinc-800 transition-colors duration-300 relative group">
        <div className="flex justify-between items-center text-xs font-semibold text-zinc-500 mb-2">
          <div className="flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 text-purple-400" />
            <span>Rata-rata TMA</span>
          </div>
          <button
            onClick={() => onShowToast('Info Tinggi Muka Air rata-rata')}
            className="text-zinc-600 hover:text-zinc-300 transition-colors p-0.5"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-end justify-between my-2">
          <div className="text-3xl font-bold text-white tracking-tight">
            {computedMetrics.avgTMA.value}
          </div>
          <div className="pb-1">
            <Sparkline color="#a855f7" heights={computedMetrics.avgTMA.spark} />
          </div>
        </div>

        <div className="text-[10.5px] flex items-center gap-1 font-medium mt-1">
          <span className="text-zinc-500">TMA meningkat</span>
          <span className="text-rose-500 flex items-center font-bold">
            ▲ {computedMetrics.avgTMA.change}
          </span>
          <span className="text-zinc-600">{metricsModifier.suffix || 'vs 1 jam lalu'}</span>
        </div>
      </div>

      {/* CARD 3: Curah Hujan */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)]/80 rounded-xl p-4 flex flex-col justify-between hover:border-zinc-800 transition-colors duration-300 relative group">
        <div className="flex justify-between items-center text-xs font-semibold text-zinc-500 mb-2">
          <div className="flex items-center gap-1.5">
            <CloudRain className="w-3.5 h-3.5 text-amber-500" />
            <span>Curah Hujan</span>
          </div>
          <button
            onClick={() => onShowToast('Info curah hujan BMKG')}
            className="text-zinc-600 hover:text-zinc-300 transition-colors p-0.5"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-end justify-between my-2">
          <div className="text-3xl font-bold text-white tracking-tight">
            {computedMetrics.curahHujan.value}
          </div>
          <div className="pb-1">
            <Sparkline color="#f97316" heights={computedMetrics.curahHujan.spark} />
          </div>
        </div>

        <div className="text-[10.5px] flex items-center gap-1 font-medium mt-1">
          <span className="text-zinc-500">Intensitas meningkat</span>
          <span className="text-rose-500 flex items-center font-bold">
            ▲ {computedMetrics.curahHujan.change}
          </span>
          <span className="text-zinc-600">{metricsModifier.suffix || 'vs 1 jam lalu'}</span>
        </div>
      </div>

      {/* CARD 4: Alert Aktif */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)]/80 rounded-xl p-4 flex flex-col justify-between hover:border-zinc-800 transition-colors duration-300 relative group">
        <div className="flex justify-between items-center text-xs font-semibold text-zinc-500 mb-2">
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
            <span>Alert Aktif</span>
          </div>
          <button
            onClick={() => onShowToast('Detail alert aktif')}
            className="text-zinc-600 hover:text-zinc-300 transition-colors p-0.5"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-end justify-between my-2">
          <div className="text-3xl font-bold text-white tracking-tight">
            {computedMetrics.alertAktif.value}
          </div>
          <div className="pb-1">
            <Sparkline color="#ef4444" heights={computedMetrics.alertAktif.spark} />
          </div>
        </div>

        <div className="text-[10.5px] flex items-center gap-1 font-medium mt-1">
          <span className="text-zinc-500">Peringatan banjir</span>
          <span className="text-rose-500 flex items-center font-bold">
            ▲ {computedMetrics.alertAktif.change}
          </span>
          <span className="text-zinc-600">{metricsModifier.suffix || 'perlu tindakan'}</span>
        </div>
      </div>

    </div>
  )
}
