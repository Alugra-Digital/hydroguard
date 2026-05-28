import { MapPin, Bell, Zap, Users } from 'lucide-react'
import PageKpiCard from '../../components/PageKpiCard'
import {
  riskLevelMeta,
  alertLevelMeta,
  predictionsData,
  incidentsData,
  activeAlertsData,
  pumpsData,
  boatsData,
  sheltersData,
} from '../../mock/executiveView'

// ── Types ────────────────────────────────────────────────────
type RiskLevel = keyof typeof riskLevelMeta
type AlertLevel = keyof typeof alertLevelMeta

// ── Helpers ──────────────────────────────────────────────────
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

function formatDateTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleString('id-ID', {
    day: '2-digit', month: '2-digit', year: '2-digit',
    hour: '2-digit', minute: '2-digit',
  })
}

// ── Style helpers ─────────────────────────────────────────────
const RISK_BADGE: Record<RiskLevel, string> = {
  low:      'bg-emerald-950/50 border-emerald-900/50 text-emerald-400',
  medium:   'bg-amber-950/50 border-amber-900/50 text-amber-400',
  high:     'bg-orange-950/50 border-orange-900/50 text-orange-400',
  critical: 'bg-rose-950/50 border-rose-900/50 text-rose-400',
}

const RISK_BAR_COLOR: Record<RiskLevel, string> = {
  low:      '#10B981',
  medium:   '#FBBF24',
  high:     '#F97316',
  critical: '#ef4444',
}

const ALERT_BADGE: Record<AlertLevel, string> = {
  siaga1: 'bg-rose-950/50 border-rose-900/50 text-rose-400',
  siaga2: 'bg-amber-950/50 border-amber-900/50 text-amber-400',
  siaga3: 'bg-sky-950/50 border-sky-900/50 text-sky-400',
}

const INCIDENT_BADGE: Record<string, string> = {
  siaga1: 'bg-rose-950/50 border-rose-900/50 text-rose-400',
  siaga2: 'bg-amber-950/50 border-amber-900/50 text-amber-400',
  siaga3: 'bg-sky-950/50 border-sky-900/50 text-sky-400',
}

const DRIVER_LABEL: Record<string, string> = {
  kombinasi:   'Kombinasi',
  curah_hujan: 'Curah Hujan',
  backwater:   'Backwater',
}

const DRIVER_STYLE: Record<string, string> = {
  kombinasi:   'bg-purple-950/50 border-purple-900/50 text-purple-400',
  curah_hujan: 'bg-blue-950/50 border-blue-900/50 text-blue-400',
  backwater:   'bg-orange-950/50 border-orange-900/50 text-orange-400',
}

// ── Derived data ──────────────────────────────────────────────
const zonaKritis = predictionsData.filter((p) => p.riskLevel === 'critical').length
const alertAktif = activeAlertsData.length
const deployedPumps = pumpsData.filter((p) => p.status === 'deployed')
const deployedBoats = boatsData.filter((b) => b.status === 'deployed')
const totalDeployed = deployedPumps.length + deployedBoats.length
const totalPengungsi = sheltersData.reduce((sum, s) => sum + s.currentOccupancy, 0)

const sortedPredictions = [...predictionsData].sort((a, b) => b.riskScore - a.riskScore)

