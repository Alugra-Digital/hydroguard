import { useEffect, useRef, useState } from 'react'
import { Bot, Globe, History, Plus, Send, Sparkles, Trash2, User, X } from 'lucide-react'
import * as mock from '../mock'
import { cn } from '../utils/cn'

/**
 * Chat AI HydroGuard — dipinjam dari pushhub (web/components/chat-ai.tsx),
 * lingkupnya diganti ke pemantauan banjir.
 *
 * Bedanya dengan pushhub: aplikasi ini belum punya backend, seluruh datanya
 * ada di peramban (src/mock). Jadi alat `baca_data` dijalankan DI SINI, dan
 * yang ada di server cuma proxy tanpa pengetahuan domain (ai/handler.mjs) —
 * satu-satunya alasan proxy itu ada adalah menyembunyikan kunci API.
 *
 * Alatnya hanya MEMBACA: tidak ada jalur mengubah data dari sini.
 *
 * Mengikuti pembaruan pushhub: jawaban boleh berupa grafik (blok ```grafik),
 * dan ada tombol "Internet" yang bergerbang — pencarian luar hanya dijalankan
 * kalau pertanyaannya memang urusan kebencanaan/aplikasi ini.
 */

type Langkah = { nama: string; bytes: number }
type Pesan = { role: string; content: string; langkah?: Langkah[]; tool_calls?: any[]; tool_name?: string }
type Thread = { id: string; title: string; updatedAt: number; messages: Pesan[] }

const CONTOH = [
  'Kelurahan mana yang risikonya paling tinggi?',
  'Buat grafik komposisi status sensor',
  'Sensor apa saja yang statusnya bermasalah?',
  'Ringkas kesiapan pompa dan perahu',
]

/* ---------- alat: baca data aplikasi ---------- */

/** Bagian data yang boleh dibaca AI — selaras dengan menu di sidebar. */
const BAGIAN: Record<string, { nama: string; ambil: () => unknown }> = {
  command_center:      { nama: 'Command Center',      ambil: () => mock.commandCenter },
  sensor_network:      { nama: 'Sensor Network',      ambil: () => mock.sensorNetwork },
  cctv_monitor:        { nama: 'CCTV Monitor',        ambil: () => mock.cctvMonitor },
  alert_management:    { nama: 'Alert Management',    ambil: () => mock.alertManagement },
  resource_management: { nama: 'Resource Management', ambil: () => mock.resourceManagement },
  prediction_analysis: { nama: 'Prediction Analysis', ambil: () => mock.predictionAnalysis },
  incident_history:    { nama: 'Incident History',    ambil: () => mock.incidentHistory },
  executive_view:      { nama: 'Executive View',      ambil: () => mock.executiveView },
  field_coordinator:   { nama: 'Field Coordinator',   ambil: () => mock.fieldCoordinator },
}

const ALAT = [
  {
    type: 'function',
    function: {
      name: 'baca_data',
      description:
        'Baca data HydroGuard untuk satu halaman. Panggil sebanyak yang perlu sebelum menjawab; ' +
        'jangan menebak angka. Balasannya JSON apa adanya.',
      parameters: {
        type: 'object',
        properties: {
          bagian: {
            type: 'string',
            enum: Object.keys(BAGIAN),
            description:
              'command_center: risiko per kelurahan, sensor, cctv, posko, jalur evakuasi, cuaca, alert aktif, personil/pompa/perahu. ' +
              'sensor_network: 30 sensor TMA & curah hujan. cctv_monitor: 20 kamera. ' +
              'alert_management: alert aktif & historis. resource_management: pompa, perahu, personil, posko, logistik. ' +
              'prediction_analysis: prediksi risiko banjir & pemicunya. incident_history: insiden lampau. ' +
              'executive_view: ringkasan level pimpinan. field_coordinator: evakuasi, posko, cctv lapangan.',
          },
        },
        required: ['bagian'],
      },
    },
  },
]

/**
 * Alat kedua, hanya ditawarkan kalau penanya menyalakan tombol "Internet".
 * Lingkupnya dijaga proxy (ai/handler.mjs): kueri di luar urusan kebencanaan
 * ditolak di sana. Isinya cuma hasil pencarian — tidak ada jalur menulis.
 */
const ALAT_WEB = {
  type: 'function',
  function: {
    name: 'cari_internet',
    description:
      'Cari rujukan di internet soal kebencanaan dan banjir (prakiraan cuaca BMKG, prosedur BNPB/BPBD, ' +
      'standar tinggi muka air, teknis sensor & pompa). Balasannya judul + cuplikan + tautan. ' +
      'Bukan untuk data aplikasi ini — itu pakai baca_data.',
    parameters: {
      type: 'object',
      properties: { kueri: { type: 'string', description: 'Kata kunci pencarian, ringkas.' } },
      required: ['kueri'],
    },
  },
}

