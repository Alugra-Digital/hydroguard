import { useState, useEffect } from 'react'
import {
  Activity, Gauge, CloudRain, AlertTriangle,
  MapPin, Map, Thermometer, Droplets, MoreHorizontal,
} from 'lucide-react'
import type { ComputedMetrics, ComputedMetricsSecondary } from '../types'
import Sparkline from './Sparkline'

interface KpiCardsAnimatedProps {
  metricsA:         ComputedMetrics
  metricsB:         ComputedMetricsSecondary
  metricsModifier:  { multiplier: number; suffix: string }
  onShowToast:      (msg: string) => void
}

// ── Timing ────────────────────────────────────────────────
const STAGGER      = 110   // ms between cards (right → left)
const EXIT_DUR     = 220   // ms per card exit animation
const ENTER_DUR    = 260   // ms per card enter animation
const SHOW_AFTER   = EXIT_DUR + STAGGER * 3 + 60  // when to switch content
const IDLE_AFTER   = SHOW_AFTER + ENTER_DUR + STAGGER * 3 + 80
const CYCLE_MS     = 4800  // how long each set is displayed

type Phase = 'idle' | 'exit' | 'enter'

export default function KpiCardsAnimated({
  metricsA, metricsB, metricsModifier, onShowToast,
}: KpiCardsAnimatedProps) {
  const [showB, setShowB] = useState(false)
  const [phase, setPhase]  = useState<Phase>('idle')

  useEffect(() => {
    const cycle = setInterval(() => {
      // 1. exit cascade (right → left)
      setPhase('exit')

      // 2. switch data + enter cascade
      const t2 = setTimeout(() => {
        setShowB(prev => !prev)
        setPhase('enter')
      }, SHOW_AFTER)

      // 3. back to idle
      const t3 = setTimeout(() => setPhase('idle'), IDLE_AFTER)

      return () => { clearTimeout(t2); clearTimeout(t3) }
    }, CYCLE_MS)

    return () => clearInterval(cycle)
  }, [])

  // Card-level animation style — stagger from RIGHT (i=3) to LEFT (i=0)
  const style = (i: number): React.CSSProperties => {
    const delay = `${(3 - i) * STAGGER}ms`
    if (phase === 'exit')
      return { animation: `kpi-exit ${EXIT_DUR}ms ease-in ${delay} forwards` }
    if (phase === 'enter')
      return { animation: `kpi-enter ${ENTER_DUR}ms ease-out ${delay} both` }
    return {}
  }

  const m = metricsModifier.suffix

  // ── Set A ─────────────────────────────────────────────
  const setA = [
    {
      icon:     <Activity className="w-3.5 h-3.5 text-indigo-400" />,
      title:    'Sensor Aktif',
      value:    metricsA.sensorAktif.value,
      footer:   'Online dari total sensor',
      change:   metricsA.sensorAktif.change,
      trend:    'up' as const,
      spark:    <Sparkline color="#3b82f6" heights={metricsA.sensorAktif.spark} />,
      suffix:   m || 'status normal',
    },
    {
      icon:     <Gauge className="w-3.5 h-3.5 text-purple-400" />,
      title:    'Rata-rata TMA',
      value:    metricsA.avgTMA.value,
      footer:   'TMA meningkat',
      change:   metricsA.avgTMA.change,
      trend:    'up' as const,
      spark:    <Sparkline color="#a855f7" heights={metricsA.avgTMA.spark} />,
      suffix:   m || 'vs 1 jam lalu',
    },
    {
      icon:     <CloudRain className="w-3.5 h-3.5 text-amber-500" />,
      title:    'Curah Hujan',
      value:    metricsA.curahHujan.value,
      footer:   'Intensitas meningkat',
      change:   metricsA.curahHujan.change,
      trend:    'up' as const,
      spark:    <Sparkline color="#f97316" heights={metricsA.curahHujan.spark} />,
      suffix:   m || 'vs 1 jam lalu',
    },
    {
      icon:     <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />,
      title:    'Alert Aktif',
      value:    metricsA.alertAktif.value,
      footer:   'Peringatan banjir',
      change:   metricsA.alertAktif.change,
      trend:    'up' as const,
      spark:    <Sparkline color="#ef4444" heights={metricsA.alertAktif.spark} />,
      suffix:   m || 'perlu tindakan',
    },
  ]

  // ── Set B ─────────────────────────────────────────────
  const setB = [
    {
      icon:     <MapPin className="w-3.5 h-3.5 text-rose-500" />,
      title:    'Zona Kritis',
      value:    metricsB.zonaKritis.value,
      footer:   'Kelurahan status kritis',
      change:   metricsB.zonaKritis.change,
      trend:    'up' as const,
      spark:    <Sparkline color="#ef4444" heights={metricsB.zonaKritis.spark} />,
      suffix:   m || 'terpantau',
    },
    {
      icon:     <Map className="w-3.5 h-3.5 text-orange-400" />,
      title:    'Zona Tinggi',
      value:    metricsB.zonaTinggi.value,
      footer:   'Kelurahan risiko tinggi',
      change:   metricsB.zonaTinggi.change,
      trend:    'up' as const,
      spark:    <Sparkline color="#f97316" heights={metricsB.zonaTinggi.spark} />,
      suffix:   m || 'terpantau',
    },
    {
      icon:     <Thermometer className="w-3.5 h-3.5 text-blue-400" />,
      title:    'Suhu Udara',
      value:    metricsB.suhuUdara.value,
      footer:   'Temperatur udara',
      change:   metricsB.suhuUdara.change,
      trend:    'neutral' as const,
      spark:    <Sparkline color="#3b82f6" heights={metricsB.suhuUdara.spark} />,
      suffix:   m || 'kondisi lembab',
    },
    {
      icon:     <Droplets className="w-3.5 h-3.5 text-cyan-400" />,
      title:    'Kelembaban',
      value:    metricsB.kelembaban.value,
      footer:   'Kelembaban relatif',
      change:   metricsB.kelembaban.change,
      trend:    'up' as const,
      spark:    <Sparkline color="#f59e0b" heights={metricsB.kelembaban.spark} />,
      suffix:   m || 'tinggi',
    },
  ]

  const cards = showB ? setB : setA

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <div
          key={i}
          style={style(i)}
          className="bg-[var(--bg-card)] border border-[var(--border-subtle)]/80 rounded-xl p-4 flex flex-col justify-between hover:border-zinc-800 transition-colors duration-300"
        >
          {/* Header */}
          <div className="flex justify-between items-center text-xs font-semibold text-zinc-500 mb-2">
            <div className="flex items-center gap-1.5">
              {card.icon}
              <span>{card.title}</span>
            </div>
            <button
              onClick={() => onShowToast(`Detail ${card.title}`)}
              className="text-zinc-600 hover:text-zinc-300 transition-colors p-0.5"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Value + Sparkline */}
          <div className="flex items-end justify-between my-2">
            <div className="text-3xl font-bold text-white tracking-tight">
              {card.value}
            </div>
            <div className="pb-1">{card.spark}</div>
          </div>

          {/* Footer */}
          <div className="text-[10.5px] flex items-center gap-1 font-medium mt-1">
            <span className="text-zinc-500">{card.footer}</span>
            <span className={`flex items-center font-bold ${
              card.trend === 'up' ? 'text-emerald-500' : 'text-zinc-400'
            }`}>
              {card.trend === 'up' ? '▲' : '—'} {card.change}
            </span>
            <span className="text-zinc-600">{card.suffix}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