export default function ExecutiveViewPage() {
  return (
    <div className="flex-1 overflow-y-auto px-6 pb-8 space-y-5 pt-5">

      {/* ── ROW 1: KPI Cards ─────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <PageKpiCard
          icon={<MapPin className="w-3.5 h-3.5" />}
          label="Zona Kritis"
          value={zonaKritis}
          sub="Kelurahan status kritis"
          color="#ef4444"
        />
        <PageKpiCard
          icon={<Bell className="w-3.5 h-3.5" />}
          label="Alert Aktif"
          value={activeAlertsData.length}
          sub="Peringatan banjir aktif"
          color="#f97316"
        />
        <PageKpiCard
          icon={<Zap className="w-3.5 h-3.5" />}
          label="Sumber Aktif"
          value={totalDeployed}
          sub="Pompa & perahu terdeployment"
          color="#3b82f6"
        />
        <PageKpiCard
          icon={<Users className="w-3.5 h-3.5" />}
          label="Total Pengungsi"
          value={totalPengungsi}
          sub="Jiwa tertampung di posko"
          color="#10b981"
        />
      </div>

      {/* ── ROW 2: 12-col grid ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* LEFT (7): Ringkasan Risiko Kelurahan */}
        <div className="lg:col-span-7">
          <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)]/80 rounded-xl overflow-hidden h-full">
            <div className="px-5 py-3.5 border-b border-[var(--border-main)] flex items-center justify-between">
              <h2 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Ringkasan Risiko Kelurahan</h2>
              <span className="text-[10.5px] text-zinc-600">{sortedPredictions.length} kelurahan</span>
            </div>
            <div className="divide-y divide-[var(--border-main)]">
              {sortedPredictions.map((p) => {
                const rl = p.riskLevel as RiskLevel
                const barColor = RISK_BAR_COLOR[rl]
                return (
                  <div key={p.kelurahanId} className="px-5 py-3 flex items-center gap-3 hover:bg-zinc-900/20 transition-colors">
                    {/* Name + kecamatan */}
                    <div className="w-36 flex-shrink-0">
                      <div className="text-[10.5px] font-semibold text-zinc-200 leading-tight truncate">{p.kelurahan}</div>
                      <div className="text-[10.5px] text-zinc-600 truncate">{p.kecamatan}</div>
                    </div>

                    {/* Risk badge */}
                    <span className={`flex-shrink-0 inline-flex px-1.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wider rounded border ${RISK_BADGE[rl]}`}>
                      {riskLevelMeta[rl].label}
                    </span>

                    {/* Risk score bar */}
                    <div className="flex-1 flex items-center gap-2 min-w-0">
                      <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${p.riskScore}%`, background: barColor }}
                        />
                      </div>
                      <span className="text-[10.5px] font-mono font-bold text-zinc-400 w-6 text-right flex-shrink-0">{p.riskScore}</span>
                    </div>

                    {/* Primary driver */}
                    <span className={`flex-shrink-0 inline-flex px-1.5 py-0.5 text-[10.5px] font-bold rounded border ${DRIVER_STYLE[p.primaryDriver] ?? 'bg-zinc-900/50 border-zinc-800/50 text-zinc-400'}`}>
                      {DRIVER_LABEL[p.primaryDriver] ?? p.primaryDriver}
                    </span>

                    {/* 1h forecast */}
                    <div className="flex-shrink-0 text-right">
                      <div className="text-[10.5px] font-bold text-zinc-300">{p.forecast['1h'].probability}%</div>
                      <div className="text-[10.5px] text-zinc-600">1j</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* RIGHT (5): Sumber Daya Kritis + Alert Terkini */}
        <div className="lg:col-span-5 space-y-5">

          {/* Sumber Daya Kritis */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)]/80 rounded-xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[var(--border-main)]">
              <h2 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Sumber Daya Kritis</h2>
            </div>
            <div className="p-4 space-y-2">
              {/* Deployed Pumps */}
              {deployedPumps.map((pump) => (
                <div key={pump.id} className="bg-[var(--bg-inner)] rounded-xl px-4 py-2.5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[10.5px] font-bold text-zinc-200 truncate">{pump.name}</div>
                    <div className="text-[10.5px] text-zinc-500">{pump.location}</div>
                  </div>
                  <span className="text-[10.5px] font-mono text-blue-400 font-bold flex-shrink-0">{pump.capacity}</span>
                </div>
              ))}

              {/* Divider */}
              <div className="border-t border-[var(--border-main)] pt-2 mt-1">
                {deployedBoats.map((boat) => (
                  <div key={boat.id} className="bg-[var(--bg-inner)] rounded-xl px-4 py-2.5 flex items-center justify-between gap-3 mb-2">
                    <div className="min-w-0">
                      <div className="text-[10.5px] font-bold text-zinc-200 truncate">{boat.name}</div>
                      <div className="text-[10.5px] text-zinc-500">{boat.location}</div>
                    </div>
                    <span className="text-[10.5px] font-mono text-emerald-400 font-bold flex-shrink-0">{boat.capacity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Alert Terkini */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)]/80 rounded-xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[var(--border-main)]">
              <h2 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Alert Terkini</h2>
            </div>
            <div className="p-4 space-y-3">
              {activeAlertsData.map((alert) => {
                const al = alert.level as AlertLevel
                return (
                  <div key={alert.id} className="bg-[var(--bg-inner)] rounded-xl p-3 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex px-1.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wider rounded border ${ALERT_BADGE[al]}`}>
                        {alertLevelMeta[al].label}
                      </span>
                      <span className="text-[10.5px] font-semibold text-zinc-300 truncate flex-1">{alert.location}</span>
                    </div>
                    <p className="text-[10.5px] text-zinc-500 truncate" title={alert.trigger}>{alert.trigger}</p>
                    <div className="flex items-center gap-1">
                      <span className="text-[10.5px] text-zinc-600">AI prob:</span>
                      <span className="text-[10.5px] font-bold text-rose-400">{alert.aiPrediction.probability}%</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      </div>

      {/* ── ROW 3: Insiden Terkini ───────────────────────────── */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)]/80 rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[var(--border-main)]">
          <h2 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Insiden Terkini</h2>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {incidentsData.slice(0, 5).map((inc) => (
              <div key={inc.id} className="bg-[var(--bg-inner)] rounded-xl p-4 space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-[10.5px] font-mono text-zinc-600 mb-0.5">{formatDate(inc.date)}</div>
                    <div className="text-[10.5px] font-bold text-zinc-200 leading-snug">{inc.kelurahan}</div>
                    <div className="text-[10.5px] text-zinc-500">{inc.kecamatan}</div>
                  </div>
                  <span className={`inline-flex px-1.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wider rounded border flex-shrink-0 ${INCIDENT_BADGE[inc.level] ?? ''}`}>
                    {inc.level === 'siaga1' ? 'S1' : inc.level === 'siaga2' ? 'S2' : 'S3'}
                  </span>
                </div>

                {/* Max depth */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10.5px] text-zinc-600">Kedalaman max:</span>
                  <span className="text-[10.5px] font-bold text-zinc-300">{inc.maxDepth} cm</span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-zinc-900/40 rounded-lg px-2.5 py-1.5 text-center">
                    <div className="text-[10.5px] font-bold text-zinc-200">{inc.affectedResidents.toLocaleString('id-ID')}</div>
                    <div className="text-[10.5px] text-zinc-600">jiwa</div>
                  </div>
                  <div className="bg-zinc-900/40 rounded-lg px-2.5 py-1.5 text-center">
                    <div className="text-[10.5px] font-bold text-zinc-200">{inc.evacuees.toLocaleString('id-ID')}</div>
                    <div className="text-[10.5px] text-zinc-600">dievakuasi</div>
                  </div>
                </div>

                {/* Chronology (first 2 items) */}
                <div className="space-y-1">
                  {inc.chronology.slice(0, 2).map((c, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <span className="text-[10.5px] font-mono text-zinc-600 flex-shrink-0">{c.time}</span>
                      <span className="text-[10.5px] text-zinc-500 leading-tight">{c.event}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
