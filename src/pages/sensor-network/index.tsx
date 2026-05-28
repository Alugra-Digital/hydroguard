import { useMemo, useState } from 'react'
import { Activity, AlertTriangle, Wifi, WifiOff } from 'lucide-react'
import PageKpiCard from '../../components/PageKpiCard'
import { kecamatanList, sensorsData } from '../../mock/sensorNetwork'

type FilterKecamatan = string | null
type FilterType = 'all' | 'water_level' | 'rain_gauge' | 'combined'
type FilterStatus = 'all' | 'siaga1' | 'siaga2' | 'siaga3' | 'normal' | 'offline'
type SensorStatus = 'siaga1' | 'siaga2' | 'siaga3' | 'normal' | 'offline'

const STATUS_ORDER: Record<SensorStatus, number> = {
  siaga1: 0, siaga2: 1, siaga3: 2, normal: 3, offline: 4,
}

const STATUS_STYLE: Record<SensorStatus, string> = {
  siaga1: 'bg-rose-950/50 border-rose-900/50 text-rose-400',
  siaga2: 'bg-amber-950/50 border-amber-900/50 text-amber-400',
  siaga3: 'bg-sky-950/50 border-sky-900/50 text-sky-400',
  normal: 'bg-emerald-950/40 border-emerald-900/40 text-emerald-400',
  offline: 'bg-zinc-900/50 border-zinc-700/50 text-zinc-500',
}

const STATUS_LABEL: Record<SensorStatus, string> = {
  siaga1: 'Siaga 1',
  siaga2: 'Siaga 2',
  siaga3: 'Siaga 3',
  normal: 'Normal',
  offline: 'Offline',
}

const VALUE_COLOR: Record<SensorStatus, string> = {
  siaga1: 'text-rose-400',
  siaga2: 'text-amber-400',
  siaga3: 'text-sky-400',
  normal: 'text-emerald-400',
  offline: 'text-zinc-500',
}

const TYPE_LABEL: Record<string, string> = {
  water_level: 'TMA',
  rain_gauge: 'Hujan',
  combined: 'Kombinasi',
}

const TYPE_STYLE: Record<string, string> = {
  water_level: 'bg-blue-950/50 border-blue-900/50 text-blue-400',
  rain_gauge: 'bg-cyan-950/50 border-cyan-900/50 text-cyan-400',
  combined: 'bg-purple-950/50 border-purple-900/50 text-purple-400',
}

const SIAGA_DOT: Record<SensorStatus, string> = {
  siaga1: 'bg-rose-500',
  siaga2: 'bg-amber-500',
  siaga3: 'bg-sky-400',
  normal: 'bg-emerald-500',
  offline: 'bg-zinc-600',
}

function BatteryBar({ pct }: { pct: number }) {
  const color = pct >= 70 ? 'bg-emerald-500' : pct >= 30 ? 'bg-amber-500' : 'bg-rose-500'
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-14 h-2 bg-zinc-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[10.5px] text-zinc-500 tabular-nums">{pct}%</span>
    </div>
  )
}

function SignalDots({ level }: { level: number }) {
  return (
    <div className="flex items-end gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={`w-1.5 rounded-sm ${i <= level ? 'bg-emerald-400' : 'bg-zinc-700'}`}
          style={{ height: `${4 + i * 2}px` }}
        />
      ))}
    </div>
  )
}