/** Batas ukuran satu jawaban alat — jendela konteks bukan tempat menampung semuanya. */
const MAX_ISI = 48_000
const MAX_RONDE = 6

/**
 * Hitungan yang sudah dihitung untuk model. Model bahasa tidak bisa menghitung
 * puluhan entri array dengan andal — ditanya "ada berapa sensor" ia menjawab
 * sekenanya. Jadi hitungannya dikerjakan di sini dan disisipkan di atas data.
 * Diambil utuh dari pushhub (api/src/ai.ts).
 */
function hitungan(data: unknown): string | null {
  const hit = new Map<string, number>()
  // Sebaran nilai per field: bahan langsung untuk grafik komposisi ("berapa
  // sensor per status"). Tanpa ini model harus menghitung sendiri dari JSON —
  // persis pekerjaan yang tidak bisa dipercayakan padanya.
  const sebar = new Map<string, Map<string, number>>()
  const naik = (k: string, n: number) => hit.set(k, (hit.get(k) || 0) + n)
  const naikSebar = (k: string, nilai: string) => {
    const m = sebar.get(k) || new Map<string, number>()
    m.set(nilai, (m.get(nilai) || 0) + 1)
    sebar.set(k, m)
  }
  const jalan = (v: any, j: string) => {
    if (Array.isArray(v)) {
      naik(j + '[]', v.length)
      for (const x of v) jalan(x, j + '[]')
    } else if (v && typeof v === 'object') {
      for (const [k, x] of Object.entries(v)) jalan(x, j ? `${j}.${k}` : k)
    } else if (v !== null && v !== undefined && v !== '' && !j.endsWith('[]')) {
      // Nilai pendek di dalam array = kandidat kategori (status, tingkat,
      // kondisi). Yang panjang/angka dilewati: nama sensor bukan kategori.
      if (j.includes('[]') && (typeof v === 'boolean' || (typeof v === 'string' && v.length <= 24)))
        naikSebar(j, String(v))
      naik(j, 1)
    }
  }
  jalan(data, '')
  if (![...hit].some(([k, n]) => k.endsWith('[]') && n >= 5)) return null
  const baris = [...hit]
    .filter(([, n]) => n > 0)
    .slice(0, 60)
    .map(([k, n]) => `  ${k || '(akar)'}: ${n} ${k.endsWith('[]') ? 'entri' : 'terisi'}`)
  // Cuma field yang benar-benar berperan sebagai kategori: lebih dari satu
  // nilai berbeda, tapi tidak sebanyak entrinya (itu tandanya nama).
  const kategori = [...sebar]
    .filter(([, m]) => {
      const total = [...m.values()].reduce((a, n) => a + n, 0)
      return m.size > 1 && m.size <= 12 && m.size * 2 <= total
    })
    .slice(0, 12)
    .map(([k, m]) =>
      `  ${k}: ` + [...m].sort((a, b) => b[1] - a[1]).map(([v, n]) => `${v}=${n}`).join(', '),
    )
  return (
    `Hitungan yang sudah dihitung untukmu — PAKAI angka ini, jangan menghitung entri satu per satu:\n${baris.join('\n')}` +
    (kategori.length ? `\n\nSebaran nilai (siap dipakai sebagai data grafik):\n${kategori.join('\n')}` : '')
  )
}

/** Pencarian web lewat proxy — mesin pencari tidak mengirim header CORS. */
async function cariWeb(kueri: string): Promise<string> {
  try {
    const r = await fetch('/api/cari?q=' + encodeURIComponent(kueri))
    const d = await r.json()
    if (!r.ok) return `Pencarian gagal: ${d?.error || r.status}. Jawab dengan data aplikasi saja.`
    return d.hasil
      ? `Hasil pencarian "${kueri}" (dari internet, bukan data aplikasi ini — sebutkan tautannya saat mengutip):\n${d.hasil}`
      : `Pencarian "${kueri}" tidak mengembalikan hasil yang bisa dibaca.`
  } catch (e: any) {
    return `Pencarian gagal: ${e?.message || 'jaringan'}. Jawab dengan data aplikasi saja.`
  }
}

