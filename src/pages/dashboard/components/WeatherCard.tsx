import { Wind, Eye, Thermometer, Droplets, CloudRain, MoreHorizontal } from 'lucide-react'
import { WEATHER_CURRENT, FORECAST_6H } from '../data'

interface WeatherCardProps {
  onShowToast: (msg: string) => void
}

export default function WeatherCard({ onShowToast }: WeatherCardProps) {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)]/80 rounded-xl overflow-hidden">

      {/* Header */}
      <div className="px-5 py-4 border-b border-[var(--border-main)] flex justify-between items-center select-none">
        <div className="flex items-center gap-2">
          <CloudRain className="w-4 h-4 text-zinc-400" />
          <h2 className="text-sm font-bold text-zinc-200">Kondisi Cuaca Saat Ini</h2>
        </div>
        <button
          onClick={() => onShowToast('Detail kondisi cuaca')}
          className="text-zinc-600 hover:text-zinc-300 transition-colors p-0.5"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4">

        {/* 4 metric items */}
        <div className="grid grid-cols-2 gap-3">

          {/* Suhu */}
          <div className="bg-[var(--bg-inner)] rounded-xl p-3 flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5">
              <Thermometer className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-[10.5px] font-medium text-zinc-500">Suhu Udara</span>
            </div>
            <div className="text-lg font-bold text-white">{WEATHER_CURRENT.temperature}°C</div>
          </div>

          {/* Kelembaban */}
          <div className="bg-[var(--bg-inner)] rounded-xl p-3 flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[10.5px] font-medium text-zinc-500">Kelembaban</span>
            </div>
            <div className="text-lg font-bold text-white">{WEATHER_CURRENT.humidity}%</div>
          </div>

          {/* Angin */}
          <div className="bg-[var(--bg-inner)] rounded-xl p-3 flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-zinc-400" />
              <span className="text-[10.5px] font-medium text-zinc-500">Kecepatan Angin</span>
            </div>
            <div className="text-lg font-bold text-white">{WEATHER_CURRENT.windSpeed} km/j {WEATHER_CURRENT.windDir}</div>
          </div>

          {/* Visibilitas */}
          <div className="bg-[var(--bg-inner)] rounded-xl p-3 flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-zinc-400" />
              <span className="text-[10.5px] font-medium text-zinc-500">Visibilitas</span>
            </div>
            <div className="text-lg font-bold text-white">{WEATHER_CURRENT.visibility} km</div>
          </div>
        </div>

        {/* Forecast bar chart */}
        <div>
          <p className="text-[10.5px] font-semibold text-zinc-500 mb-2 uppercase tracking-wide">
            Prakiraan Curah Hujan (6 Jam)
          </p>
          <svg viewBox="0 0 300 60" className="w-full h-[60px]">
            {FORECAST_6H.map((item, i) => {
              const x = 10 + i * 50
              const barHeight = Math.max(2, (item.rainfall / 50) * 50)
              const y = 55 - barHeight
              const fill =
                item.probability > 80 ? '#ef4444' :
                item.probability > 60 ? '#f97316' :
                '#3b82f6'

              return (
                <g key={i}>
                  {/* Bar */}
                  <rect
                    x={x}
                    y={y}
                    width={30}
                    height={barHeight}
                    rx={2}
                    fill={fill}
                    opacity={0.85}
                  />
                  {/* Rainfall label above bar */}
                  <text
                    x={x + 15}
                    y={y - 2}
                    textAnchor="middle"
                    fill="#71717a"
                    fontSize={7}
                    fontFamily="monospace"
                  >
                    {item.rainfall}mm
                  </text>
                  {/* Hour label below bar */}
                  <text
                    x={x + 15}
                    y={55 + 8}
                    textAnchor="middle"
                    fill="#71717a"
                    fontSize={7}
                    fontFamily="monospace"
                  >
                    {item.hour}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[var(--border-main)] px-5 py-2.5 flex justify-between">
        <span className="text-[10.5px] text-zinc-600 font-mono">Sumber: {WEATHER_CURRENT.source}</span>
        <span className="text-[10.5px] text-zinc-600 font-mono">Radar: {WEATHER_CURRENT.radarLabel}</span>
      </div>
    </div>
  )
}
