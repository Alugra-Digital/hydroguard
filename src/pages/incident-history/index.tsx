import { useState, useMemo } from 'react'
import { FileText, Users, Calendar } from 'lucide-react'
import { kecamatanList, incidentsData, incidentsByMonth } from '../../mock/incidentHistory'
import PageKpiCard from '../../components/PageKpiCard'

// ── Types ────────────────────────────────────────────────────
type Incident = typeof incidentsData[number]

// ── Style helpers ─────────────────────────────────────────────
const LEVEL_BADGE: Record<string, string> = {
  siaga1: 'bg-rose-950/50 border-rose-900/50 text-rose-400',
  siaga2: 'bg-amber-950/50 border-amber-900/50 text-amber-400',
  siaga3: 'bg-sky-950/50 border-sky-900/50 text-sky-400',
}

const LEVEL_LABEL: Record<string, string> = {
  siaga1: 'Siaga 1',
  siaga2: 'Siaga 2',
  siaga3: 'Siaga 3',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('id-ID', {
    day: '2-digit', month: '2-digit', year: '2-digit',
    hour: '2-digit', minute: '2-digit',
  })
}

// ── Derived KPI values ─────────────────────────────────────────
const totalKejadian = incidentsData.length
const totalTerdampak = incidentsData.reduce((s, i) => s + i.affectedResidents, 0)
const totalDievakuasi = incidentsData.reduce((s, i) => s + i.evacuees, 0)
const bulanTerparah = incidentsByMonth.reduce(
  (best, m) => (m.count > best.count ? m : best),
  incidentsByMonth[0]
)

// ── Bar chart color ─────────────────────────────────────────────
function barFill(count: number): string {
  if (count > 2) return '#ef4444'
  if (count > 1) return '#f59e0b'
  return '#3b82f6'
}

// Max count for chart height scaling
const maxBarCount = Math.max(...incidentsByMonth.map((m) => m.count))