async function jalankanAlat(namaAlat: string, argsMentah: any, web: boolean): Promise<{ nama: string; isi: string }> {
  let args: any = argsMentah
  if (typeof args === 'string') {
    try { args = JSON.parse(args) } catch { args = {} }
  }
  if (namaAlat === 'cari_internet') {
    const kueri = String(args?.kueri || '').trim()
    if (!web)
      return {
        nama: 'internet: ditolak',
        isi: 'Galat: pencarian internet sedang dimatikan atau pertanyaannya di luar lingkup aplikasi. ' +
             'Jawab dengan data aplikasi saja, dan sebutkan tombol "Internet" kalau memang butuh rujukan luar.',
      }
    if (!kueri) return { nama: 'internet: kosong', isi: 'Galat: kueri pencarian kosong.' }
    return { nama: `internet: ${kueri}`, isi: await cariWeb(kueri) }
  }
  const kunci = String(args?.bagian || '')
  const b = BAGIAN[kunci]
  if (!b)
    return {
      nama: 'bagian tak dikenal',
      isi: `Bagian "${kunci}" tidak ada. Pilih salah satu: ${Object.keys(BAGIAN).join(', ')}.`,
    }
  let teks = JSON.stringify(b.ambil())
  if (teks.length > MAX_ISI) teks = teks.slice(0, MAX_ISI) + '\n…(dipotong)'
  const h = hitungan(b.ambil())
  return { nama: b.nama, isi: (h ? h + '\n\n' : '') + teks }
}

const SISTEM = `Kamu asisten di dalam HydroGuard, sistem pemantauan banjir dan pusat komando
BPBD Jakarta Selatan: risiko per kelurahan, sensor tinggi muka air & curah hujan, kamera CCTV,
peringatan dini, prediksi banjir, posko & jalur evakuasi, sumber daya (pompa, perahu, personil,
logistik), dan riwayat insiden.

Lingkupmu HANYA aplikasi ini dan data banjir di dalamnya. Pertanyaan di luar itu (pengetahuan
umum, menulis kode untuk keperluan lain, obrolan bebas) tolak dengan satu kalimat ramah lalu
tawarkan pertanyaan yang memang bisa kamu jawab.

Jangan pernah menuliskan kode, query, skrip, atau perintah — apa pun bahasanya, untuk keperluan
apa pun. Satu-satunya blok kode yang boleh kamu keluarkan adalah blok grafik di bawah.

Kamu hanya MEMBACA. Tidak ada alat untuk membuat, mengubah, atau menghapus apa pun. Kalau
diminta melakukan perubahan (mengirim peringatan, menugaskan personil, menutup alert), katakan
kamu tidak bisa dan tunjukkan menu tempat orangnya bisa melakukannya sendiri.

Pakai alat baca_data sebelum menyebut angka apa pun — jangan pernah menebak. Kalau satu bagian
tidak cukup, baca bagian lain.

Jawab dalam Bahasa Indonesia, ringkas, pakai markdown bila membantu. Untuk daftar berkolom pakai
tabel markdown (| Kolom | Kolom | lalu |---|---|) — dirender jadi tabel sungguhan di layar.
Daftar satu kolom cukup butir biasa.

Sebut MENU-nya, bukan nama teknis data: "menu Sensor Network", "halaman Alert Management",
"peta di Command Center". Jangan menjelaskan bahwa kamu memakai alat atau dari mana data diambil —
cukup jawabannya.

Kalau penanya menyebut grafik, chart, diagram, atau visual, JAWAB DENGAN GRAFIK — jangan menolak.
Bahan angkanya ada di blok "Sebaran nilai" pada jawaban alat; kalau belum cukup, hitung dari daftar
yang kamu baca — tetapi jangan mengarang. Bentuknya blok kode berlabel grafik, isinya JSON:

\`\`\`grafik
{"tipe":"donat","judul":"Status sensor","data":[{"label":"normal","nilai":22},{"label":"siaga","nilai":6}]}
\`\`\`

tipe: "batang" (perbandingan antar nama), "donat" (komposisi dari satu total), "area" (deret
berurut, mis. ketinggian air per jam — urut dari lama ke baru). Maksimum 12 titik data, nilai harus
angka, dan angkanya WAJIB dari data yang kamu baca. Beri satu kalimat penjelasan di luar blok;
jangan mengulang seluruh angkanya sebagai daftar kalau sudah ada grafiknya.`

/** Ditempel ke SISTEM saat tombol internet menyala dan pertanyaannya relevan. */
const TAMBAHAN_WEB = `

Penanya menyalakan pencarian internet, jadi kamu punya alat kedua: cari_internet. Pakai untuk
rujukan luar (prakiraan cuaca, prosedur BNPB/BPBD, standar teknis, dokumentasi alat). Data lapangan
tetap dari baca_data — jangan pernah mengambil angka atau nama dari hasil pencarian. Sebutkan tautan
sumber saat mengutip hasil internet, dan bedakan dengan jelas mana data aplikasi ini dan mana yang
dari luar.`

/* ---------- perender markdown (dari pushhub, termasuk blok grafik) ---------- */

