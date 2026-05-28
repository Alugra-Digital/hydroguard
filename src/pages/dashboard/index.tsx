import { useState, useMemo } from 'react'
import { ChevronDown, AlertTriangle, X } from 'lucide-react'
import KpiCardsAnimated from './components/KpiCardsAnimated'
import FieldStatusCard from './components/FieldStatusCard'
import PredictionTable from './components/PredictionTable'
import EndpointTrafficCard from './components/EndpointTrafficCard'
import GuardrailExceptions from './components/GuardrailExceptions'
import ResourceCard from './components/ResourceCard'
import NewFlowModal from './components/NewFlowModal'
import { DASHBOARD_STATS, TIME_RANGES, BMKG_WARNING } from './data'
import type { ComputedMetrics, ComputedMetricsSecondary } from './types'

interface DashboardPageProps {
  isDark: boolean
  pipelineName: string
  onPipelineNameChange: (name: string) => void
  searchTerm: string
  isNewFlowModalOpen: boolean
  onCloseNewFlowModal: () => void
  showToast: (msg: string) => void
}

export default function DashboardPage({
  isDark,
  pipelineName,
  onPipelineNameChange,
  searchTerm,
  isNewFlowModalOpen,
  onCloseNewFlowModal,
  showToast
}: DashboardPageProps) {
  // Tab and time range state
  const [timeRange, setTimeRange] = useState<string>('Last 24 Hours')
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false)

  // Banner state
  const [showBmkgBanner, setShowBmkgBanner] = useState(true)

  // Metric multipliers based on selected time range
  const metricsModifier = useMemo(() => {
    switch (timeRange) {
      case 'Last 7 Days':
        return { multiplier: 7.2, suffix: ' (7d)' }
      case 'Last 30 Days':
        return { multiplier: 31.5, suffix: ' (30d)' }
      case 'Last Hour':
        return { multiplier: 0.04, suffix: ' (1h)' }
      default:
        return { multiplier: 1.0, suffix: '' }
    }
  }, [timeRange])

  // KPI calculations based on selected time range
  const computedMetrics = useMemo((): ComputedMetrics => {
    const m = metricsModifier.multiplier
    return {
      sensorAktif: {
        value: `${DASHBOARD_STATS.onlineSensors}/${DASHBOARD_STATS.totalSensors}`,
        change: '+1',
        spark: [25, 28, 27, 28, 29, 29],
        trend: 'up',
      },
      avgTMA: {
        value: `${Math.round(DASHBOARD_STATS.avgTMA * (m > 1 ? 1.05 : 1))} cm`,
        change: '+15cm',
        spark: [18, 22, 25, 28, 30, 35],
        trend: 'up',
      },
      curahHujan: {
        value: `${Math.round(DASHBOARD_STATS.rainfall * m)} mm/j`,
        change: '+8mm/j',
        spark: [10, 15, 18, 20, 22, 28],
        trend: 'up',
      },
      alertAktif: {
        value: `${Math.round(DASHBOARD_STATS.totalAlerts * m)}`,
        change: '+1',
        spark: [5, 8, 10, 12, 15, 20],
        trend: 'up',
      },
    }
  }, [metricsModifier])

  const computedMetricsSecondary = useMemo((): ComputedMetricsSecondary => {
    return {
      zonaKritis: {
        value: `${DASHBOARD_STATS.zonaKritis}`,
        change: '3 kelurahan',
        spark: [1, 2, 2, 3, 3, 3],
        trend: 'up',
      },
      zonaTinggi: {
        value: `${DASHBOARD_STATS.zonaTinggi}`,
        change: '4 kelurahan',
        spark: [2, 3, 3, 4, 4, 4],
        trend: 'up',
      },
      suhuUdara: {
        value: `${DASHBOARD_STATS.temperature}°C`,
        change: 'Terasa lembab',
        spark: [28, 27, 28, 28, 28, 28],
        trend: 'neutral',
      },
      kelembaban: {
        value: `${DASHBOARD_STATS.humidity}%`,
        change: '+2%',
        spark: [82, 84, 86, 87, 88, 89],
        trend: 'up',
      },
    }
  }, [])

  const handleNewFlowSubmit = (name: string) => {
    if (name) {
      onPipelineNameChange(name)
      showToast(`Pipeline updated to "${name}" successfully!`)
    }
    onCloseNewFlowModal()
  }

  return (
    <>
      {/* PAGE HEADER */}
      <section className="px-6 py-4 flex items-center justify-between select-none">
        <div className="flex items-center gap-1 bg-[var(--bg-card)] border border-[var(--border-subtle)] p-0.5 rounded-lg">
          <div className="px-3 py-1 text-xs font-medium rounded-md bg-zinc-800 text-white shadow-sm">
            Command Center
          </div>
        </div>

        {/* Time Picker Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsTimeDropdownOpen(!isTimeDropdownOpen)}
            className="h-8 px-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-zinc-700 text-xs font-medium text-zinc-300 flex items-center gap-2 transition-all"
          >
            <span>{timeRange}</span>
            <ChevronDown className="w-3 h-3 text-zinc-500" />
          </button>

          {isTimeDropdownOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setIsTimeDropdownOpen(false)} />
              <div className="absolute right-0 mt-1.5 w-40 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-lg shadow-xl shadow-black/80 py-1.5 z-40 animate-in fade-in slide-in-from-top-2 duration-150">
                {TIME_RANGES.map((range) => (
                  <button
                    key={range}
                    onClick={() => {
                      setTimeRange(range)
                      setIsTimeDropdownOpen(false)
                      showToast(`Metrics range updated: ${range}`)
                    }}
                    className="w-full px-3 py-1.5 text-left text-xs hover:bg-zinc-900 hover:text-white text-zinc-400 transition-colors flex items-center justify-between"
                  >
                    <span>{range}</span>
                    {timeRange === range && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 overflow-y-auto px-6 pb-8 space-y-5">

        {/* COMMAND CENTER CONTENT */}
        <>
            {/* BMKG Warning Banner */}
            {showBmkgBanner && (
              <div className={`border rounded-xl px-5 py-3.5 flex items-start gap-3 ${
                isDark
                  ? 'bg-amber-950/40 border-amber-500/30'
                  : 'bg-amber-50 border-amber-300/60'
              }`}>
                <AlertTriangle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
                <div className="flex-1 min-w-0">
                  <div className={`text-xs font-bold mb-0.5 ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
                    Peringatan Dini BMKG
                  </div>
                  <p className={`text-[11px] leading-relaxed ${isDark ? 'text-amber-300/80' : 'text-amber-800'}`}>
                    {BMKG_WARNING}
                  </p>
                </div>
                <button
                  onClick={() => setShowBmkgBanner(false)}
                  className={`transition-colors flex-shrink-0 ${isDark ? 'text-amber-500 hover:text-amber-300' : 'text-amber-600 hover:text-amber-800'}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* KPI cards — animasi bergantian set A ↔ set B */}
            <KpiCardsAnimated
              metricsA={computedMetrics}
              metricsB={computedMetricsSecondary}
              metricsModifier={metricsModifier}
              onShowToast={showToast}
            />

            {/* 12-col grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* LEFT (7): Sensor flow + Alert + Prediction table */}
              <div className="lg:col-span-7 space-y-5">
                <EndpointTrafficCard isDark={isDark} computedMetrics={computedMetrics} onShowToast={showToast} />
                <GuardrailExceptions searchTerm={searchTerm} onShowToast={showToast} />
                <PredictionTable onShowToast={showToast} />
              </div>

              {/* RIGHT (5): Kecamatan Risk + Weather */}
              <div className="lg:col-span-5 space-y-5">
                <ResourceCard onShowToast={showToast} />
                <FieldStatusCard onShowToast={showToast} isDark={isDark} />
              </div>
            </div>

        </>

      </div>

      {/* MODAL: CREATE NEW FLOW */}
      <NewFlowModal
        isOpen={isNewFlowModalOpen}
        pipelineName={pipelineName}
        onClose={onCloseNewFlowModal}
        onSubmit={handleNewFlowSubmit}
      />

    </>
  )
}
