import { useState } from 'react'
import { Zap, Anchor, Users, Home } from 'lucide-react'
import {
  pumpsData,
  boatsData,
  personnelData,
  sheltersData,
  logisticsData,
} from '../../mock/resourceManagement'
import PageKpiCard from '../../components/PageKpiCard'

// ── Tab type ────────────────────────────────────────────────
type ActiveTab = 'pompa' | 'perahu' | 'personil' | 'posko' | 'logistik'
type PersonnelRole = 'BPBD' | 'Damkar' | 'PPSU' | 'Tagana' | 'Relawan'

// ── Style helpers ───────────────────────────────────────────
const ROLE_STYLE: Record<PersonnelRole, string> = {
  BPBD:    'bg-blue-950/50 border-blue-900/50 text-blue-400',
  Damkar:  'bg-rose-950/50 border-rose-900/50 text-rose-400',
  PPSU:    'bg-emerald-950/50 border-emerald-900/50 text-emerald-400',
  Tagana:  'bg-orange-950/50 border-orange-900/50 text-orange-400',
  Relawan: 'bg-purple-950/50 border-purple-900/50 text-purple-400',
}

const PUMP_TYPE_STYLE: Record<string, string> = {
  mobile:     'bg-amber-950/50 border-amber-900/50 text-amber-400',
  stationary: 'bg-blue-950/50 border-blue-900/50 text-blue-400',
}

const PUMP_TYPE_LABEL: Record<string, string> = {
  mobile:     'Mobile',
  stationary: 'Stasioner',
}

const DEPLOY_STYLE = 'bg-emerald-950/50 border-emerald-900/50 text-emerald-400'
const STANDBY_STYLE = 'bg-zinc-900/50 border-zinc-800/50 text-zinc-500'

// Max thresholds for logistics low-value detection (per shelter capacity)
const LOGISTICS_THRESHOLDS = {
  makanan: 500,  // 20% of 500 = 100
  air:     720,  // 20% of 720 = 144
  selimut: 300,  // 20% of 300 = 60
  obat:    60,   // 20% of 60  = 12
}

function logisticsCellClass(value: number, maxVal: number): string {
  return value < maxVal * 0.2
    ? 'text-rose-400 font-bold'
    : 'text-zinc-300'
}