function Markdown({ isi }: { isi: string }) {
  const bagian = isi.split(/```/)
  return (
    <div className="space-y-2 text-sm leading-relaxed">
      {bagian.map((b, i) =>
        i % 2 === 1 ? (
          /^grafik\b/.test(b.trim()) ? (
            <GrafikBlok key={i} isi={b.replace(/^\s*grafik\s*/, '')} />
          ) : (
            // Selain grafik, blok kode tidak pernah jadi jawaban yang sah di sini:
            // dibujuk menuliskan query atau skrip, hasilnya berhenti di layar.
            <p key={i} className="rounded-md bg-[var(--bg-inner)] p-3 text-xs text-zinc-500">
              (cuplikan kode dilewati — saya hanya menjawab soal data HydroGuard)
            </p>
          )
        ) : (
          <Teks key={i} isi={b} />
        ),
      )}
    </div>
  )
}

/* ---------- grafik ---------- */

type Titik = { label: string; nilai: number }

/** Mulai dari biru HydroGuard, lalu warna yang jelas berbeda — dua nada biru
 *  berdampingan tidak terbaca sebagai dua kategori di donat kecil. */
const WARNA = ['#0ea5e9', '#6366f1', '#22d3ee', '#f59e0b', '#14b8a6', '#f43f5e']

const rapi = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1))

/** Batang mendatar berperingkat — perbandingan antar nama. */
function Batang({ data }: { data: Titik[] }) {
  const maks = Math.max(...data.map((d) => d.nilai), 1)
  return (
    <div className="space-y-1.5">
      {data.map((d, i) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <span className="w-28 shrink-0 truncate text-zinc-400" title={d.label}>{d.label}</span>
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[var(--bg-inner)]">
            <div
              className="h-full rounded-full"
              style={{ width: `${Math.max((d.nilai / maks) * 100, 2)}%`, background: WARNA[i % WARNA.length] }}
            />
          </div>
          <span className="w-10 shrink-0 text-right tabular-nums text-zinc-300">{rapi(d.nilai)}</span>
        </div>
      ))}
    </div>
  )
}

/** Donat komposisi: satu lingkaran, segmennya stroke-dasharray. */
function Donat({ data, satuan }: { data: Titik[]; satuan?: string }) {
  const total = data.reduce((a, d) => a + d.nilai, 0) || 1
  const K = 2 * Math.PI * 40
  // Offset tiap segmen dihitung sekali di sini; menjumlahkannya sambil merender
  // (let mulai += …) bikin hasilnya bergantung urutan render.
  const mulai = data.map((_, i) => data.slice(0, i).reduce((a, d) => a + (d.nilai / total) * K, 0))
  return (
    <div className="flex flex-wrap items-center gap-5">
      <svg viewBox="0 0 100 100" className="h-36 w-36 shrink-0 -rotate-90">
        {data.map((d, i) => {
          const panjang = (d.nilai / total) * K
          return (
            <circle
              key={i}
              cx="50" cy="50" r="40" fill="none"
              stroke={WARNA[i % WARNA.length]}
              strokeWidth="14"
              strokeDasharray={`${panjang} ${K - panjang}`}
              strokeDashoffset={-mulai[i]}
            />
          )
        })}
      </svg>
      <div className="space-y-1 text-xs">
        <p className="mb-1.5 font-semibold text-white">
          {rapi(total)} <span className="font-normal text-zinc-500">{satuan || 'total'}</span>
        </p>
        {data.map((d, i) => (
          <p key={i} className="flex items-center gap-2 text-zinc-400">
            <span className="h-2 w-2 shrink-0 rounded-sm" style={{ background: WARNA[i % WARNA.length] }} />
            <span className="truncate">{d.label}</span>
            <span className="tabular-nums text-zinc-300">{rapi(d.nilai)}</span>
            <span className="text-zinc-600">{Math.round((d.nilai / total) * 100)}%</span>
          </p>
        ))}
      </div>
    </div>
  )
}

/** Deret berurut. Titiknya dinormalkan ke kotak 100×40. */
function Area({ data }: { data: Titik[] }) {
  const maks = Math.max(...data.map((d) => d.nilai), 1)
  const x = (i: number) => (data.length === 1 ? 50 : (i / (data.length - 1)) * 100)
  const y = (n: number) => 38 - (n / maks) * 34
  const garis = data.map((d, i) => `${x(i)},${y(d.nilai)}`).join(' ')
  return (
    <div>
      <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="h-28 w-full">
        <polygon points={`0,40 ${garis} 100,40`} fill="#0ea5e9" opacity="0.18" />
        <polyline points={garis} fill="none" stroke="#38bdf8" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="flex justify-between text-[10px] text-zinc-600">
        <span>{data[0]?.label}</span>
        <span className="text-zinc-400">puncak {rapi(maks)}</span>
        <span>{data[data.length - 1]?.label}</span>
      </div>
    </div>
  )
}

/**
 * Blok ```grafik dari model: {tipe, judul, satuan, data:[{label,nilai}]}.
 * Divalidasi di sini — JSON dari model bisa apa saja, dan grafik yang separuh
 * benar lebih menyesatkan daripada tidak ada grafik. Gagal validasi = mentahnya.
 */
function GrafikBlok({ isi }: { isi: string }) {
  let spek: any
  try { spek = JSON.parse(isi) } catch { spek = null }
  const data: Titik[] = Array.isArray(spek?.data)
    ? spek.data
        .filter((d: any) => d && typeof d.label === 'string' && Number.isFinite(Number(d.nilai)))
        .slice(0, 12)
        .map((d: any) => ({ label: String(d.label), nilai: Number(d.nilai) }))
    : []

  if (!data.length)
    return (
      <pre className="overflow-x-auto rounded-md bg-[var(--bg-inner)] p-3 font-mono text-xs">{isi.trim()}</pre>
    )

  const tipe = spek.tipe === 'donat' || spek.tipe === 'area' ? spek.tipe : 'batang'
  return (
    <div className="my-2 rounded-md border border-[var(--border-subtle)] p-3">
      {typeof spek.judul === 'string' && spek.judul && (
        <p className="mb-2.5 text-xs font-medium text-white">{spek.judul}</p>
      )}
      {tipe === 'donat' ? (
        <Donat data={data} satuan={typeof spek.satuan === 'string' ? spek.satuan : undefined} />
      ) : tipe === 'area' ? (
        <Area data={data} />
      ) : (
        <Batang data={data} />
      )}
    </div>
  )
}

const adalahBarisTabel = (l: string) => /^\s*\|.*\|\s*$/.test(l)
const sel = (l: string) => l.trim().replace(/^\||\|$/g, '').split('|').map((s) => s.trim())
/** Baris pemisah header: `|---|:--:|` — tidak ikut dirender. */
const adalahPemisah = (l: string) => adalahBarisTabel(l) && sel(l).every((s) => /^:?-{2,}:?$/.test(s))

function Teks({ isi }: { isi: string }) {
  const baris = isi.split('\n')
  const keluar: React.ReactNode[] = []
  for (let i = 0; i < baris.length; i++) {
    if (adalahBarisTabel(baris[i])) {
      const blok: string[] = []
      while (i < baris.length && adalahBarisTabel(baris[i])) blok.push(baris[i++])
      i--
      keluar.push(<Tabel key={keluar.length} baris={blok.filter((l) => !adalahPemisah(l))} />)
      continue
    }
    const b = baris[i]
    if (!b.trim()) continue
    const daftar = /^\s*([-*]|\d+\.)\s+/.test(b)
    const judul = b.match(/^(#{1,4})\s+(.*)/)
    const teks = judul ? judul[2] : b.replace(/^\s*([-*]|\d+\.)\s+/, '')
    keluar.push(
      <p
        key={keluar.length}
        className={cn(
          judul && 'font-semibold text-white',
          daftar && "pl-4 before:mr-1.5 before:text-zinc-600 before:content-['•']",
        )}
      >
        {sisip(teks)}
      </p>,
    )
  }
  return <div className="space-y-1">{keluar}</div>
}

function Tabel({ baris }: { baris: string[] }) {
  if (!baris.length) return null
  const [kepala, ...isi] = baris.map(sel)
  return (
    <div className="my-2 overflow-x-auto rounded-md border border-[var(--border-subtle)]">
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr className="bg-[var(--bg-inner)]">
            {kepala.map((h, i) => (
              <th key={i} className="whitespace-nowrap px-2.5 py-1.5 text-left font-medium text-zinc-300">
                {sisip(h)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isi.map((r, i) => (
            <tr key={i} className="border-t border-[var(--border-subtle)]">
              {r.map((c, j) => (
                <td key={j} className="px-2.5 py-1.5 align-top">{sisip(c)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** `**tebal**` dan `` `kode` `` di dalam satu baris. */
function sisip(teks: string) {
  return teks.split(/(\*\*[^*]+\*\*|`[^`]+`)/).map((t, i) =>
    t.startsWith('**') ? (
      <strong key={i} className="font-semibold text-white">{t.slice(2, -2)}</strong>
    ) : t.startsWith('`') ? (
      <code key={i} className="rounded bg-[var(--bg-inner)] px-1 py-0.5 font-mono text-[12px]">{t.slice(1, -1)}</code>
    ) : (
      <span key={i}>{t}</span>
    ),
  )
}

/* ---------- ingatan: localStorage, karena tidak ada backend ---------- */

const SIMPANAN = 'hg_chat_threads'
const MAX_THREAD = 30
/** Jawaban lampau dipangkas sebelum dikirim ulang — yang dibutuhkan ingatan cuma topiknya. */
const MAX_LAMPAU = 800
const INGAT = 20

const muatThreads = (): Thread[] => {
  try { return JSON.parse(localStorage.getItem(SIMPANAN) || '[]') } catch { return [] }
}
const simpanThreads = (t: Thread[]) => {
  try { localStorage.setItem(SIMPANAN, JSON.stringify(t.slice(0, MAX_THREAD))) } catch { /* penuh/diblokir */ }
}
/** Dibungkus di ruang lingkup modul: react-hooks/purity menandai Date.now()
 *  di badan komponen sebagai tak-murni, padahal ini dipanggil dari event
 *  handler (setelah jawaban model tiba), bukan saat render. */
const sekarang = () => Date.now()

const judulDari = (p: string) => {
  const s = p.replace(/\s+/g, ' ').trim()
  return (s.length > 60 ? s.slice(0, 57) + '…' : s) || 'Tanpa judul'
}

/* ---------- widget ---------- */

export default function ChatAI() {
  const [buka, setBuka] = useState(false)
  const [status, setStatus] = useState<{ siap: boolean; model: string } | null>(null)
  const [threads, setThreads] = useState<Thread[]>(muatThreads)
  const [threadId, setThreadId] = useState<string | null>(null)
  const [pesan, setPesan] = useState<Pesan[]>([])
  const [teks, setTeks] = useState('')
  const [internet, setInternet] = useState(false)
  const [kirim, setKirim] = useState(false)
  const [galat, setGalat] = useState<string | null>(null)
  const bawah = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!buka || status) return
    fetch('/api/chat/status')
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => setStatus({ siap: false, model: '' }))
  }, [buka, status])

  useEffect(() => { bawah.current?.scrollIntoView({ behavior: 'smooth' }) }, [pesan, kirim])

  useEffect(() => {
    if (!buka) return
    const tombol = (e: KeyboardEvent) => e.key === 'Escape' && setBuka(false)
    window.addEventListener('keydown', tombol)
    return () => window.removeEventListener('keydown', tombol)
  }, [buka])

  function baru() {
    setThreadId(null)
    setPesan([])
    setGalat(null)
  }

  function hapus(id: string) {
    const sisa = threads.filter((t) => t.id !== id)
    setThreads(sisa)
    simpanThreads(sisa)
    if (id === threadId) baru()
  }

  /** Satu panggilan ke model lewat proxy. */
  async function model(messages: Pesan[], alat: unknown[] | null): Promise<Pesan> {
    const r = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ messages, tools: alat ?? undefined }),
    })
    const d = await r.json()
    if (!r.ok) throw new Error(d?.error || `gagal (${r.status})`)
    return { role: 'assistant', content: d.message?.content || '', tool_calls: d.message?.tool_calls }
  }

  async function tanya(isi: string) {
    const t = isi.trim()
    if (!t || kirim) return
    setTeks('')
    setGalat(null)
    const setelahTanya = [...pesan, { role: 'user', content: t }]
    setPesan(setelahTanya)
    setKirim(true)

    try {
      // Riwayat yang dikirim ulang: dipangkas dulu, jawaban terakhir dibiarkan
      // utuh (itu yang paling sering dirujuk pertanyaan lanjutan).
      const potong = setelahTanya.slice(-INGAT)
      const iAkhir = potong.map((m) => m.role).lastIndexOf('assistant')
      const riwayat: Pesan[] = potong.map((m, i) =>
        m.role === 'assistant' && i !== iAkhir && m.content.length > MAX_LAMPAU
          ? { role: m.role, content: m.content.slice(0, MAX_LAMPAU) + '\n…(jawaban lama dipotong)' }
          : { role: m.role, content: m.content },
      )

      // Gerbang lingkup ada di proxy (ai/handler.mjs), bukan di sini: kode
      // peramban bisa dilewati lewat devtools, proxy tidak.
      const web = internet
      const alat = web ? [...ALAT, ALAT_WEB] : ALAT
      const percakapan: Pesan[] = [
        { role: 'system', content: SISTEM + (web ? TAMBAHAN_WEB : '') },
        ...riwayat,
      ]
      const langkah: Langkah[] = []
      let jawab: Pesan | null = null

      for (let ronde = 0; ronde < MAX_RONDE; ronde++) {
        // Ronde terakhir tanpa alat: kalau alat masih ditawarkan, model memilih
        // membaca lagi alih-alih menjawab dengan yang sudah ia punya.
        const m = await model(percakapan, ronde === MAX_RONDE - 1 ? null : alat)
        if (!m.tool_calls?.length) { jawab = m; break }
        percakapan.push(m)
        for (const c of m.tool_calls) {
          const namaAlat = c?.function?.name || 'baca_data'
          const { nama, isi: hasil } = await jalankanAlat(namaAlat, c?.function?.arguments, web)
          langkah.push({ nama, bytes: hasil.length })
          percakapan.push({ role: 'tool', tool_name: namaAlat, content: hasil })
        }
      }
      if (!jawab) jawab = await model(percakapan, null)

      const akhir = [...setelahTanya, { ...jawab, langkah }]
      setPesan(akhir)

      const id = threadId ?? String(sekarang())
      setThreadId(id)
      const lain = threads.filter((x) => x.id !== id)
      const daftar = [
        { id, title: threads.find((x) => x.id === id)?.title ?? judulDari(t), updatedAt: sekarang(), messages: akhir },
        ...lain,
      ]
      setThreads(daftar)
      simpanThreads(daftar)
    } catch (e: any) {
      setGalat(e?.message || 'gagal mengirim')
    } finally {
      setKirim(false)
    }
  }

  if (!buka)
    return (
      <div className="bergoyang fixed bottom-5 right-5 z-40 w-56 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] p-3 shadow-lg shadow-black/40">
        <p className="flex items-center gap-1.5 text-sm font-semibold text-white">
          <Sparkles className="h-4 w-4 text-[#0077b6]" /> HydroGuard AI
        </p>
        <p className="mt-1 text-[11px] leading-snug text-zinc-500">
          Tanya soal sensor, prediksi banjir, posko, dan sumber daya.
        </p>
        <button
          onClick={() => setBuka(true)}
          className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#0077b6] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#005f92]"
        >
          <Bot className="h-3.5 w-3.5" /> Chat with AI
        </button>
      </div>
    )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setBuka(false)}>
      <div
        role="dialog"
        aria-label="HydroGuard AI"
        onClick={(e) => e.stopPropagation()}
        className="flex h-[min(44rem,calc(100vh-3rem))] w-[min(64rem,100%)] overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-2xl"
      >
        {/* Riwayat disimpan di peramban ini saja — belum ada backend. */}
        <aside className="hidden w-60 shrink-0 flex-col border-r border-[var(--border-subtle)] bg-[var(--bg-inner)] md:flex">
          <div className="flex items-center gap-2 px-3 py-3">
            <Sparkles className="h-4 w-4 shrink-0 text-[#0077b6]" />
            <p className="min-w-0 flex-1 truncate text-sm font-semibold text-white">HydroGuard AI</p>
          </div>
          <div className="px-3 pb-2">
            <button
              onClick={baru}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#0077b6] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#005f92]"
            >
              <Plus className="h-3.5 w-3.5" /> Percakapan baru
            </button>
          </div>
          <p className="flex items-center gap-1.5 px-3 pb-1 pt-2 text-[11px] font-medium uppercase tracking-wide text-zinc-500">
            <History className="h-3 w-3" /> Riwayat
          </p>
          <div className="flex-1 overflow-y-auto p-1.5">
            {threads.length === 0 && <p className="px-2 py-1 text-xs text-zinc-600">belum ada percakapan</p>}
            {threads.map((t) => (
              <div
                key={t.id}
                className={cn(
                  'group flex items-center gap-1 rounded-md px-2 py-1.5 hover:bg-zinc-900/40',
                  t.id === threadId && 'bg-zinc-800/40',
                )}
              >
                <button
                  onClick={() => { setThreadId(t.id); setPesan(t.messages); setGalat(null) }}
                  className="min-w-0 flex-1 truncate text-left text-xs text-zinc-300"
                  title={t.title}
                >
                  {t.title}
                </button>
                <button
                  onClick={() => hapus(t.id)}
                  className="text-zinc-600 opacity-0 transition-opacity group-hover:opacity-100 hover:text-rose-400"
                  aria-label="hapus percakapan"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-1.5 border-b border-[var(--border-subtle)] px-4 py-2.5">
            <Sparkles className="h-4 w-4 text-[#0077b6] md:hidden" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold leading-tight text-white">
                {threads.find((t) => t.id === threadId)?.title || 'Percakapan baru'}
              </p>
              <p className="truncate text-[11px] text-zinc-500">
                hanya membaca data HydroGuard{status?.model ? ` — ${status.model}` : ''}
              </p>
            </div>
            <button onClick={baru} title="Percakapan baru" aria-label="percakapan baru" className="p-1 text-zinc-500 hover:text-zinc-300 md:hidden">
              <Plus className="h-4 w-4" />
            </button>
            <button onClick={() => setBuka(false)} title="Tutup" aria-label="tutup" className="p-1 text-zinc-500 hover:text-zinc-300">
              <X className="h-4 w-4" />
            </button>
          </div>

          {status && !status.siap && (
            <p className="border-b border-[var(--border-subtle)] bg-[var(--bg-inner)] px-4 py-2 text-[11px] text-zinc-500">
              Chat AI belum aktif: isi <code className="font-mono">OLLAMA_API_KEY</code> di{' '}
              <code className="font-mono">.env</code>, lalu jalankan ulang servernya.
            </p>
          )}

          <div className="flex-1 space-y-3.5 overflow-y-auto p-4">
            {pesan.length === 0 && !kirim && (
              <div className="space-y-2 py-6 text-center">
                <Bot className="mx-auto h-6 w-6 text-zinc-600" />
                <p className="text-xs text-zinc-500">
                  Jawabannya dibaca langsung dari data HydroGuard. AI di sini hanya membaca —
                  tidak mengubah apa pun. Tombol <Globe className="inline h-3 w-3 align-[-1px]" />{' '}
                  menambahkan rujukan dari internet, hanya untuk pertanyaan yang memang soal
                  kebencanaan atau aplikasi ini.
                </p>
                <div className="flex flex-wrap justify-center gap-2 pt-1">
                  {CONTOH.map((c) => (
                    <button
                      key={c}
                      onClick={() => tanya(c)}
                      disabled={!status?.siap}
                      className="rounded-full border border-[var(--border-medium)] px-3 py-1.5 text-xs text-zinc-500 transition-colors hover:border-[#0077b6]/50 hover:text-zinc-300 disabled:opacity-40"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {pesan.map((m, i) => (
              <div key={i} className="flex gap-2">
                <div className="mt-0.5 shrink-0 text-zinc-500">
                  {m.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div className="min-w-0 flex-1">
                  {m.role === 'user' ? (
                    <p className="whitespace-pre-wrap text-sm text-zinc-200">{m.content}</p>
                  ) : (
                    <Markdown isi={m.content} />
                  )}
                  {!!m.langkah?.length && (
                    <p className="mt-1.5 flex flex-wrap gap-1.5 text-[11px] text-zinc-600">
                      {/* Sebutan menu, bukan nama berkas data. */}
                      {m.langkah.map((l, j) => (
                        <span key={j} className="rounded bg-[var(--bg-inner)] px-1.5 py-0.5">{l.nama}</span>
                      ))}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {kirim && (
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <Bot className="h-4 w-4" />
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-zinc-600 border-t-transparent" />
                membaca data HydroGuard…
              </div>
            )}
            {galat && <p className="text-xs text-rose-400">{galat}</p>}
            <div ref={bawah} />
          </div>

          <div className="flex items-end gap-2 border-t border-[var(--border-subtle)] p-3">
            {/* Internet menyala pun, kueri di luar lingkup ditolak proxy
                (ai/handler.mjs) — gerbangnya kode, bukan model. */}
            <button
              type="button"
              onClick={() => setInternet((v) => !v)}
              aria-pressed={internet}
              title={
                internet
                  ? 'Internet: menyala — rujukan luar boleh dicari, selama pertanyaannya soal kebencanaan atau aplikasi ini'
                  : 'Internet: mati — hanya data HydroGuard'
              }
              className={cn(
                'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors',
                internet
                  ? 'border-[#0077b6]/60 bg-[#0077b6]/10 text-[#38bdf8]'
                  : 'border-[var(--border-medium)] text-zinc-500 hover:text-zinc-300',
              )}
            >
              <Globe className="h-4 w-4" />
            </button>
            <textarea
              value={teks}
              onChange={(e) => setTeks(e.target.value)}
              onKeyDown={(e) => {
                // Enter mengirim; Shift+Enter baris baru.
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); tanya(teks) }
              }}
              rows={1}
              disabled={!status?.siap || kirim}
              placeholder={internet ? 'Tanya — rujukan luar ikut dicari…' : 'Tanya soal sensor, prediksi banjir, posko, atau sumber daya…'}
              className="max-h-28 min-h-9 flex-1 resize-none rounded-lg border border-[var(--border-medium)] bg-[var(--bg-inner)] px-3 py-2 text-sm text-white outline-none focus:border-[#0077b6] disabled:opacity-50"
            />
            <button
              onClick={() => tanya(teks)}
              disabled={!status?.siap || kirim || !teks.trim()}
              aria-label="kirim"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0077b6] text-white transition-colors hover:bg-[#005f92] disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
