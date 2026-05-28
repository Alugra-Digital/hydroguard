import { useState } from 'react'
import { Navigation, Home, Camera, Users, ChevronDown, ClipboardList, CheckCircle2, Send, AlertTriangle, Waves, MapPin, ChevronLeft, ChevronRight } from 'lucide-react'
import { useIsDark, adaptColor } from '../../utils/themeColor'

// ── Reusable pagination bar ───────────────────────────────
function Pagination({ page, total, perPage, onChange, showAlways = false }: {
  page: number; total: number; perPage: number; onChange: (p: number) => void; showAlways?: boolean
}) {
  const pages = Math.ceil(total / perPage)
  if (pages <= 1 && !showAlways) return null
  return (
    <div className="flex items-center justify-between px-4 py-2.5 border-t border-[var(--border-main)] select-none">
      <span className="text-[10.5px] text-zinc-500 font-mono">
        {(page - 1) * perPage + 1}–{Math.min(page * perPage, total)} dari {total}
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(page - 1)} disabled={page === 1}
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30 text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:hover:bg-transparent disabled:hover:text-zinc-400"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
          <button key={p} onClick={() => onChange(p)}
            className={`w-7 h-7 rounded-lg text-[10.5px] font-bold transition-colors ${
              p === page ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40'
            }`}>
            {p}
          </button>
        ))}
        <button
          onClick={() => onChange(page + 1)} disabled={page === pages}
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30 text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:hover:bg-transparent disabled:hover:text-zinc-400"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
import {
  kecamatanList,
  kelurahanData,
  evacStatusMeta,
  evacRoutesData,
  cctvStatusMeta,
  cctvData,
  sheltersData,
} from '../../mock/fieldCoordinator'
import PageKpiCard from '../../components/PageKpiCard'

// ── Type helpers ────────────────────────────────────────────
type RiskLevel = 'critical' | 'high' | 'medium' | 'low'
type EvacStatus = keyof typeof evacStatusMeta
type CctvStatus = keyof typeof cctvStatusMeta

// ── Style maps ──────────────────────────────────────────────
const RISK_STYLE: Record<RiskLevel, string> = {
  critical: 'bg-rose-950/50 border-rose-900/50 text-rose-400',
  high:     'bg-orange-950/50 border-orange-900/50 text-orange-400',
  medium:   'bg-amber-950/50 border-amber-900/50 text-amber-400',
  low:      'bg-emerald-950/50 border-emerald-900/50 text-emerald-400',
}

const RISK_LABEL: Record<RiskLevel, string> = {
  critical: 'Kritis',
  high:     'Tinggi',
  medium:   'Sedang',
  low:      'Rendah',
}

const EVAC_STYLE: Record<EvacStatus, { text: string; dot: string; bg: string; border: string }> = {
  aman:     { text: 'text-emerald-400', dot: '#10b981', bg: '#10b98115', border: '#10b98135' },
  terbatas: { text: 'text-orange-400',  dot: '#f97316', bg: '#f9731615', border: '#f9731635' },
  tertutup: { text: 'text-rose-400',    dot: '#e11d48', bg: '#e11d4815', border: '#e11d4835' },
}

const CCTV_DOT: Record<CctvStatus, string> = {
  online:  '#10b981',
  alert:   '#ef4444',
  offline: '#52525b',
}