export default function IncidentHistoryPage() {
  const [filterKecamatan, setFilterKecamatan] = useState<string | null>(null)
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Avg depth
  const avgDepth = Math.round(incidentsData.reduce((s, i) => s + i.maxDepth, 0) / incidentsData.length)
  // Avg duration
  const avgDuration = Math.round(incidentsData.reduce((s, i) => s + i.duration, 0) / incidentsData.length)
  // Total casualties
  const totalCasualties = incidentsData.reduce((s, i) => s + i.casualties, 0)
  // Last incident date (most recent)
  const lastIncident = incidentsData.reduce(
    (latest, i) => (new Date(i.date) > new Date(latest.date) ? i : latest),
    incidentsData[0]
  )

  const filteredIncidents = useMemo(() => {
    return incidentsData
      .filter((i) => {
        const matchKec = !filterKecamatan || i.kecamatan === filterKecamatan
        const q = searchQuery.toLowerCase()
        const matchSearch = !q ||
          i.kelurahan.toLowerCase().includes(q) ||
          i.kecamatan.toLowerCase().includes(q) ||
          i.id.toLowerCase().includes(q)
        return matchKec && matchSearch
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [filterKecamatan, searchQuery])

  // Chart dimensions
  const chartW = 600
  const chartH = 100
  const barPad = 2
  const barCount = incidentsByMonth.length
  const barW = Math.floor((chartW - barPad * (barCount + 1)) / barCount)
  const maxBarH = 70
  const labelY = chartH - 2

  return (
    <div className="flex-1 overflow-y-auto px-6 pb-8 space-y-5 pt-5">

      {/* ── ROW 1: KPI ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <PageKpiCard
          icon={<FileText className="w-3.5 h-3.5" />}
          label="Total Kejadian"
          value={incidentsData.length}
          color="#6366f1"
          sub="Banjir tercatat 5 tahun"
        />
        <PageKpiCard
          icon={<Users className="w-3.5 h-3.5" />}
          label="Total Terdampak"
          value={totalTerdampak.toLocaleString()}
          unit="jiwa"
          color="#ef4444"
          sub="Warga terdampak banjir"
        />
        <PageKpiCard
          icon={<Users className="w-3.5 h-3.5" />}
          label="Dievakuasi"
          value={totalDievakuasi.toLocaleString()}
          unit="jiwa"
          color="#3b82f6"
          sub="Warga berhasil dievakuasi"
        />
        <PageKpiCard
          icon={<Calendar className="w-3.5 h-3.5" />}
          label="Bulan Terparah"
          value={bulanTerparah.month}
          color="#f59e0b"
          sub={`Max ${bulanTerparah.count} kejadian`}
        />
      </div>

      {/* ── ROW 2: 12-col grid ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* LEFT (8): Bar chart SVG */}
        <div className="lg:col-span-8">
          <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)]/80 rounded-xl p-5 h-full">
            <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">Frekuensi per Bulan</h2>
            <div className="overflow-x-auto">
              <svg
                viewBox={`0 0 ${chartW} ${chartH}`}
                className="w-full"
                style={{ minWidth: '320px' }}
                aria-label="Frekuensi insiden per bulan"
              >
                {incidentsByMonth.map((m, idx) => {
                  const x = barPad + idx * (barW + barPad)
                  const barH = Math.round((m.count / maxBarCount) * maxBarH)
                  const y = maxBarH - barH + 2
                  const fill = barFill(m.count)
                  const cx = x + barW / 2
                  return (
                    <g key={m.month}>
                      <rect
                        x={x}
                        y={y}
                        width={barW}
                        height={barH}
                        rx={3}
                        fill={fill}
                        opacity={0.85}
                      />
                      {/* Count label above bar */}
                      {m.count > 0 && (
                        <text
                          x={cx}
                          y={y - 2}
                          textAnchor="middle"
                          fontSize="7"
                          fill={fill}
                          fontWeight="700"
                        >
                          {m.count}
                        </text>
                      )}
                      {/* Month label below */}
                      <text
                        x={cx}
                        y={labelY}
                        textAnchor="middle"
                        fontSize="7"
                        fill="#52525b"
                      >
                        {m.month}
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>
            {/* Legend */}
            <div className="flex items-center gap-4 mt-3 text-[10.5px] text-zinc-600">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" />
                <span>&gt;2 kejadian</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
                <span>&gt;1 kejadian</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-500" />
                <span>1 kejadian</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT (4): Summary stats */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Statistik Ringkasan</div>

          <div className="bg-[var(--bg-inner)] rounded-xl p-3 flex items-center justify-between">
            <span className="text-[10.5px] text-zinc-500">Rata-rata Kedalaman</span>
            <span className="text-[10.5px] font-bold text-zinc-200">{avgDepth} cm</span>
          </div>

          <div className="bg-[var(--bg-inner)] rounded-xl p-3 flex items-center justify-between">
            <span className="text-[10.5px] text-zinc-500">Rata-rata Durasi</span>
            <span className="text-[10.5px] font-bold text-zinc-200">{avgDuration} jam</span>
          </div>

          <div className="bg-[var(--bg-inner)] rounded-xl p-3 flex items-center justify-between">
            <span className="text-[10.5px] text-zinc-500">Total Korban</span>
            <span className={`text-[10.5px] font-bold ${totalCasualties > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {totalCasualties} jiwa
            </span>
          </div>

          <div className="bg-[var(--bg-inner)] rounded-xl p-3 flex items-center justify-between">
            <span className="text-[10.5px] text-zinc-500">Insiden Terakhir</span>
            <span className="text-[10.5px] font-mono text-zinc-300 font-bold">{formatDate(lastIncident.date)}</span>
          </div>

          <div className="bg-[var(--bg-inner)] rounded-xl p-3">
            <div className="text-[10.5px] text-zinc-600 mb-2 font-bold uppercase tracking-wider">Kelurahan Paling Terdampak</div>
            {Array.from(
              incidentsData.reduce((map, i) => {
                map.set(i.kelurahan, (map.get(i.kelurahan) ?? 0) + 1)
                return map
              }, new Map<string, number>())
            )
              .sort((a, b) => b[1] - a[1])
              .slice(0, 3)
              .map(([kel, count]) => (
                <div key={kel} className="flex items-center justify-between mb-1 last:mb-0">
                  <span className="text-[10.5px] text-zinc-400 truncate">{kel}</span>
                  <span className="text-[10.5px] font-bold text-zinc-300 ml-2 flex-shrink-0">{count}x</span>
                </div>
              ))}
          </div>
        </div>

      </div>

      {/* ── ROW 3: Incident List ─────────────────────────────── */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)]/80 rounded-xl overflow-hidden">

        {/* Filter bar */}
        <div className="px-5 py-3.5 border-b border-[var(--border-main)] flex flex-wrap items-center gap-3">
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

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kelurahan, kecamatan, ID..."
            className="bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-md px-2.5 py-1.5 text-[10.5px] text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 w-56"
          />

          <span className="text-[10.5px] text-zinc-600 ml-auto">{filteredIncidents.length} insiden</span>
        </div>

        {/* List */}
        <div className="p-4 space-y-3">
          {filteredIncidents.length === 0 ? (
            <div className="py-8 text-center text-[10.5px] text-zinc-600">Tidak ada insiden yang sesuai filter</div>
          ) : (
            filteredIncidents.map((inc) => {
              const isExpanded = selectedIncident?.id === inc.id
              return (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncident(isExpanded ? null : inc)}
                  className={`bg-[var(--bg-card)] border rounded-xl p-4 cursor-pointer transition-all ${
                    isExpanded
                      ? 'border-zinc-600'
                      : 'border-[var(--border-subtle)]/80 hover:border-zinc-700'
                  }`}
                >
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div>
                      <div className="text-[10.5px] font-mono text-zinc-600 mb-0.5">{formatDate(inc.date)}</div>
                      <div className="text-[10.5px] font-bold text-zinc-200">{inc.kelurahan}</div>
                      <div className="text-[10.5px] text-zinc-500">{inc.kecamatan}</div>
                    </div>
                    <span className={`inline-flex px-1.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wider rounded border flex-shrink-0 ${LEVEL_BADGE[inc.level] ?? ''}`}>
                      {LEVEL_LABEL[inc.level] ?? inc.level}
                    </span>
                  </div>

                  {/* Stats row */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1">
                      <span className="text-[10.5px] text-zinc-600">Kedalaman:</span>
                      <span className="text-[10.5px] font-bold text-zinc-300">{inc.maxDepth} cm</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10.5px] text-zinc-600">Durasi:</span>
                      <span className="text-[10.5px] font-bold text-zinc-300">{inc.duration} jam</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10.5px] text-zinc-600">Terdampak:</span>
                      <span className="text-[10.5px] font-bold text-zinc-300">{inc.affectedResidents.toLocaleString('id-ID')} jiwa</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10.5px] text-zinc-600">Evakuasi:</span>
                      <span className="text-[10.5px] font-bold text-zinc-300">{inc.evacuees.toLocaleString('id-ID')}</span>
                    </div>
                  </div>

                  {/* Expanded: chronology + actions */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-[var(--border-main)] space-y-4" onClick={(e) => e.stopPropagation()}>
                      {/* Chronology */}
                      <div>
                        <div className="text-[10.5px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Kronologi</div>
                        <div className="space-y-1.5">
                          {inc.chronology.map((c, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <span className="text-[10.5px] font-mono text-zinc-600 w-10 flex-shrink-0">{c.time}</span>
                              <span className="text-[10.5px] text-zinc-400">{c.event}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div>
                        <div className="text-[10.5px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Tindakan</div>
                        <div className="flex flex-wrap gap-2">
                          {inc.actions.map((action, i) => (
                            <span
                              key={i}
                              className="inline-flex px-2 py-1 text-[10.5px] rounded bg-zinc-900/50 border border-[var(--border-subtle)] text-zinc-400"
                            >
                              {action}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>

    </div>
  )
}
