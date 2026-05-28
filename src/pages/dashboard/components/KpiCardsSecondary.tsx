import { MapPin, Map, Thermometer, Droplets, MoreHorizontal } from 'lucide-react'
import type { ComputedMetricsSecondary } from '../types'
import Sparkline from './Sparkline'

interface KpiCardsSecondaryProps {
  computedMetrics: ComputedMetricsSecondary
  onShowToast: (msg: string) => void
}

export default function KpiCardsSecondary({ computedMetrics, onShowToast }: KpiCardsSecondaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

      {/* CARD 1: Zona Kritis */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)]/80 rounded-xl p-4 flex flex-col justify-between hover:border-zinc-800 transition-colors duration-300 relative group">
        <div className="flex justify-between items-center text-xs font-semibold text-zinc-500 mb-2">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-rose-500" />
            <span>Zona Kritis</span>
          </div>
          <button
            onClick={() => onShowToast('Detail zona kritis')}
            className="text-zinc-600 hover:text-zinc-300 transition-colors p-0.5"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-end justify-between my-2">
          <div className="text-3xl font-bold text-white tracking-tight">
            {computedMetrics.zonaKritis.value}
          </div>
          <div className="pb-1">
            <Sparkline color="#ef4444" heights={computedMetrics.zonaKritis.spark} />
          </div>
        </div>

        <div className="text-[10.5px] flex items-center gap-1 font-medium mt-1">
          <span className="text-zinc-500">Kelurahan status kritis</span>
          <span className="text-rose-500 flex items-center font-bold">
            ▲ {computedMetrics.zonaKritis.change}
          </span>
          <span className="text-zinc-600">perlu evakuasi</span>
        </div>
      </div>

      {/* CARD 2: Zona Tinggi */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)]/80 rounded-xl p-4 flex flex-col justify-between hover:border-zinc-800 transition-colors duration-300 relative group">
        <div className="flex justify-between items-center text-xs font-semibold text-zinc-500 mb-2">
          <div className="flex items-center gap-1.5">
            <Map className="w-3.5 h-3.5 text-orange-400" />
            <span>Zona Tinggi</span>
          </div>
          <button
            onClick={() => onShowToast('Detail zona risiko tinggi')}
            className="text-zinc-600 hover:text-zinc-300 transition-colors p-0.5"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-end justify-between my-2">
          <div className="text-3xl font-bold text-white tracking-tight">
            {computedMetrics.zonaTinggi.value}
          </div>
          <div className="pb-1">
            <Sparkline color="#f97316" heights={computedMetrics.zonaTinggi.spark} />
          </div>
        </div>

        <div className="text-[10.5px] flex items-center gap-1 font-medium mt-1">
          <span className="text-zinc-500">Kelurahan risiko tinggi</span>
          <span className="text-orange-400 flex items-center font-bold">
            ▲ {computedMetrics.zonaTinggi.change}
          </span>
          <span className="text-zinc-600">pantau ketat</span>
        </div>
      </div>

      {/* CARD 3: Suhu Udara */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)]/80 rounded-xl p-4 flex flex-col justify-between hover:border-zinc-800 transition-colors duration-300 relative group">
        <div className="flex justify-between items-center text-xs font-semibold text-zinc-500 mb-2">
          <div className="flex items-center gap-1.5">
            <Thermometer className="w-3.5 h-3.5 text-blue-400" />
            <span>Suhu Udara</span>
          </div>
          <button
            onClick={() => onShowToast('Info suhu udara')}
            className="text-zinc-600 hover:text-zinc-300 transition-colors p-0.5"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-end justify-between my-2">
          <div className="text-3xl font-bold text-white tracking-tight">
            {computedMetrics.suhuUdara.value}
          </div>
          <div className="pb-1">
            <Sparkline color="#3b82f6" heights={computedMetrics.suhuUdara.spark} />
          </div>
        </div>

        <div className="text-[10.5px] flex items-center gap-1 font-medium mt-1">
          <span className="text-zinc-500">Temperatur udara</span>
          <span className="text-zinc-400 flex items-center font-bold">
            — {computedMetrics.suhuUdara.change}
          </span>
          <span className="text-zinc-600">data BMKG</span>
        </div>
      </div>

      {/* CARD 4: Kelembaban */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)]/80 rounded-xl p-4 flex flex-col justify-between hover:border-zinc-800 transition-colors duration-300 relative group">
        <div className="flex justify-between items-center text-xs font-semibold text-zinc-500 mb-2">
          <div className="flex items-center gap-1.5">
            <Droplets className="w-3.5 h-3.5 text-cyan-400" />
            <span>Kelembaban</span>
          </div>
          <button
            onClick={() => onShowToast('Info kelembaban relatif')}
            className="text-zinc-600 hover:text-zinc-300 transition-colors p-0.5"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-end justify-between my-2">
          <div className="text-3xl font-bold text-white tracking-tight">
            {computedMetrics.kelembaban.value}
          </div>
          <div className="pb-1">
            <Sparkline color="#f59e0b" heights={computedMetrics.kelembaban.spark} />
          </div>
        </div>

        <div className="text-[10.5px] flex items-center gap-1 font-medium mt-1">
          <span className="text-zinc-500">Kelembaban relatif</span>
          <span className="text-amber-400 flex items-center font-bold">
            ▲ {computedMetrics.kelembaban.change}
          </span>
          <span className="text-zinc-600">kondisi lembab</span>
        </div>
      </div>

    </div>
  )
}
