import { Activity, Wifi, BatteryLow, MoreHorizontal, Zap } from 'lucide-react'
import { SENSOR_LIST, DASHBOARD_STATS } from '../data'
import { useIsDark, adaptColor } from '../../../utils/themeColor'

interface SensorStatusCardProps {
  onShowToast: (msg: string) => void
}

const TYPE_LABEL: Record<string, string> = {
  water_level: 'TMA',
  rain_gauge:  'Hujan',
  combined:    'Kombinasi',
}

const STATUS_COLOR: Record<string, string> = {
  siaga1:  '#ef4444',
  siaga2:  '#f97316',
  siaga3:  '#f59e0b',
  normal:  '#10b981',
  offline: '#94a3b8',
}

const STATUS_BADGE: Record<string, string> = {
  siaga1:  'bg-rose-950/50 border-rose-900/50 text-rose-400',
  siaga2:  'bg-orange-950/50 border-orange-900/50 text-orange-400',
  siaga3:  'bg-amber-950/50 border-amber-900/50 text-amber-400',
  normal:  'bg-emerald-950/50 border-emerald-900/50 text-emerald-400',
  offline: 'bg-zinc-900/50 border-zinc-700/50 text-zinc-500',
}

const STATUS_LABEL: Record<string, string> = {
  siaga1:  'Siaga 1',
  siaga2:  'Siaga 2',
  siaga3:  'Siaga 3',
  normal:  'Normal',
  offline: 'Offline',
}

function getBatteryColor(pct: number): string {
  if (pct >= 70) return '#10b981'
  if (pct >= 30) return '#f59e0b'
  return '#ef4444'
}

function getSignalColor(sig: number): string {
  if (sig >= 4) return '#10b981'
  if (sig >= 2) return '#f59e0b'
  return '#ef4444'
}

export default function SensorStatusCard({ onShowToast }: SensorStatusCardProps) {
  const isDark = useIsDark()
  const ac = (c: string) => adaptColor(c, isDark)
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)]/80 rounded-xl overflow-hidden">

      {/* Header */}
      <div className="px-5 py-4 border-b border-[var(--border-main)] flex justify-between items-center select-none">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-zinc-400" />
          <h2 className="text-sm font-bold text-zinc-200">Detail Status Sensor</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10.5px] font-mono text-zinc-600 px-2 py-0.5 rounded bg-[var(--bg-inner)] border border-[var(--border-subtle)]">
            {DASHBOARD_STATS.onlineSensors}/{DASHBOARD_STATS.totalSensors} Online
          </span>
          <button
            onClick={() => onShowToast('Opsi detail status sensor')}
            className="text-zinc-500 hover:text-zinc-300 p-1 transition-colors"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--border-main)] text-[10.5px] font-bold text-zinc-500 uppercase bg-zinc-950/40 select-none">
              <th className="py-3 px-4">Sensor ID</th>
              <th className="py-3 px-4">Nama / Lokasi</th>
              <th className="py-3 px-4">Tipe</th>
              <th className="py-3 px-4">
                <span className="flex items-center gap-1">
                  <Zap className="w-2.5 h-2.5" />
                  Nilai
                </span>
              </th>
              <th className="py-3 px-4">Δ/j</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">
                <span className="flex items-center gap-1">
                  <BatteryLow className="w-2.5 h-2.5" />
                  Baterai
                </span>
              </th>
              <th className="py-3 px-4">
                <span className="flex items-center gap-1">
                  <Wifi className="w-2.5 h-2.5" />
                  Sinyal
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-main)] text-xs font-medium">
            {SENSOR_LIST.map((sensor) => {
              const valueColor = ac(STATUS_COLOR[sensor.status] ?? '#94a3b8')
              const roc = sensor.rateOfChange
              const rocDisplay =
                roc > 0
                  ? `▲ +${roc} ${sensor.unit === 'cm' ? 'cm/j' : 'mm/j'}`
                  : roc < 0
                  ? `▼ ${roc} ${sensor.unit === 'cm' ? 'cm/j' : 'mm/j'}`
                  : '—'
              const rocColor =
                roc > 0 ? 'text-rose-400' : roc < 0 ? 'text-emerald-400' : 'text-zinc-500'
              const battColor = ac(getBatteryColor(sensor.battery))
              const sigColor  = ac(getSignalColor(sensor.signal))

              return (
                <tr
                  key={sensor.id}
                  onClick={() => onShowToast(`Detail sensor ${sensor.id} — ${sensor.name}`)}
                  className={`hover:bg-zinc-900/30 transition-colors cursor-pointer ${!sensor.isOnline ? 'opacity-50' : ''}`}
                >
                  {/* Sensor ID */}
                  <td className="py-2.5 px-4 text-zinc-200 font-semibold font-mono text-xs">
                    {sensor.id}
                  </td>

                  {/* Nama / Lokasi */}
                  <td className="py-2.5 px-4">
                    <div className="max-w-[160px] truncate text-zinc-300 text-xs" title={sensor.name}>
                      {sensor.name}
                    </div>
                    <div className="text-[10.5px] text-zinc-500 font-mono">{sensor.kelurahan}</div>
                  </td>

                  {/* Tipe */}
                  <td className="py-2.5 px-4">
                    <span className="text-[10.5px] px-1.5 py-0.5 rounded font-mono bg-zinc-900/50 text-zinc-400">
                      {TYPE_LABEL[sensor.type] ?? sensor.type}
                    </span>
                  </td>

                  {/* Nilai */}
                  <td className="py-2.5 px-4">
                    <span className="font-bold text-xs" style={{ color: valueColor }}>
                      {sensor.tma} {sensor.unit}
                    </span>
                  </td>

                  {/* Δ/j */}
                  <td className={`py-2.5 px-4 font-mono text-xs ${rocColor}`}>
                    {rocDisplay}
                  </td>

                  {/* Status */}
                  <td className="py-2.5 px-4 select-none">
                    <span
                      className={`inline-flex px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wider rounded border ${STATUS_BADGE[sensor.status] ?? STATUS_BADGE.offline}`}
                    >
                      {STATUS_LABEL[sensor.status] ?? sensor.status}
                    </span>
                  </td>

                  {/* Baterai */}
                  <td className="py-2.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <div className="w-12 h-1 bg-zinc-800 rounded overflow-hidden">
                        <div
                          className="h-full rounded transition-all"
                          style={{ width: `${sensor.battery}%`, backgroundColor: battColor }}
                        />
                      </div>
                      <span className="text-[10.5px] font-mono text-zinc-500">{sensor.battery}%</span>
                    </div>
                  </td>

                  {/* Sinyal */}
                  <td className="py-2.5 px-4">
                    <div className="flex items-end gap-0.5">
                      {Array.from({ length: 5 }, (_, i) => (
                        <div
                          key={i}
                          className="w-1.5 h-2 rounded-sm"
                          style={{
                            backgroundColor:
                              i < sensor.signal ? sigColor : '#27272a',
                          }}
                        />
                      ))}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

    </div>
  )
}
