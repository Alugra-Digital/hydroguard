import { useState, useMemo } from 'react'
import { MapPin, Brain, TrendingUp, MoreHorizontal, ChevronRight, ChevronLeft } from 'lucide-react'
import { riskLevelMeta, driverLabel, predictionsData } from '../../mock/predictionAnalysis'
import PageKpiCard from '../../components/PageKpiCard'
import { useIsDark, adaptColor } from '../../utils/themeColor'

type RiskLevel = keyof typeof riskLevelMeta
type SortBy    = 'riskScore' | 'prob1h' | 'prob6h'

// ── Color helpers ─────────────────────────────────────────
const RISK_COLOR: Record<string, string> = {
  critical: '#ef4444', high: '#f97316', medium: '#f59e0b', low: '#10b981',
}
const RISK_LABEL: Record<string, string> = {
  critical: 'Kritis', high: 'Tinggi', medium: 'Sedang', low: 'Rendah',
}
const DRIVER_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  kombinasi:    { bg: '#7c3aed18', text: '#a78bfa', label: 'Kombinasi' },
  curah_hujan:  { bg: '#1d4ed818', text: '#60a5fa', label: 'Curah Hujan' },
  backwater:    { bg: '#c2410c18', text: '#fb923c', label: 'Backwater' },
  pasang_surut: { bg: '#0e7490' + '18', text: '#22d3ee', label: 'Pasang Surut (Rob)' },
}
function probColor(p: number) { return p > 80 ? '#ef4444' : p > 60 ? '#f59e0b' : '#10b981' }