export default function FieldCoordinatorPage() {
  const isDark = useIsDark()
  const ac = (c: string) => adaptColor(c, isDark)
  const [filterKecamatan, setFilterKecamatan] = useState<string | null>(null)
  const [kecDropOpen, setKecDropOpen] = useState(false)

  // ── Pagination state ──────────────────────────────────
  const [evacPage,   setEvacPage]   = useState(1)
  const [poskoPage,  setPoskoPage]  = useState(1)
  const [cctvPage,   setCctvPage]   = useState(1)
  const EVAC_PER_PAGE  = 5
  const POSKO_PER_PAGE = 3
  const CCTV_PER_PAGE  = 6

  // ── Form state ─────────────────────────────────────────
  const [form, setForm] = useState({
    kecamatan:       '',
    kelurahan:       '',
    alertLevel:      '',
    tmaValue:        '',
    wargaTerdampak:  '',
    dievakuasi:      '',
    evacStatus:      'aman',
    poskoId:         '',
    kondisiJalan:    '',
    catatan:         '',
    pelapor:         '',
    nomorHp:         '',
  })
  const [submitting, setSubmitting]   = useState(false)
  const [submitted, setSubmitted]     = useState(false)
  const [formError, setFormError]     = useState('')

  const formKelurahan = form.kecamatan
    ? kelurahanData.filter(k => k.kecamatan === form.kecamatan)
    : []

  const setField = (key: keyof typeof form, val: string) =>
    setForm(p => ({ ...p, [key]: val }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.kecamatan || !form.kelurahan || !form.alertLevel) {
      setFormError('Kecamatan, kelurahan, dan level siaga wajib diisi.')
      return
    }
    setFormError('')
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setForm({ kecamatan:'', kelurahan:'', alertLevel:'', tmaValue:'', wargaTerdampak:'', dievakuasi:'', evacStatus:'aman', poskoId:'', kondisiJalan:'', catatan:'', pelapor:'', nomorHp:'' })
      }, 3000)
    }, 1200)
  }

  // KPI derived values
  const activeShelters = sheltersData.filter(s => s.status === 'active')
  const cctvActive = cctvData.filter(c => c.status === 'online' || c.status === 'alert')
  const totalOccupancy = sheltersData.reduce((sum, s) => sum + s.currentOccupancy, 0)

  // Kelurahan filter
  const filteredKelurahan = filterKecamatan
    ? kelurahanData.filter(k => k.kecamatan === filterKecamatan)
    : kelurahanData

  // Group by kecamatan
  const byKecamatan = kecamatanList.reduce<Record<string, typeof kelurahanData>>((acc, kec) => {
    const items = filteredKelurahan.filter(k => k.kecamatan === kec)
    if (items.length) acc[kec] = items
    return acc
  }, {})

  return (
    <div className="flex-1 overflow-y-auto px-6 pb-8 space-y-5">

      {/* PAGE HEADER */}
      <section className="py-4 flex items-center justify-between select-none">
        <div className="flex items-center gap-1 bg-[var(--bg-card)] border border-[var(--border-subtle)] p-0.5 rounded-lg">
          <div className="px-3 py-1 text-xs font-medium rounded-md bg-zinc-800 text-white shadow-sm">
            Field Coordinator
          </div>
        </div>
        <div className="flex items-center gap-2 text-[10.5px] text-zinc-500">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live monitoring
        </div>
      </section>

      {/* ── SECTION 1: KPI ROW ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <PageKpiCard
          icon={<Navigation className="w-3.5 h-3.5" />}
          label="Jalur Evakuasi"
          value={evacRoutesData.length}
          color="#f59e0b"
          sub="Total jalur terdaftar"
        />
        <PageKpiCard
          icon={<Home className="w-3.5 h-3.5" />}
          label="Posko Aktif"
          value={activeShelters.length}
          color="#3b82f6"
          sub="Posko pengungsian beroperasi"
        />
        <PageKpiCard
          icon={<Camera className="w-3.5 h-3.5" />}
          label="CCTV Aktif"
          value={cctvActive.length}
          color="#a855f7"
          sub="Kamera online & alert"
        />
        <PageKpiCard
          icon={<Users className="w-3.5 h-3.5" />}
          label="Total Pengungsi"
          value={totalOccupancy}
          color="#10b981"
          sub="Jiwa tertampung"
        />
      </div>

      {/* ── FORM: Laporan Kejadian ── */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)]/80 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[var(--border-main)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-blue-400" />
            <h2 className="text-sm font-bold text-zinc-200">Laporan Kejadian Banjir</h2>
          </div>
          <div className="flex items-center gap-1.5 text-[10.5px] font-medium px-2.5 py-1 rounded-lg bg-blue-950/40 border border-blue-900/40 text-blue-400">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Petugas Lapangan
          </div>
        </div>

        {/* Success state */}
        {submitted ? (
          <div className="p-8 flex flex-col items-center gap-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400" />
            <div className="text-sm font-bold text-zinc-200">Laporan Terkirim!</div>
            <div className="text-[10.5px] text-zinc-500 text-center">
              Laporan kejadian banjir di <span className="text-zinc-300 font-semibold">{form.kelurahan || '—'}</span> berhasil dikirim ke Pusat Komando.
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">

            {/* Error */}
            {formError && (
              <div className="flex items-center gap-2 bg-rose-950/40 border border-rose-900/40 rounded-xl px-4 py-3 text-[10.5px] text-rose-400">
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />{formError}
              </div>
            )}

            {/* ── Shared input / label classes ── */}
            {/* Input: bg-[var(--bg-card)] creates clear contrast against section bg */}
            {/* Label: text-zinc-300 (dark) / text-zinc-700 via CSS override (light) */}

            {/* Row 1: Lokasi */}
            <div className="bg-[var(--bg-inner)] rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-1.5 pb-1 border-b border-[var(--border-main)]">
                <MapPin className="w-3.5 h-3.5 text-[#0077b6]" />
                <span className="text-[10.5px] font-bold text-zinc-300 uppercase tracking-wider">Lokasi Kejadian</span>
                <span className="text-[10.5px] text-rose-400 ml-1">* wajib</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-[10.5px] font-bold text-zinc-300">Kecamatan</label>
                  <select value={form.kecamatan}
                    onChange={e => { setField('kecamatan', e.target.value); setField('kelurahan', '') }}
                    className="w-full h-10 bg-[var(--bg-card)] border-2 border-[var(--border-subtle)] hover:border-zinc-600 focus:border-[#0077b6] focus:outline-none rounded-xl px-3 text-zinc-200 text-[10.5px] transition-all font-medium"
                    required>
                    <option value="">-- Pilih Kecamatan --</option>
                    {kecamatanList.map(k => <option key={k} value={k}>{k}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10.5px] font-bold text-zinc-300">Kelurahan</label>
                  <select value={form.kelurahan}
                    onChange={e => setField('kelurahan', e.target.value)}
                    disabled={!form.kecamatan}
                    className="w-full h-10 bg-[var(--bg-card)] border-2 border-[var(--border-subtle)] hover:border-zinc-600 focus:border-[#0077b6] focus:outline-none rounded-xl px-3 text-zinc-200 text-[10.5px] transition-all font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                    required>
                    <option value="">-- Pilih Kelurahan --</option>
                    {formKelurahan.map(k => <option key={k.id} value={k.name}>{k.name}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Row 2: Kondisi Banjir — 2 col sejajar dengan Row 1 */}
            <div className="bg-[var(--bg-inner)] rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-1.5 pb-1 border-b border-[var(--border-main)]">
                <Waves className="w-3.5 h-3.5 text-[#0077b6]" />
                <span className="text-[10.5px] font-bold text-zinc-300 uppercase tracking-wider">Kondisi Banjir</span>
                <span className="text-[10.5px] text-rose-400 ml-1">* wajib</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Level Siaga — sejajar Kecamatan */}
                <div className="space-y-2">
                  <label className="block text-[10.5px] font-bold text-zinc-300">Level Siaga</label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {[
                      { val: 'siaga3', label: 'Siaga 3', activeBg: '#f59e0b' },
                      { val: 'siaga2', label: 'Siaga 2', activeBg: '#f97316' },
                      { val: 'siaga1', label: 'Siaga 1', activeBg: '#ef4444' },
                      { val: 'banjir', label: 'Banjir',  activeBg: '#7c3aed' },
                    ].map(opt => (
                      <button type="button" key={opt.val}
                        onClick={() => setField('alertLevel', opt.val)}
                        className="px-4 py-2 rounded-xl text-[10.5px] font-bold border-2 transition-all"
                        style={form.alertLevel === opt.val ? {
                          background: opt.activeBg + '25', borderColor: opt.activeBg,
                          color: opt.activeBg, boxShadow: `0 0 0 2px ${opt.activeBg}30`,
                        } : { background: 'var(--bg-card)', borderColor: 'var(--border-subtle)', color: 'var(--text-root)' }}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                {/* TMA Pilihan — sejajar Kelurahan */}
                <div className="space-y-2">
                  <label className="block text-[10.5px] font-bold text-zinc-300">TMA / Tinggi Air</label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {[
                      { val: '>10',  label: '>10 cm',  activeBg: '#10b981' },
                      { val: '>25',  label: '>25 cm',  activeBg: '#3b82f6' },
                      { val: '>50',  label: '>50 cm',  activeBg: '#f59e0b' },
                      { val: '>100', label: '>100 cm', activeBg: '#f97316' },
                      { val: '>150', label: '>150 cm', activeBg: '#ef4444' },
                      { val: '>200', label: '>200 cm', activeBg: '#7c3aed' },
                    ].map(opt => (
                      <button type="button" key={opt.val}
                        onClick={() => setField('tmaValue', form.tmaValue === opt.val ? '' : opt.val)}
                        className="px-3 py-2 rounded-xl text-[10.5px] font-bold border-2 transition-all"
                        style={form.tmaValue === opt.val ? {
                          background: opt.activeBg + '25', borderColor: opt.activeBg,
                          color: opt.activeBg, boxShadow: `0 0 0 2px ${opt.activeBg}30`,
                        } : { background: 'var(--bg-card)', borderColor: 'var(--border-subtle)', color: 'var(--text-root)' }}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Row 3: Dampak & Infrastruktur */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[var(--bg-inner)] rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-1.5 pb-1 border-b border-[var(--border-main)]">
                  <Users className="w-3.5 h-3.5 text-[#0077b6]" />
                  <span className="text-[10.5px] font-bold text-zinc-300 uppercase tracking-wider">Dampak Warga</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-[10.5px] font-bold text-zinc-300">Warga Terdampak</label>
                    <input type="number" min="0" placeholder="Jumlah jiwa"
                      value={form.wargaTerdampak}
                      onChange={e => setField('wargaTerdampak', e.target.value)}
                      className="w-full h-10 bg-[var(--bg-card)] border-2 border-[var(--border-subtle)] hover:border-zinc-600 focus:border-[#0077b6] focus:outline-none rounded-xl px-3 text-zinc-200 text-[10.5px] transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10.5px] font-bold text-zinc-300">Dievakuasi</label>
                    <input type="number" min="0" placeholder="Jumlah jiwa"
                      value={form.dievakuasi}
                      onChange={e => setField('dievakuasi', e.target.value)}
                      className="w-full h-10 bg-[var(--bg-card)] border-2 border-[var(--border-subtle)] hover:border-zinc-600 focus:border-[#0077b6] focus:outline-none rounded-xl px-3 text-zinc-200 text-[10.5px] transition-all font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-[var(--bg-inner)] rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-1.5 pb-1 border-b border-[var(--border-main)]">
                  <Navigation className="w-3.5 h-3.5 text-[#0077b6]" />
                  <span className="text-[10.5px] font-bold text-zinc-300 uppercase tracking-wider">Status Infrastruktur</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-[10.5px] font-bold text-zinc-300">Jalur Evakuasi</label>
                    <select value={form.evacStatus} onChange={e => setField('evacStatus', e.target.value)}
                      className="w-full h-10 bg-[var(--bg-card)] border-2 border-[var(--border-subtle)] hover:border-zinc-600 focus:border-[#0077b6] focus:outline-none rounded-xl px-3 text-zinc-200 text-[10.5px] transition-all font-medium">
                      <option value="aman">Aman</option>
                      <option value="terbatas">Terbatas</option>
                      <option value="tertutup">Tertutup</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10.5px] font-bold text-zinc-300">Posko Terdekat</label>
                    <select value={form.poskoId} onChange={e => setField('poskoId', e.target.value)}
                      className="w-full h-10 bg-[var(--bg-card)] border-2 border-[var(--border-subtle)] hover:border-zinc-600 focus:border-[#0077b6] focus:outline-none rounded-xl px-3 text-zinc-200 text-[10.5px] transition-all font-medium">
                      <option value="">-- Pilih Posko --</option>
                      {sheltersData.map((s: {id: string; name: string}) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 4: Identitas Pelapor */}
            <div className="bg-[var(--bg-inner)] rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-1.5 pb-1 border-b border-[var(--border-main)]">
                <Users className="w-3.5 h-3.5 text-[#0077b6]" />
                <span className="text-[10.5px] font-bold text-zinc-300 uppercase tracking-wider">Identitas Pelapor</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-[10.5px] font-bold text-zinc-300">
                    Nama Pelapor <span className="text-rose-400">*</span>
                  </label>
                  <input type="text" placeholder="Nama lengkap petugas"
                    value={form.pelapor}
                    onChange={e => setField('pelapor', e.target.value)}
                    className="w-full h-10 bg-[var(--bg-card)] border-2 border-[var(--border-subtle)] hover:border-zinc-600 focus:border-[#0077b6] focus:outline-none rounded-xl px-3 text-zinc-200 text-[10.5px] transition-all font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10.5px] font-bold text-zinc-300">Nomor HP</label>
                  <input type="tel" placeholder="08xx-xxxx-xxxx"
                    value={form.nomorHp}
                    onChange={e => setField('nomorHp', e.target.value)}
                    className="w-full h-10 bg-[var(--bg-card)] border-2 border-[var(--border-subtle)] hover:border-zinc-600 focus:border-[#0077b6] focus:outline-none rounded-xl px-3 text-zinc-200 text-[10.5px] transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Row 5: Catatan Tambahan — section tersendiri */}
            <div className="bg-[var(--bg-inner)] rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-1.5 pb-1 border-b border-[var(--border-main)]">
                <ClipboardList className="w-3.5 h-3.5 text-[#0077b6]" />
                <span className="text-[10.5px] font-bold text-zinc-300 uppercase tracking-wider">Catatan Tambahan</span>
                <span className="text-[10.5px] text-zinc-500 ml-auto">Opsional</span>
              </div>
              <textarea rows={4}
                placeholder="Deskripsi kondisi lapangan, kendala akses jalan, kebutuhan mendesak, atau informasi penting lainnya untuk Pusat Komando..."
                value={form.catatan}
                onChange={e => setField('catatan', e.target.value)}
                className="w-full bg-[var(--bg-card)] border-2 border-[var(--border-subtle)] hover:border-zinc-600 focus:border-[#0077b6] focus:outline-none rounded-xl px-3 py-2.5 text-zinc-200 text-[10.5px] transition-all resize-none font-medium"
              />
            </div>

            {/* Submit */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[10.5px] text-zinc-500 font-mono">
                Laporan diteruskan ke Pusat Komando secara real-time
              </span>
              <button type="submit" disabled={submitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white transition-all disabled:opacity-60 shadow-lg"
                style={{ background: submitting ? '#005f92' : '#0077b6', boxShadow: '0 4px 12px rgba(0,119,182,0.35)' }}>
                {submitting
                  ? <><span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Mengirim...</>
                  : <><Send className="w-3.5 h-3.5" /> Kirim Laporan</>
                }
              </button>
            </div>

          </form>
        )}
      </div>

      {/* ── SECTION 2: 3-col equal grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* COL 1: Jalur Evakuasi */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)]/80 rounded-xl overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-[var(--border-main)] flex items-center gap-2 flex-shrink-0">
              <Navigation className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-white">Jalur Evakuasi</span>
              <span className="ml-auto text-[10.5px] font-mono text-zinc-500 bg-[var(--bg-inner)] px-2 py-0.5 rounded border border-[var(--border-subtle)]">
                {evacRoutesData.length} jalur
              </span>
            </div>
            <div className="p-4 space-y-2 flex-1">
              {evacRoutesData.slice((evacPage-1)*EVAC_PER_PAGE, evacPage*EVAC_PER_PAGE).map(route => {
                const status = route.status as EvacStatus
                const style = EVAC_STYLE[status]
                const meta = evacStatusMeta[status]
                return (
                  <div
                    key={route.id}
                    className="bg-[var(--bg-inner)] rounded-xl px-4 py-3 flex items-center gap-3"
                    style={{ borderLeft: `3px solid ${style.dot}` }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10.5px] font-bold text-zinc-200 truncate">{route.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10.5px] text-zinc-500 font-mono">{route.kelurahan}</span>
                        <span className="text-[10.5px] text-zinc-600 font-mono">
                          {route.path.length} waypoint
                        </span>
                      </div>
                    </div>
                    <span
                      className={`text-[10.5px] font-bold px-2 py-0.5 rounded-md flex-shrink-0 ${style.text}`}
                      style={{ background: style.bg, border: `1px solid ${style.border}` }}
                    >
                      {meta.label}
                    </span>
                  </div>
                )
              })}
            </div>
            <Pagination page={evacPage} total={evacRoutesData.length} perPage={EVAC_PER_PAGE} onChange={setEvacPage} showAlways />
        </div>

        {/* COL 2: Posko Pengungsian */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)]/80 rounded-xl overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-[var(--border-main)] flex items-center gap-2 flex-shrink-0">
              <Home className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-bold text-white">Posko Pengungsian</span>
              <span className="ml-auto text-[10.5px] font-bold text-blue-400">
                {activeShelters.length} Aktif
              </span>
            </div>
            <div className="p-4 space-y-3 flex-1">
              {sheltersData.slice((poskoPage-1)*POSKO_PER_PAGE, poskoPage*POSKO_PER_PAGE).map(shelter => {
                const pct = Math.round((shelter.currentOccupancy / shelter.capacity) * 100)
                const isActive = shelter.status === 'active'
                return (
                  <div key={shelter.id} className="bg-[var(--bg-inner)] rounded-xl px-4 py-3">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex-1 min-w-0">
                        <div className="text-[10.5px] font-bold text-zinc-200 leading-snug">{shelter.name}</div>
                        <div className="text-[10.5px] text-zinc-500 mt-0.5 truncate">{shelter.address}</div>
                      </div>
                      <span className={`text-[10.5px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 border ${
                        isActive ? 'bg-blue-950/50 border-blue-900/50 text-blue-400' : 'bg-zinc-900/50 border-zinc-800/50 text-zinc-500'
                      }`}>
                        {isActive ? 'Aktif' : 'Standby'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10.5px] font-mono mb-1.5">
                      <span className="text-zinc-500">Kapasitas</span>
                      <span className="font-bold text-zinc-300">{shelter.currentOccupancy}<span className="text-zinc-600 font-normal">/{shelter.capacity}</span></span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden mb-2" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <div className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, background: pct > 75 ? '#ef4444' : pct > 40 ? '#f59e0b' : '#3b82f6' }} />
                    </div>
                    {shelter.currentOccupancy > 0 && (
                      <div className="text-[10.5px] text-emerald-400 font-medium">{shelter.currentOccupancy} jiwa tertampung</div>
                    )}
                  </div>
                )
              })}
            </div>
            <Pagination page={poskoPage} total={sheltersData.length} perPage={POSKO_PER_PAGE} onChange={setPoskoPage} />
        </div>

        {/* COL 3: CCTV Lapangan */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)]/80 rounded-xl overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-[var(--border-main)] flex items-center gap-2">
              <Camera className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-bold text-white">CCTV Lapangan</span>
              <div className="ml-auto flex items-center gap-1.5">
                {(['online', 'alert', 'offline'] as CctvStatus[]).map(s => {
                  const count = cctvData.filter(c => c.status === s).length
                  return (
                    <span
                      key={s}
                      className="text-[10.5px] font-bold px-1.5 py-0.5 rounded"
                      style={{ background: ac(CCTV_DOT[s]) + '18', color: ac(CCTV_DOT[s]) }}
                    >
                      {count} {cctvStatusMeta[s].label}
                    </span>
                  )
                })}
              </div>
            </div>
            <div className="p-4 space-y-1.5 flex-1">
              {cctvData.slice((cctvPage-1)*CCTV_PER_PAGE, cctvPage*CCTV_PER_PAGE).map(cam => {
                const status = cam.status as CctvStatus
                const dotColor = CCTV_DOT[status]
                const meta = cctvStatusMeta[status]
                return (
                  <div
                    key={cam.id}
                    className="bg-[var(--bg-inner)] rounded-xl px-4 py-2.5 flex items-center gap-3"
                  >
                    <span
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${status === 'alert' ? 'animate-pulse' : ''}`}
                      style={{ background: dotColor }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-[10.5px] font-semibold text-zinc-200 truncate">{cam.name}</div>
                      <div className="text-[10.5px] text-zinc-500 font-mono truncate">{cam.location}</div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {cam.detections.flooding && (
                        <span className="text-[10.5px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse">
                          BANJIR
                        </span>
                      )}
                      <span
                        className="text-[10.5px] font-bold px-1.5 py-0.5 rounded"
                        style={{ background: ac(dotColor) + '18', color: ac(dotColor) }}
                      >
                        {meta.label}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
            <Pagination page={cctvPage} total={cctvData.length} perPage={CCTV_PER_PAGE} onChange={setCctvPage} />
          </div>

      </div>

      {/* ── SECTION 3: KELURAHAN RISIKO ── */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)]/80 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--border-main)] flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-zinc-400" />
            <span className="text-xs font-bold text-white">Status Risiko Kelurahan per Kecamatan</span>
            <span className="text-[10.5px] font-mono text-zinc-500 bg-[var(--bg-inner)] px-2 py-0.5 rounded border border-[var(--border-subtle)]">
              {filteredKelurahan.length} kelurahan
            </span>
          </div>

          {/* Kecamatan filter dropdown */}
          <div className="relative">
            <button
              onClick={() => setKecDropOpen(!kecDropOpen)}
              className="h-7 px-3 rounded-lg bg-[var(--bg-inner)] border border-[var(--border-subtle)] hover:border-zinc-700 text-[10.5px] font-medium text-zinc-300 flex items-center gap-2 transition-all"
            >
              <span>{filterKecamatan ?? 'Semua Kecamatan'}</span>
              <ChevronDown className="w-3 h-3 text-zinc-500" />
            </button>
            {kecDropOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setKecDropOpen(false)} />
                <div className="absolute right-0 mt-1.5 w-52 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-lg shadow-xl shadow-black/80 py-1.5 z-40">
                  <button
                    onClick={() => { setFilterKecamatan(null); setKecDropOpen(false) }}
                    className="w-full px-3 py-1.5 text-left text-[10.5px] hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors flex items-center justify-between"
                  >
                    <span>Semua Kecamatan</span>
                    {!filterKecamatan && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </button>
                  {kecamatanList.map(kec => (
                    <button
                      key={kec}
                      onClick={() => { setFilterKecamatan(kec); setKecDropOpen(false) }}
                      className="w-full px-3 py-1.5 text-left text-[10.5px] hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors flex items-center justify-between"
                    >
                      <span>{kec}</span>
                      {filterKecamatan === kec && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="p-4">
          {!filterKecamatan ? (
            /* Group view */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(byKecamatan).map(([kec, items]) => {
                const counts = {
                  critical: items.filter(k => k.riskLevel === 'critical').length,
                  high:     items.filter(k => k.riskLevel === 'high').length,
                  medium:   items.filter(k => k.riskLevel === 'medium').length,
                  low:      items.filter(k => k.riskLevel === 'low').length,
                }
                return (
                  <div
                    key={kec}
                    onClick={() => setFilterKecamatan(kec)}
                    className="bg-[var(--bg-inner)] rounded-xl px-4 py-3 cursor-pointer hover:ring-1 hover:ring-[var(--border-subtle)] transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10.5px] font-bold text-zinc-200">{kec}</span>
                      <span className="text-[10.5px] text-zinc-500 font-mono">{items.length} kel</span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {counts.critical > 0 && (
                        <span className="flex items-center gap-1 text-[10.5px] font-bold text-rose-400">
                          <span className="w-2 h-2 rounded-full bg-rose-500" />{counts.critical}
                        </span>
                      )}
                      {counts.high > 0 && (
                        <span className="flex items-center gap-1 text-[10.5px] font-bold text-orange-400">
                          <span className="w-2 h-2 rounded-full bg-orange-500" />{counts.high}
                        </span>
                      )}
                      {counts.medium > 0 && (
                        <span className="flex items-center gap-1 text-[10.5px] font-bold text-amber-400">
                          <span className="w-2 h-2 rounded-full bg-amber-500" />{counts.medium}
                        </span>
                      )}
                      {counts.low > 0 && (
                        <span className="flex items-center gap-1 text-[10.5px] font-bold text-emerald-400">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />{counts.low}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            /* Detail view for selected kecamatan */
            <div>
              <div className="text-[10.5px] text-zinc-500 font-mono mb-3">
                {filteredKelurahan.length} kelurahan di {filterKecamatan}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {filteredKelurahan.map(kel => (
                  <div
                    key={kel.id}
                    className="bg-[var(--bg-inner)] rounded-xl px-4 py-2.5 flex items-center justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-[10.5px] font-semibold text-zinc-200 truncate">{kel.name}</div>
                      <div className="text-[10.5px] text-zinc-600 font-mono">
                        {kel.lat.toFixed(3)}, {kel.lng.toFixed(3)}
                      </div>
                    </div>
                    <span
                      className={`text-[10.5px] font-bold px-2 py-0.5 rounded border flex-shrink-0 ${RISK_STYLE[kel.riskLevel as RiskLevel]}`}
                    >
                      {RISK_LABEL[kel.riskLevel as RiskLevel]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
