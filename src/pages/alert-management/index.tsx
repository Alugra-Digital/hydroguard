import { useState, useMemo } from 'react'
import { Bell, AlertTriangle } from 'lucide-react'
import PageKpiCard from '../../components/PageKpiCard'
import {
  kecamatanList,
  activeAlertsData,
  historicalAlertsData,
} from '../../mock/alertManagement'

type AlertLevel = 'siaga1' | 'siaga2' | 'siaga3'
type ActiveTab = 'active' | 'history'

const LEVEL_STYLE: Record<AlertLevel, string> = {
  siaga1: 'bg-rose-950/50 border-rose-900/50 text-rose-400',
  siaga2: 'bg-amber-950/50 border-amber-900/50 text-amber-400',
  siaga3: 'bg-sky-950/50 border-sky-900/50 text-sky-400',
}

const LEVEL_LABEL: Record<AlertLevel, string> = {
  siaga1: 'Siaga 1',
  siaga2: 'Siaga 2',
  siaga3: 'Siaga 3',
}

function formatTs(iso: string) {
  const d = new Date(iso)
  return d.toLocaleString('id-ID', {
    day: '2-digit', month: '2-digit', year: '2-digit',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function AlertManagementPage() {
  const [filterLevel, setFilterLevel] = useState<AlertLevel | null>(null)
  const [filterKecamatan, setFilterKecamatan] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<ActiveTab>('active')

  // KPI counts
  const siaga1Count = activeAlertsData.filter((a) => a.level === 'siaga1').length
  const siaga2Count = activeAlertsData.filter((a) => a.level === 'siaga2').length
  const siaga3Count = activeAlertsData.filter((a) => a.level === 'siaga3').length

  const filteredActive = useMemo(() => {
    return activeAlertsData.filter((a) => {
      const matchLevel = !filterLevel || a.level === filterLevel
      const matchKec = !filterKecamatan || a.kecamatan === filterKecamatan
      return matchLevel && matchKec
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }, [filterLevel, filterKecamatan])

  const filteredHistory = useMemo(() => {
    return historicalAlertsData.filter((a) => {
      const matchLevel = !filterLevel || a.level === filterLevel
      const matchKec = !filterKecamatan || a.kecamatan === filterKecamatan
      return matchLevel && matchKec
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }, [filterLevel, filterKecamatan])

  return (
    <div className="flex-1 overflow-y-auto px-6 pb-8 space-y-5 pt-5">

      {/* PAGE HEADER */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)]/80 rounded-xl p-5">
        {/* Title row */}
        <div className="flex items-center gap-2.5 mb-4">
          <Bell className="w-4 h-4 text-rose-400 flex-shrink-0" />
          <div>
            <h1 className="text-sm font-bold text-zinc-200 leading-tight">Alert Management</h1>
            <p className="text-[10.5px] text-zinc-500">Manajemen Peringatan Banjir</p>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <PageKpiCard
            icon={<Bell className="w-3.5 h-3.5" />}
            label="Alert Aktif"
            value={activeAlertsData.length}
            sub="Total peringatan aktif"
            color="#ef4444"
          />
          <PageKpiCard
            icon={<AlertTriangle className="w-3.5 h-3.5" />}
            label="Siaga 1"
            value={siaga1Count}
            sub="Level tertinggi"
            color="#ef4444"
          />
          <PageKpiCard
            icon={<AlertTriangle className="w-3.5 h-3.5" />}
            label="Siaga 2"
            value={siaga2Count}
            sub="Level menengah"
            color="#f97316"
          />
          <PageKpiCard
            icon={<AlertTriangle className="w-3.5 h-3.5" />}
            label="Siaga 3"
            value={siaga3Count}
            sub="Level awal"
            color="#f59e0b"
          />
        </div>
      </div>

      {/* TAB SWITCHER */}
      <div className="flex items-center gap-1 bg-[var(--bg-card)] border border-[var(--border-subtle)]/80 p-0.5 rounded-lg w-fit select-none">
        {(['active', 'history'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === tab ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {tab === 'active' ? 'Alert Aktif' : 'Riwayat Alert'}
          </button>
        ))}
      </div>

      {/* ACTIVE ALERTS TAB */}
      {activeTab === 'active' && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)]/80 rounded-xl overflow-hidden">
          {/* Filter row */}
          <div className="px-5 py-3.5 border-b border-[var(--border-main)] flex flex-wrap items-center gap-3">
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

            {/* Level filter chips */}
            <div className="flex items-center gap-1 bg-zinc-950 border border-[var(--border-subtle)] p-0.5 rounded-md text-[10.5px] font-medium">
              {([null, 'siaga1', 'siaga2', 'siaga3'] as const).map((lvl) => (
                <button
                  key={String(lvl)}
                  onClick={() => setFilterLevel(lvl)}
                  className={`px-1.5 py-0.5 rounded transition-all ${
                    filterLevel === lvl ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {lvl === null ? 'Semua' : LEVEL_LABEL[lvl]}
                </button>
              ))}
            </div>

            <span className="text-[10.5px] text-zinc-600 ml-auto">
              {filteredActive.length} alert
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-main)] text-[10.5px] font-bold text-zinc-500 uppercase bg-zinc-950/40 select-none">
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Waktu</th>
                  <th className="py-3 px-4">Level</th>
                  <th className="py-3 px-4">Lokasi</th>
                  <th className="py-3 px-4">Trigger</th>
                  <th className="py-3 px-4">Sensor</th>
                  <th className="py-3 px-4 text-right">AI Prob%</th>
                  <th className="py-3 px-4 text-right">Est. Waktu</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-main)] text-xs font-medium">
                {filteredActive.length > 0 ? filteredActive.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-zinc-900/30 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-4 text-zinc-400 font-mono text-[10.5px]">{item.id}</td>
                    <td className="py-3 px-4 text-zinc-400 font-mono text-[10.5px] whitespace-nowrap">{formatTs(item.timestamp)}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wider rounded border ${LEVEL_STYLE[item.level as AlertLevel]}`}>
                        {LEVEL_LABEL[item.level as AlertLevel]}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[10.5px]">
                      <div className="text-zinc-200 font-semibold">{item.kelurahan}</div>
                      <div className="text-zinc-500">{item.kecamatan}</div>
                    </td>
                    <td className="py-3 px-4 text-zinc-300 text-[10.5px] max-w-[180px] truncate" title={item.trigger}>
                      {item.trigger}
                    </td>
                    <td className="py-3 px-4 text-zinc-400 font-mono text-[10.5px]">{item.sensorId}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-rose-400 font-bold text-[10.5px]">{item.aiPrediction.probability}%</span>
                    </td>
                    <td className="py-3 px-4 text-right text-zinc-400 text-[10.5px]">{item.aiPrediction.estimatedTime}m</td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-950/40 border border-rose-900/40 text-rose-400 text-[10.5px] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                        Aktif
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-zinc-500 text-xs select-none">
                      Tidak ada alert yang sesuai filter
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* HISTORY TAB */}
      {activeTab === 'history' && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)]/80 rounded-xl overflow-hidden">
          {/* Stats bar */}
          <div className="px-5 py-3.5 border-b border-[var(--border-main)] flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-zinc-500" />
              <span className="text-[10.5px] text-zinc-400 font-medium">
                {historicalAlertsData.length} kejadian tercatat · Avg resolusi 38 menit
              </span>
            </div>

            {/* Filter row inline */}
            <div className="ml-auto flex items-center gap-2">
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
              <div className="flex items-center gap-1 bg-zinc-950 border border-[var(--border-subtle)] p-0.5 rounded-md text-[10.5px] font-medium">
                {([null, 'siaga1', 'siaga2', 'siaga3'] as const).map((lvl) => (
                  <button
                    key={String(lvl)}
                    onClick={() => setFilterLevel(lvl)}
                    className={`px-1.5 py-0.5 rounded transition-all ${
                      filterLevel === lvl ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {lvl === null ? 'Semua' : LEVEL_LABEL[lvl]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-main)] text-[10.5px] font-bold text-zinc-500 uppercase bg-zinc-950/40 select-none">
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Waktu</th>
                  <th className="py-3 px-4">Level</th>
                  <th className="py-3 px-4">Lokasi</th>
                  <th className="py-3 px-4">Trigger</th>
                  <th className="py-3 px-4">Diselesaikan Oleh</th>
                  <th className="py-3 px-4 text-right">Diselesaikan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-main)] text-xs font-medium">
                {filteredHistory.length > 0 ? filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-900/30 transition-colors cursor-pointer">
                    <td className="py-3 px-4 text-zinc-400 font-mono text-[10.5px]">{item.id}</td>
                    <td className="py-3 px-4 text-zinc-400 font-mono text-[10.5px] whitespace-nowrap">{formatTs(item.timestamp)}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wider rounded border ${LEVEL_STYLE[item.level as AlertLevel]}`}>
                        {LEVEL_LABEL[item.level as AlertLevel]}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[10.5px]">
                      <div className="text-zinc-200 font-semibold">{item.kelurahan}</div>
                      <div className="text-zinc-500">{item.kecamatan}</div>
                    </td>
                    <td className="py-3 px-4 text-zinc-300 text-[10.5px] max-w-[180px] truncate" title={item.trigger}>
                      {item.trigger}
                    </td>
                    <td className="py-3 px-4 text-zinc-500 text-[10.5px]">{item.acknowledgedBy ?? '—'}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-emerald-400 font-mono text-[10.5px]">
                        {item.resolvedAt ? formatTs(item.resolvedAt) : '—'}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-zinc-500 text-xs select-none">
                      Tidak ada riwayat yang sesuai filter
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  )
}
