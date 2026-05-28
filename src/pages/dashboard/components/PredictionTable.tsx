import { useState, useMemo } from 'react'
import { Brain, MoreHorizontal, SlidersHorizontal } from 'lucide-react'
import type { PredictionItem } from '../types'
import { PREDICTION_LOGS } from '../data'
import PredictionDetailModal from './PredictionDetailModal'

interface PredictionTableProps {
  onShowToast: (msg: string) => void
}

const LEVEL_STYLE: Record<PredictionItem['riskLevel'], string> = {
  critical: 'bg-rose-950/50 border-rose-900/50 text-rose-400',
  high:     'bg-orange-950/50 border-orange-900/50 text-orange-400',
  medium:   'bg-amber-950/50 border-amber-900/50 text-amber-400',
  low:      'bg-emerald-950/50 border-emerald-900/50 text-emerald-400',
}

const LEVEL_LABEL: Record<PredictionItem['riskLevel'], string> = {
  critical: 'Kritis',
  high:     'Tinggi',
  medium:   'Sedang',
  low:      'Rendah',
}

function getRiskScoreColor(score: number): string {
  if (score >= 85) return '#f43f5e'   // rose-500
  if (score >= 70) return '#fb923c'   // orange-400
  if (score >= 50) return '#fbbf24'   // amber-400
  return '#34d399'                     // emerald-400
}

function getRiskScoreTextClass(score: number): string {
  if (score >= 85) return 'text-rose-400'
  if (score >= 70) return 'text-orange-400'
  if (score >= 50) return 'text-amber-400'
  return 'text-emerald-400'
}

function getProbTextClass(prob: number): string {
  if (prob > 80) return 'text-rose-400'
  if (prob > 60) return 'text-amber-400'
  return 'text-emerald-400'
}

export default function PredictionTable({ onShowToast }: PredictionTableProps) {
  const [selectedKel, setSelectedKel] = useState<string | null>(null)
  const sorted = useMemo(
    () => [...PREDICTION_LOGS].sort((a, b) => b.riskScore - a.riskScore).slice(0, 5),
    []
  )

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)]/80 rounded-xl overflow-hidden">

      {/* Header */}
      <div className="px-5 py-4 border-b border-[var(--border-main)] flex justify-between items-center select-none">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-indigo-400" />
          <h2 className="text-sm font-bold text-zinc-200">Prediksi Risiko Kelurahan</h2>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onShowToast('Filter prediksi risiko')}
            className="px-2.5 py-1 rounded-md border border-[var(--border-subtle)] hover:border-zinc-700 bg-zinc-900/30 hover:bg-zinc-900 text-[10.5px] font-semibold text-zinc-300 flex items-center gap-1 transition-colors"
          >
            <SlidersHorizontal className="w-2.5 h-2.5" />
            Filter
          </button>
          <button
            onClick={() => onShowToast('Opsi tabel prediksi')}
            className="text-zinc-600 hover:text-zinc-300 transition-colors p-0.5"
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
              <th className="py-3 px-5">Kelurahan</th>
              <th className="py-3 px-4">Kecamatan</th>
              <th className="py-3 px-4">Risk Score</th>
              <th className="py-3 px-4">Level</th>
              <th className="py-3 px-4">Driver</th>
              <th className="py-3 px-4 text-right">Prob 1j</th>
              <th className="py-3 px-4 text-right">Prob 3j</th>
              <th className="py-3 px-5 text-right">Prob 6j</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-main)] text-xs font-medium">
            {sorted.map((item, index) => {
              const scoreColor = getRiskScoreColor(item.riskScore)
              return (
                <tr
                  key={index}
                  onClick={() => setSelectedKel(item.kelurahan)}
                  className="hover:bg-zinc-900/30 transition-colors cursor-pointer"
                >
                  <td className="py-3.5 px-5 text-zinc-200 font-semibold">{item.kelurahan}</td>
                  <td className="py-3.5 px-4 text-zinc-400 font-mono text-[10.5px]">{item.kecamatan}</td>
                  <td className="py-3.5 px-4">
                    <div className={`font-bold ${getRiskScoreTextClass(item.riskScore)}`}>
                      {item.riskScore}
                    </div>
                    <div
                      className="h-1 rounded-full mt-0.5"
                      style={{
                        background: scoreColor,
                        width: `${item.riskScore}%`,
                        maxWidth: '2rem',
                      }}
                    />
                  </td>
                  <td className="py-3.5 px-4 select-none">
                    <span
                      className={`inline-flex px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wider rounded border ${LEVEL_STYLE[item.riskLevel]}`}
                    >
                      {LEVEL_LABEL[item.riskLevel]}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-zinc-400 text-[10.5px]">{item.driver}</td>
                  <td className={`py-3.5 px-4 text-right font-mono font-bold ${getProbTextClass(item.prob1h)}`}>
                    {item.prob1h}%
                  </td>
                  <td className={`py-3.5 px-4 text-right font-mono font-bold ${getProbTextClass(item.prob3h)}`}>
                    {item.prob3h}%
                  </td>
                  <td className={`py-3.5 px-5 text-right font-mono font-bold ${getProbTextClass(item.prob6h)}`}>
                    {item.prob6h}%
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="px-5 py-2 border-t border-[var(--border-main)]">
        <span className="text-[10.5px] text-zinc-600 font-mono">Top 5 dari 12 kelurahan</span>
      </div>

      {selectedKel && (
        <PredictionDetailModal kelurahan={selectedKel} onClose={() => setSelectedKel(null)} />
      )}
    </div>
  )
}