export default function SensorNetworkPage() {
  const [filterKecamatan, setFilterKecamatan] = useState<FilterKecamatan>(null)
  const [filterType, setFilterType] = useState<FilterType>('all')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')

  // KPI counts
  const totalOnline = sensorsData.filter((s) => s.isOnline).length
  const siaga1Count = sensorsData.filter((s) => s.status === 'siaga1').length
  const siaga2Count = sensorsData.filter((s) => s.status === 'siaga2').length
  const siaga3Count = sensorsData.filter((s) => s.status === 'siaga3').length
  const offlineCount = sensorsData.filter((s) => !s.isOnline).length

  const filteredSensors = useMemo(() => {
    return sensorsData
      .filter((s) => {
        const matchKec = !filterKecamatan || s.area === filterKecamatan
        const matchType = filterType === 'all' || s.type === filterType
        const matchStatus = filterStatus === 'all' || s.status === filterStatus
        return matchKec && matchType && matchStatus
      })
      .sort((a, b) => {
        const aOrder = STATUS_ORDER[a.status as SensorStatus] ?? 99
        const bOrder = STATUS_ORDER[b.status as SensorStatus] ?? 99
        return aOrder - bOrder
      })
  }, [filterKecamatan, filterType, filterStatus])

  // Summary by kecamatan
  const kecamatanSummary = useMemo(() => {
    return kecamatanList.map((kec) => {
      const sensors = sensorsData.filter((s) => s.area === kec)
      const statuses = sensors.map((s) => s.status as SensorStatus)
      let highestStatus: SensorStatus = 'normal'
      for (const order of ['siaga1', 'siaga2', 'siaga3'] as SensorStatus[]) {
        if (statuses.includes(order)) { highestStatus = order; break }
      }
      if (sensors.every((s) => s.status === 'offline')) highestStatus = 'offline'
      return { kec, count: sensors.length, highestStatus }
    })
  }, [])

  return (
    <div className="flex-1 overflow-y-auto px-6 pb-8 space-y-5 pt-5">

      {/* PAGE HEADER */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)]/80 rounded-xl p-5">
        <div className="flex items-center gap-2.5 mb-4">
          <Activity className="w-4 h-4 text-blue-400 flex-shrink-0" />
          <div>
            <h1 className="text-sm font-bold text-zinc-200 leading-tight">Sensor Network</h1>
            <p className="text-[10.5px] text-zinc-500">Jaringan Sensor IoT Jaksel</p>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <PageKpiCard
            icon={<Activity className="w-3.5 h-3.5" />}
            label="Total Sensor"
            value={sensorsData.length}
            sub="Sensor terpasang di Jaksel"
            color="#6366f1"
          />
          <PageKpiCard
            icon={<Wifi className="w-3.5 h-3.5" />}
            label="Sensor Online"
            value={totalOnline}
            sub="Aktif & terhubung"
            color="#10b981"
          />
          <PageKpiCard
            icon={<AlertTriangle className="w-3.5 h-3.5" />}
            label="Siaga 1"
            value={siaga1Count}
            sub="TMA kritis"
            color="#ef4444"
          />
          <PageKpiCard
            icon={<Activity className="w-3.5 h-3.5" />}
            label="Siaga 2-3"
            value={siaga2Count + siaga3Count}
            sub="TMA waspada"
            color="#f59e0b"
          />
          <PageKpiCard
            icon={<WifiOff className="w-3.5 h-3.5" />}
            label="Offline"
            value={offlineCount}
            sub="Tidak terhubung"
            color="#71717a"
          />
        </div>
      </div>

      {/* FILTER ROW */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)]/80 rounded-xl px-4 py-3 flex flex-wrap items-center gap-3">
        {/* Kecamatan dropdown */}
        <select
          value={filterKecamatan ?? ''}
          onChange={(e) => setFilterKecamatan(e.target.value || null)}
          className="bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-md px-2.5 py-1.5 text-[10.5px] text-zinc-300 focus:outline-none focus:border-zinc-500"
        >
          <option value="">Semua Kecamatan</option>
          {kecamatanList.map((k) => (
            <option key={k} value={k}>{k}</option>
          ))}
        </select>

        {/* Type chips */}
        <div className="flex items-center gap-1 bg-zinc-950 border border-[var(--border-subtle)] p-0.5 rounded-md text-[10.5px] font-medium">
          {(['all', 'water_level', 'rain_gauge', 'combined'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-1.5 py-0.5 rounded transition-all ${
                filterType === t ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {t === 'all' ? 'Semua' : TYPE_LABEL[t]}
            </button>
          ))}
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-1 bg-zinc-950 border border-[var(--border-subtle)] p-0.5 rounded-md text-[10.5px] font-medium">
          {(['all', 'siaga1', 'siaga2', 'siaga3', 'normal', 'offline'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-1.5 py-0.5 rounded transition-all ${
                filterStatus === s ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {s === 'all' ? 'Semua' : STATUS_LABEL[s as SensorStatus]}
            </button>
          ))}
        </div>

        <span className="text-[10.5px] text-zinc-600 ml-auto">{filteredSensors.length} sensor</span>
      </div>

      {/* SENSOR TABLE */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)]/80 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-main)] text-[10.5px] font-bold text-zinc-500 uppercase bg-zinc-950/40 select-none">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Nama</th>
                <th className="py-3 px-4">Area / Kelurahan</th>
                <th className="py-3 px-4">Tipe</th>
                <th className="py-3 px-4 text-right">Nilai</th>
                <th className="py-3 px-4 text-right">Δ/j</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Baterai</th>
                <th className="py-3 px-4">Sinyal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-main)] text-xs font-medium">
              {filteredSensors.length > 0 ? filteredSensors.map((sensor) => {
                const st = sensor.status as SensorStatus
                return (
                  <tr
                    key={sensor.id}
                    className={`hover:bg-zinc-900/30 transition-colors ${
                      st === 'offline' ? 'opacity-50' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-mono text-[10.5px] text-zinc-400">{sensor.id}</td>
                    <td className="py-3 px-4 text-zinc-200 font-semibold text-[10.5px] max-w-[160px] truncate" title={sensor.name}>
                      {sensor.name}
                    </td>
                    <td className="py-3 px-4 text-[10.5px]">
                      <div className="text-zinc-300">{sensor.area}</div>
                      <div className="text-zinc-600">{sensor.kelurahan}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wider rounded border ${TYPE_STYLE[sensor.type]}`}>
                        {TYPE_LABEL[sensor.type]}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`font-bold tabular-nums text-[10.5px] ${VALUE_COLOR[st]}`}>
                        {sensor.currentValue} {sensor.unit}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {sensor.rateOfChange !== 0 ? (
                        <span className={`text-[10.5px] font-medium tabular-nums ${
                          sensor.rateOfChange > 0 ? 'text-rose-400' : 'text-emerald-400'
                        }`}>
                          {sensor.rateOfChange > 0 ? '+' : ''}{sensor.rateOfChange}
                        </span>
                      ) : (
                        <span className="text-[10.5px] text-zinc-600">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wider rounded border ${STATUS_STYLE[st]}`}>
                        {STATUS_LABEL[st]}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <BatteryBar pct={sensor.battery} />
                    </td>
                    <td className="py-3 px-4">
                      <SignalDots level={sensor.signal} />
                    </td>
                  </tr>
                )
              }) : (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-zinc-500 text-xs select-none">
                    Tidak ada sensor yang sesuai filter
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SUMMARY BY KECAMATAN */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)]/80 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="w-3.5 h-3.5 text-zinc-500" />
          <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Ringkasan per Kecamatan</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {kecamatanSummary.map(({ kec, count, highestStatus }) => (
            <div key={kec} className="bg-[var(--bg-inner)] rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${SIAGA_DOT[highestStatus]}`} />
                <span className="text-[10.5px] font-semibold text-zinc-300 leading-tight truncate">{kec}</span>
              </div>
              <div className="text-lg font-bold text-zinc-200">{count}</div>
              <div className="text-[10.5px] text-zinc-600">sensor</div>
              <div className={`text-[10.5px] font-medium mt-1 ${VALUE_COLOR[highestStatus]}`}>
                {STATUS_LABEL[highestStatus]}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