// ── Sub-components ──────────────────────────────────────────
function PompaTab() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[var(--border-main)] text-[10.5px] font-bold text-zinc-500 uppercase bg-zinc-950/40 select-none">
            <th className="py-3 px-4">ID</th>
            <th className="py-3 px-4">Nama</th>
            <th className="py-3 px-4">Tipe</th>
            <th className="py-3 px-4">Kapasitas</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4">Lokasi</th>
            <th className="py-3 px-4">Operator</th>
            <th className="py-3 px-4">Waktu Deploy</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-main)]">
          {[...pumpsData]
            .sort((a, b) => (a.status === 'deployed' && b.status !== 'deployed' ? -1 : 1))
            .map(pump => (
            <tr key={pump.id} className="hover:bg-zinc-900/30 transition-colors">
              <td className="py-3 px-4 font-mono text-[10.5px] text-zinc-500">{pump.id}</td>
              <td className="py-3 px-4 text-[10.5px] font-semibold text-zinc-200">{pump.name}</td>
              <td className="py-3 px-4">
                <span className={`text-[10.5px] font-bold px-1.5 py-0.5 rounded border ${PUMP_TYPE_STYLE[pump.type]}`}>
                  {PUMP_TYPE_LABEL[pump.type]}
                </span>
              </td>
              <td className="py-3 px-4 font-mono text-[10.5px] text-zinc-400">{pump.capacity}</td>
              <td className="py-3 px-4">
                <span className={`text-[10.5px] font-bold px-1.5 py-0.5 rounded border ${pump.status === 'deployed' ? DEPLOY_STYLE : STANDBY_STYLE}`}>
                  {pump.status === 'deployed' ? 'Dikerahkan' : 'Standby'}
                </span>
              </td>
              <td className="py-3 px-4 text-[10.5px] text-zinc-400">{pump.location}</td>
              <td className="py-3 px-4 text-[10.5px] text-zinc-400">{pump.operator}</td>
              <td className="py-3 px-4 font-mono text-[10.5px] text-zinc-500">
                {pump.deployedAt
                  ? new Date(pump.deployedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                  : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function PerahuTab() {
  const sorted = [...boatsData].sort((a, b) =>
    a.status === 'deployed' && b.status !== 'deployed' ? -1 : 1
  )
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[var(--border-main)] text-[10.5px] font-bold text-zinc-500 uppercase bg-zinc-950/40 select-none">
            <th className="py-3 px-4">ID</th>
            <th className="py-3 px-4">Nama</th>
            <th className="py-3 px-4">Kapasitas</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4">Lokasi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-main)]">
          {sorted.map(boat => (
            <tr key={boat.id} className="hover:bg-zinc-900/30 transition-colors">
              <td className="py-3 px-4 font-mono text-[10.5px] text-zinc-500">{boat.id}</td>
              <td className="py-3 px-4 text-[10.5px] font-semibold text-zinc-200">{boat.name}</td>
              <td className="py-3 px-4 font-mono text-[10.5px] text-zinc-400">{boat.capacity}</td>
              <td className="py-3 px-4">
                <span className={`text-[10.5px] font-bold px-1.5 py-0.5 rounded border ${boat.status === 'deployed' ? DEPLOY_STYLE : STANDBY_STYLE}`}>
                  {boat.status === 'deployed' ? 'Dikerahkan' : 'Standby'}
                </span>
              </td>
              <td className="py-3 px-4 text-[10.5px] text-zinc-400">{boat.location}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function PersonilTab() {
  const [filterRole, setFilterRole] = useState<string>('all')
  const roles: PersonnelRole[] = ['BPBD', 'Damkar', 'PPSU', 'Tagana', 'Relawan']

  const filtered = filterRole === 'all'
    ? personnelData
    : personnelData.filter(p => p.role === filterRole)

  // Group by role for display
  const grouped = roles.reduce<Record<string, typeof personnelData>>((acc, role) => {
    const items = filtered.filter(p => p.role === role)
    if (items.length) acc[role] = items
    return acc
  }, {})

  return (
    <div>
      {/* Role filter */}
      <div className="p-4 border-b border-[var(--border-main)] flex items-center gap-2 flex-wrap">
        <span className="text-[10.5px] text-zinc-500 font-medium">Filter Role:</span>
        {(['all', ...roles] as const).map(role => (
          <button
            key={role}
            onClick={() => setFilterRole(role)}
            className={`px-2.5 py-1 rounded-md text-[10.5px] font-bold transition-colors ${
              filterRole === role
                ? 'bg-zinc-800 text-white border border-zinc-700'
                : 'bg-[var(--bg-inner)] text-zinc-400 border border-[var(--border-subtle)] hover:text-zinc-200'
            }`}
          >
            {role === 'all' ? 'Semua' : role}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        {Object.entries(grouped).map(([role, members]) => (
          <div key={role}>
            <div className="px-4 py-2 bg-zinc-950/40 border-b border-[var(--border-main)]">
              <span className="text-[10.5px] font-bold text-zinc-500 uppercase tracking-wider">
                {role} ({members.filter(p => p.status === 'active').length}/{members.length})
              </span>
            </div>
            <table className="w-full text-left border-collapse">
              <tbody className="divide-y divide-[var(--border-main)]">
                {members.map(p => (
                  <tr key={p.id} className="hover:bg-zinc-900/30 transition-colors">
                    <td className="py-2.5 px-4 font-mono text-[10.5px] text-zinc-500 w-20">{p.id}</td>
                    <td className="py-2.5 px-4 text-[10.5px] font-semibold text-zinc-200 min-w-[120px]">{p.name}</td>
                    <td className="py-2.5 px-4">
                      <span className={`text-[10.5px] font-bold px-1.5 py-0.5 rounded border ${ROLE_STYLE[p.role as PersonnelRole]}`}>
                        {p.role}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-[10.5px] text-zinc-400">{p.unit}</td>
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${p.status === 'active' ? 'bg-emerald-500' : 'bg-zinc-600'}`} />
                        <span className={`text-[10.5px] ${p.status === 'active' ? 'text-emerald-400' : 'text-zinc-500'}`}>
                          {p.status === 'active' ? 'Aktif' : 'Standby'}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-[10.5px] text-zinc-400">{p.location}</td>
                    <td className="py-2.5 px-4 text-[10.5px] text-zinc-500 truncate max-w-[140px]">{p.assignment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  )
}

function PoskoTab() {
  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sheltersData.map(shelter => {
          const pct = Math.round((shelter.currentOccupancy / shelter.capacity) * 100)
          const isActive = shelter.status === 'active'
          const logistics = logisticsData.find(l => l.posko === shelter.name)

          return (
            <div key={shelter.id} className="bg-[var(--bg-inner)] rounded-xl p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="text-[10.5px] font-bold text-zinc-200 leading-snug mb-0.5">{shelter.name}</div>
                  <div className="text-[10.5px] text-zinc-500 truncate">{shelter.address}</div>
                </div>
                <span className={`text-[10.5px] font-bold px-1.5 py-0.5 rounded border flex-shrink-0 ${isActive ? DEPLOY_STYLE : STANDBY_STYLE}`}>
                  {isActive ? 'Aktif' : 'Standby'}
                </span>
              </div>

              {/* Occupancy */}
              <div className="flex items-center justify-between text-[10.5px] font-mono mb-1">
                <span className="text-zinc-500">Hunian</span>
                <span className="font-bold text-zinc-300">
                  {shelter.currentOccupancy}<span className="text-zinc-600 font-normal">/{shelter.capacity}</span>
                </span>
              </div>
              <div
                className="h-1.5 rounded-full overflow-hidden mb-3"
                style={{ background: 'rgba(255,255,255,0.08)' }}
              >
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${pct}%`,
                    background: pct > 75 ? '#ef4444' : pct > 40 ? '#f59e0b' : '#3b82f6',
                  }}
                />
              </div>

              {/* Logistics summary */}
              {logistics && (
                <div className="border-t border-[var(--border-main)] pt-2.5 mt-1">
                  <div className="text-[10.5px] text-zinc-600 font-bold uppercase tracking-wide mb-1.5">Logistik</div>
                  <div className="grid grid-cols-2 gap-1">
                    {(
                      [
                        { key: 'makanan', label: 'Makanan', unit: 'porsi', max: LOGISTICS_THRESHOLDS.makanan },
                        { key: 'air',     label: 'Air',     unit: 'L',     max: LOGISTICS_THRESHOLDS.air     },
                        { key: 'selimut', label: 'Selimut', unit: 'lbr',   max: LOGISTICS_THRESHOLDS.selimut },
                        { key: 'obat',    label: 'Obat',    unit: 'paket', max: LOGISTICS_THRESHOLDS.obat    },
                      ] as const
                    ).map(item => {
                      const val = logistics[item.key]
                      return (
                        <div key={item.key} className="flex items-center justify-between gap-1">
                          <span className="text-[10.5px] text-zinc-500">{item.label}</span>
                          <span className={`text-[10.5px] font-mono ${logisticsCellClass(val, item.max)}`}>
                            {val} {item.unit}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function LogistikTab() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[var(--border-main)] text-[10.5px] font-bold text-zinc-500 uppercase bg-zinc-950/40 select-none">
            <th className="py-3 px-4">Posko</th>
            <th className="py-3 px-4 text-right">Makanan (porsi)</th>
            <th className="py-3 px-4 text-right">Air (liter)</th>
            <th className="py-3 px-4 text-right">Selimut (lembar)</th>
            <th className="py-3 px-4 text-right">Obat (paket)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-main)]">
          {logisticsData.map((row, i) => (
            <tr key={i} className="hover:bg-zinc-900/30 transition-colors">
              <td className="py-3 px-4 text-[10.5px] font-semibold text-zinc-200">{row.posko}</td>
              <td className={`py-3 px-4 text-right font-mono text-[10.5px] ${logisticsCellClass(row.makanan, LOGISTICS_THRESHOLDS.makanan)}`}>
                {row.makanan.toLocaleString('id-ID')}
              </td>
              <td className={`py-3 px-4 text-right font-mono text-[10.5px] ${logisticsCellClass(row.air, LOGISTICS_THRESHOLDS.air)}`}>
                {row.air.toLocaleString('id-ID')}
              </td>
              <td className={`py-3 px-4 text-right font-mono text-[10.5px] ${logisticsCellClass(row.selimut, LOGISTICS_THRESHOLDS.selimut)}`}>
                {row.selimut.toLocaleString('id-ID')}
              </td>
              <td className={`py-3 px-4 text-right font-mono text-[10.5px] ${logisticsCellClass(row.obat, LOGISTICS_THRESHOLDS.obat)}`}>
                {row.obat.toLocaleString('id-ID')}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t border-[var(--border-medium)] bg-zinc-950/40">
            <td className="py-3 px-4 text-[10.5px] font-bold text-zinc-400">Total</td>
            <td className="py-3 px-4 text-right font-mono text-[10.5px] font-bold text-zinc-300">
              {logisticsData.reduce((s, r) => s + r.makanan, 0).toLocaleString('id-ID')}
            </td>
            <td className="py-3 px-4 text-right font-mono text-[10.5px] font-bold text-zinc-300">
              {logisticsData.reduce((s, r) => s + r.air, 0).toLocaleString('id-ID')}
            </td>
            <td className="py-3 px-4 text-right font-mono text-[10.5px] font-bold text-zinc-300">
              {logisticsData.reduce((s, r) => s + r.selimut, 0).toLocaleString('id-ID')}
            </td>
            <td className="py-3 px-4 text-right font-mono text-[10.5px] font-bold text-zinc-300">
              {logisticsData.reduce((s, r) => s + r.obat, 0).toLocaleString('id-ID')}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

// ── Main page ────────────────────────────────────────────────
export default function ResourceManagementPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('pompa')

  // KPI derived values
  const pumpsDeployed = pumpsData.filter(p => p.status === 'deployed').length
  const boatsDeployed = boatsData.filter(b => b.status === 'deployed').length
  const personnelActive = personnelData.filter(p => p.status === 'active').length
  const sheltersActive = sheltersData.filter(s => s.status === 'active').length
  const totalOccupancy = sheltersData.reduce((sum, s) => sum + s.currentOccupancy, 0)

  const TABS: { id: ActiveTab; label: string }[] = [
    { id: 'pompa',    label: 'Pompa'    },
    { id: 'perahu',   label: 'Perahu'   },
    { id: 'personil', label: 'Personil' },
    { id: 'posko',    label: 'Posko'    },
    { id: 'logistik', label: 'Logistik' },
  ]

  return (
    <div className="flex-1 overflow-y-auto px-6 pb-8 space-y-5">

      {/* PAGE HEADER */}
      <section className="py-4 flex items-center justify-between select-none">
        <div className="flex items-center gap-1 bg-[var(--bg-card)] border border-[var(--border-subtle)] p-0.5 rounded-lg">
          <div className="px-3 py-1 text-xs font-medium rounded-md bg-zinc-800 text-white shadow-sm">
            Resource Management
          </div>
        </div>
        <div className="flex items-center gap-2 text-[10.5px] text-zinc-500">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live monitoring
        </div>
      </section>

      {/* ── SECTION 1: KPI ROW ── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <PageKpiCard
          icon={<Zap className="w-3.5 h-3.5" />}
          label="Pompa Deploy"
          value={`${pumpsDeployed}/${pumpsData.length}`}
          color="#f59e0b"
          sub="Unit aktif di lapangan"
        />
        <PageKpiCard
          icon={<Anchor className="w-3.5 h-3.5" />}
          label="Perahu Deploy"
          value={`${boatsDeployed}/${boatsData.length}`}
          color="#3b82f6"
          sub="Armada aktif"
        />
        <PageKpiCard
          icon={<Users className="w-3.5 h-3.5" />}
          label="Personil Aktif"
          value={`${personnelActive}/${personnelData.length}`}
          color="#6366f1"
          sub="Tim di lapangan"
        />
        <PageKpiCard
          icon={<Home className="w-3.5 h-3.5" />}
          label="Posko Aktif"
          value={`${sheltersActive}/${sheltersData.length}`}
          color="#10b981"
          sub="Shelter beroperasi"
        />
        <PageKpiCard
          icon={<Users className="w-3.5 h-3.5" />}
          label="Total Pengungsi"
          value={totalOccupancy}
          color="#ef4444"
          sub="Jiwa tertampung"
        />
      </div>

      {/* ── SECTION 2: TAB SWITCHER + CONTENT ── */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)]/80 rounded-xl overflow-hidden">

        {/* Tab header */}
        <div className="px-5 py-3 border-b border-[var(--border-main)] flex items-center gap-1">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-[10.5px] font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40'
              }`}
            >
              {tab.label}
            </button>
          ))}

          {/* Counts pill */}
          <div className="ml-auto text-[10.5px] font-mono text-zinc-500">
            {activeTab === 'pompa'    && `${pumpsData.length} unit`}
            {activeTab === 'perahu'   && `${boatsData.length} unit`}
            {activeTab === 'personil' && `${personnelData.length} personil`}
            {activeTab === 'posko'    && `${sheltersData.length} posko`}
            {activeTab === 'logistik' && `${logisticsData.length} posko`}
          </div>
        </div>

        {/* Tab content */}
        {activeTab === 'pompa'    && <PompaTab />}
        {activeTab === 'perahu'   && <PerahuTab />}
        {activeTab === 'personil' && <PersonilTab />}
        {activeTab === 'posko'    && <PoskoTab />}
        {activeTab === 'logistik' && <LogistikTab />}

      </div>

    </div>
  )
}