// ── SVG: Risk Ring Gauge ──────────────────────────────────
function RiskRing({ score, color, size = 72 }: { score: number; color: string; size?: number }) {
  const r = size * 0.38, cx = size / 2, cy = size / 2
  const circ = 2 * Math.PI * r
  const dash  = (score / 100) * circ
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="flex-shrink-0">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="5"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`} />
      <text x={cx} y={cy - 3} textAnchor="middle" dominantBaseline="middle"
        fill={color} fontSize={size * 0.2} fontWeight="700" fontFamily="monospace">{score}</text>
      <text x={cx} y={cy + size * 0.16} textAnchor="middle"
        fill="rgba(255,255,255,0.35)" fontSize={size * 0.1} fontFamily="sans-serif">/ 100</text>
    </svg>
  )
}

// ── SVG: Mini 3-bar forecast chart ───────────────────────
function ForecastMini({ forecast }: { forecast: Record<string, { probability: number; estimatedDepth: number; confidence: number }> }) {
  const keys = ['1h', '3h', '6h'] as const
  return (
    <svg width="54" height="24" viewBox="0 0 54 24" className="flex-shrink-0">
      {keys.map((k, i) => {
        const h = Math.max(3, (forecast[k].probability / 100) * 20)
        const c = probColor(forecast[k].probability)
        return <rect key={k} x={i * 20} y={22 - h} width={14} height={h} rx={2} fill={c} opacity="0.85" />
      })}
    </svg>
  )
}

// ── Derived ───────────────────────────────────────────────
const criticalCount = predictionsData.filter(p => p.riskLevel === 'critical').length
const highCount     = predictionsData.filter(p => p.riskLevel === 'high').length
const avgConf1h     = Math.round(predictionsData.reduce((s, p) => s + p.forecast['1h'].confidence, 0) / predictionsData.length)
const avgProb1h     = Math.round(predictionsData.reduce((s, p) => s + p.forecast['1h'].probability, 0) / predictionsData.length)

const DRIVER_CHIPS = [
  { key: null,         label: 'Semua' },
  { key: 'curah_hujan', label: 'Curah Hujan' },
  { key: 'backwater',   label: 'Backwater' },
  { key: 'kombinasi',   label: 'Kombinasi' },
]

export default function PredictionAnalysisPage() {
  const isDark = useIsDark()
  const ac = (c: string) => adaptColor(c, isDark)

  const [sortBy,       setSortBy]       = useState<SortBy>('riskScore')
  const [filterDriver, setFilterDriver] = useState<string | null>(null)
  const [heroPage,     setHeroPage]     = useState(1)
  const HERO_PER_PAGE = 6

  const filtered = useMemo(() => {
    let d = [...predictionsData]
    if (filterDriver) d = d.filter(p => p.primaryDriver === filterDriver)
    d.sort((a, b) =>
      sortBy === 'riskScore' ? b.riskScore - a.riskScore :
      sortBy === 'prob1h'    ? b.forecast['1h'].probability - a.forecast['1h'].probability :
                               b.forecast['6h'].probability - a.forecast['6h'].probability
    )
    return d
  }, [sortBy, filterDriver])

  // Kelurahan kritis + tinggi untuk hero section
  const heroItems = useMemo(() =>
    [...predictionsData]
      .filter(p => p.riskLevel === 'critical' || p.riskLevel === 'high')
      .sort((a, b) => b.riskScore - a.riskScore)
  , [])

  // Driver distribution
  const driverDist = useMemo(() => {
    const counts: Record<string, number> = {}
    predictionsData.forEach(p => { counts[p.primaryDriver] = (counts[p.primaryDriver] || 0) + 1 })
    return Object.entries(counts).sort((a, b) => b[1] - a[1])
  }, [])

  // Risk level distribution
  const riskDist = useMemo(() => {
    const order = ['critical', 'high', 'medium', 'low']
    return order.map(lvl => ({
      lvl, count: predictionsData.filter(p => p.riskLevel === lvl).length
    })).filter(r => r.count > 0)
  }, [])

  // Top 4 for forecast escalation section
  const top4 = useMemo(() =>
    [...predictionsData].sort((a, b) => b.riskScore - a.riskScore).slice(0, 4)
  , [])

  return (
    <div className="flex-1 overflow-y-auto px-6 pb-8 space-y-5 pt-5">

      {/* ══ ROW 1: KPI ══ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <PageKpiCard icon={<MapPin className="w-3.5 h-3.5" />} label="Zona Kritis"
          value={criticalCount} color="#ef4444" sub="Kelurahan level kritis" />
        <PageKpiCard icon={<MapPin className="w-3.5 h-3.5" />} label="Zona Tinggi"
          value={highCount} color="#f97316" sub="Kelurahan risiko tinggi" />
        <PageKpiCard icon={<Brain className="w-3.5 h-3.5" />} label="Avg Prob 1j"
          value={`${avgProb1h}%`} color="#3b82f6" sub="Rata-rata probabilitas banjir" />
        <PageKpiCard icon={<Brain className="w-3.5 h-3.5" />} label="Avg Confidence"
          value={`${avgConf1h}%`} color="#10b981" sub="Keyakinan model prediksi" />
      </div>

      {/* ══ ROW 2: Hero Cards + Distribution ══ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* LEFT 8: Zona Kritis & Tinggi — card with ring gauge */}
        <div className="lg:col-span-8 bg-[var(--bg-card)] border border-[var(--border-subtle)]/80 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--border-main)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-rose-400" />
              <h2 className="text-sm font-bold text-zinc-200">Zona Kritis & Tinggi</h2>
              <span className="text-[10.5px] text-zinc-500 font-mono bg-[var(--bg-inner)] px-2 py-0.5 rounded border border-[var(--border-subtle)]">
                {heroItems.length} kelurahan
              </span>
            </div>
            <button className="text-zinc-600 hover:text-zinc-300 p-1"><MoreHorizontal className="w-4 h-4" /></button>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            {heroItems.slice((heroPage - 1) * HERO_PER_PAGE, heroPage * HERO_PER_PAGE).map(p => {
              const color = RISK_COLOR[p.riskLevel]
              const driver = DRIVER_STYLE[p.primaryDriver]
              return (
                <div key={p.kelurahanId}
                  className="bg-[var(--bg-inner)] rounded-xl p-4 flex items-start gap-4 border transition-all hover:border-zinc-700"
                  style={{ borderColor: ac(color) + "30" }}>
                  {/* Ring gauge */}
                  <RiskRing score={p.riskScore} color={color} size={68} />
                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div>
                      <div className="text-[10.5px] font-bold text-zinc-200 truncate">{p.kelurahan}</div>
                      <div className="text-[10.5px] text-zinc-500">{p.kecamatan}</div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex px-1.5 py-0.5 text-[10.5px] font-bold rounded border"
                        style={{ background: ac(color) + "18", borderColor: ac(color) + "50", color: ac(color) }}>
                        {RISK_LABEL[p.riskLevel]}
                      </span>
                      {driver && (
                        <span className="inline-flex px-1.5 py-0.5 text-[10.5px] font-bold rounded border"
                          style={{ background: driver.bg, borderColor: ac(driver.text) + "40", color: ac(driver.text) }}>
                          {driver.label}
                        </span>
                      )}
                    </div>
                    {/* Mini forecast bars */}
                    <div className="flex items-center gap-2">
                      <ForecastMini forecast={p.forecast as any} />
                      <div className="text-[10.5px] text-zinc-500 space-y-0.5">
                        <div>1j: <span className="font-bold" style={{ color: ac(probColor(p.forecast['1h'].probability)) }}>{p.forecast['1h'].probability}%</span></div>
                        <div>6j: <span className="font-bold" style={{ color: ac(probColor(p.forecast['6h'].probability)) }}>{p.forecast['6h'].probability}%</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          {/* Pagination */}
          {heroItems.length > HERO_PER_PAGE && (
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-[var(--border-main)]">
              <span className="text-[10.5px] text-zinc-500 font-mono">
                {(heroPage - 1) * HERO_PER_PAGE + 1}–{Math.min(heroPage * HERO_PER_PAGE, heroItems.length)} dari {heroItems.length}
              </span>
              <div className="flex items-center gap-1">
                <button onClick={() => setHeroPage(p => p - 1)} disabled={heroPage === 1}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors disabled:opacity-30 disabled:hover:bg-transparent">
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                {Array.from({ length: Math.ceil(heroItems.length / HERO_PER_PAGE) }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setHeroPage(p)}
                    className={`w-7 h-7 rounded-lg text-[10.5px] font-bold transition-colors ${
                      p === heroPage ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40'
                    }`}>{p}</button>
                ))}
                <button onClick={() => setHeroPage(p => p + 1)} disabled={heroPage === Math.ceil(heroItems.length / HERO_PER_PAGE)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors disabled:opacity-30 disabled:hover:bg-transparent">
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT 4: Distribution */}
        <div className="lg:col-span-4 space-y-5">

          {/* Risk Level Distribution */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)]/80 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[var(--border-main)]">
              <h2 className="text-sm font-bold text-zinc-200">Distribusi Level Risiko</h2>
            </div>
            <div className="p-4 space-y-2.5">
              {riskDist.map(({ lvl, count }) => {
                const color = RISK_COLOR[lvl]
                const pct   = (count / predictionsData.length) * 100
                return (
                  <div key={lvl}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                        <span className="text-[10.5px] font-medium text-zinc-300">{RISK_LABEL[lvl]}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10.5px] font-bold" style={{ color }}>{count}</span>
                        <span className="text-[10.5px] text-zinc-600 font-mono w-8 text-right">{Math.round(pct)}%</span>
                      </div>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <div className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, background: ac(color) }} />
                    </div>
                  </div>
                )
              })}
              {/* Stacked mini bar */}
              <div className="flex h-3 rounded-full overflow-hidden mt-1 gap-0.5">
                {riskDist.map(({ lvl, count }) => (
                  <div key={lvl} className="h-full transition-all duration-500"
                    style={{ flex: count, background: RISK_COLOR[lvl] }} />
                ))}
              </div>
            </div>
          </div>

          {/* Driver Distribution */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)]/80 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[var(--border-main)]">
              <h2 className="text-sm font-bold text-zinc-200">Driver Banjir</h2>
            </div>
            <div className="p-4 space-y-3">
              {driverDist.map(([driver, count]) => {
                const s   = DRIVER_STYLE[driver]
                const pct = (count / predictionsData.length) * 100
                return (
                  <div key={driver} className="bg-[var(--bg-inner)] rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10.5px] font-bold" style={{ color: ac(s?.text ?? "#94a3b8") }}>
                        {s?.label ?? driver}
                      </span>
                      <span className="text-[10.5px] font-bold text-zinc-300">{count} kel · {Math.round(pct)}%</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <div className="h-full rounded-full"
                        style={{ width: `${pct}%`, background: s?.text ?? '#94a3b8' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ══ ROW 3: Compact Prediction Table ══ */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)]/80 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--border-main)] flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold text-zinc-200">Semua Prediksi Kelurahan</h2>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <select value={sortBy} onChange={e => setSortBy(e.target.value as SortBy)}
              className="bg-[var(--bg-inner)] border border-[var(--border-subtle)] rounded-lg px-2.5 py-1 text-[10.5px] text-zinc-300 focus:outline-none focus:border-zinc-500">
              <option value="riskScore">↓ Risk Score</option>
              <option value="prob1h">↓ Prob 1j</option>
              <option value="prob6h">↓ Prob 6j</option>
            </select>
            <div className="flex items-center gap-1 bg-zinc-950 border border-[var(--border-subtle)] p-0.5 rounded-lg">
              {DRIVER_CHIPS.map(c => (
                <button key={String(c.key)} onClick={() => setFilterDriver(c.key)}
                  className={`px-2.5 py-1 rounded-md text-[10.5px] font-medium transition-all ${
                    filterDriver === c.key ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
                  }`}>
                  {c.label}
                </button>
              ))}
            </div>
            <span className="text-[10.5px] text-zinc-600 font-mono">{filtered.length} kelurahan</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-main)] bg-zinc-950/40 select-none">
                {['Kelurahan', 'Kecamatan', 'Risk', 'Score', 'Forecast (1j/3j/6j)', '1j Prob', '6j Prob', 'Driver'].map(h => (
                  <th key={h} className="py-3 px-4 text-[10.5px] font-bold text-zinc-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-main)]">
              {filtered.map(p => {
                const color = RISK_COLOR[p.riskLevel]
                const driver = DRIVER_STYLE[p.primaryDriver]
                return (
                  <tr key={p.kelurahanId} className="hover:bg-zinc-900/30 transition-colors">
                    <td className="py-3 px-4 text-[10.5px] font-bold text-zinc-200">{p.kelurahan}</td>
                    <td className="py-3 px-4 text-[10.5px] text-zinc-500 font-mono">{p.kecamatan}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex px-2 py-0.5 text-[10.5px] font-bold rounded border"
                        style={{ background: ac(color) + "18", borderColor: ac(color) + "50", color: ac(color) }}>
                        {RISK_LABEL[p.riskLevel]}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10.5px] font-bold font-mono" style={{ color }}>{p.riskScore}</span>
                        <div className="w-10 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                          <div className="h-full rounded-full" style={{ width: `${p.riskScore}%`, background: color }} />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <ForecastMini forecast={p.forecast as any} />
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[10.5px] font-bold font-mono" style={{ color: ac(probColor(p.forecast['1h'].probability)) }}>
                        {p.forecast['1h'].probability}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[10.5px] font-bold font-mono" style={{ color: ac(probColor(p.forecast['6h'].probability)) }}>
                        {p.forecast['6h'].probability}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {driver && (
                        <span className="inline-flex px-1.5 py-0.5 text-[10.5px] font-bold rounded border"
                          style={{ background: driver.bg, borderColor: ac(driver.text) + "40", color: ac(driver.text) }}>
                          {driver.label}
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ══ ROW 4: Forecast Escalation — top 4 ══ */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)]/80 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--border-main)] flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-bold text-zinc-200">Eskalasi Risiko — Top 4 Kelurahan</h2>
          <span className="text-[10.5px] text-zinc-500 ml-2">Proyeksi 1j → 3j → 6j ke depan</span>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {top4.map(p => {
            const color = RISK_COLOR[p.riskLevel]
            const stages = [
              { label: '1 Jam',  key: '1h' as const },
              { label: '3 Jam',  key: '3h' as const },
              { label: '6 Jam',  key: '6h' as const },
            ]
            return (
              <div key={p.kelurahanId} className="bg-[var(--bg-inner)] rounded-xl p-4 border" style={{ borderColor: ac(color) + "25" }}>
                {/* Card header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-[10.5px] font-bold text-zinc-200">{p.kelurahan}</div>
                    <div className="text-[10.5px] text-zinc-500">{p.kecamatan}</div>
                  </div>
                  <span className="inline-flex px-2 py-0.5 text-[10.5px] font-bold rounded border"
                    style={{ background: ac(color) + "18", borderColor: ac(color) + "50", color: ac(color) }}>
                    Score {p.riskScore}
                  </span>
                </div>
                {/* 3-stage escalation */}
                <div className="flex items-stretch gap-2">
                  {stages.map((s, i) => {
                    const fc    = p.forecast[s.key]
                    const pc    = probColor(fc.probability)
                    const isLast = i === stages.length - 1
                    return (
                      <>
                        <div key={s.key} className="flex-1 bg-[var(--bg-card)] rounded-xl p-3 text-center">
                          <div className="text-[10.5px] text-zinc-500 mb-2 font-medium">{s.label}</div>
                          <div className="text-lg font-bold font-mono mb-1" style={{ color: pc }}>
                            {fc.probability}%
                          </div>
                          <div className="h-1.5 rounded-full overflow-hidden mb-1.5" style={{ background: 'rgba(255,255,255,0.06)' }}>
                            <div className="h-full rounded-full" style={{ width: `${fc.probability}%`, background: pc }} />
                          </div>
                          <div className="text-[10.5px] text-zinc-500 font-mono">~{fc.estimatedDepth}cm</div>
                          <div className="text-[10.5px] text-zinc-600 font-mono">{fc.confidence}% conf</div>
                        </div>
                        {!isLast && (
                          <div className="flex items-center flex-shrink-0">
                            <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
                          </div>
                        )}
                      </>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}
