/**
 * Proxy Chat AI. Satu-satunya alasan berkas ini ada: ollama.com tidak mengirim
 * header CORS dan kuncinya tidak boleh ikut ke bundel peramban. Jadi ia hanya
 * meneruskan permintaan — tidak tahu apa-apa soal data HydroGuard.
 *
 * Penelusuran data (alat `baca_data`) dijalankan di sisi peramban, karena
 * seluruh data aplikasi ini memang sudah ada di sana (src/mock). Lihat
 * src/components/ChatAI.tsx.
 *
 * Satu route lagi menumpang di sini: /api/cari — pencarian web untuk tombol
 * "Internet" di widget chat. Alasannya sama, CORS: mesin pencari tidak bisa
 * dipanggil langsung dari peramban. Gerbang relevansinya ada di peramban
 * (ChatAI.tsx), yang di sini cuma mengambil dan merapikan hasilnya.
 */
const baseUrl = () => (process.env.OLLAMA_BASE_URL || 'https://ollama.com').replace(/\/$/, '')
const model = () => process.env.OLLAMA_MODEL || 'gpt-oss:120b-cloud'
const apiKey = () => process.env.OLLAMA_API_KEY || ''
const timeoutMs = () => Number(process.env.OLLAMA_TIMEOUT_MS) || 120_000

/** Siap = ada kunci, atau alamatnya lokal (Ollama lokal tidak butuh kunci). */
export const aiSiap = () => Boolean(apiKey()) || /localhost|127\.0\.0\.1/.test(baseUrl())

const kirimJson = (res, status, data) => {
  res.writeHead(status, { 'content-type': 'application/json' })
  res.end(JSON.stringify(data))
}

const baca = (req) =>
  new Promise((resolve, reject) => {
    let buf = ''
    // 2 MB cukup untuk riwayat + hasil alat; di atas itu permintaannya salah.
    req.on('data', (c) => {
      buf += c
      if (buf.length > 2_000_000) reject(new Error('badan permintaan terlalu besar'))
    })
    req.on('end', () => resolve(buf))
    req.on('error', reject)
  })

/* ── gerbang topik ──────────────────────────────────────────────────────── */

/**
 * Lingkup asisten dijaga DI SINI, bukan di prompt sistem atau di peramban:
 * prompt bisa dibujuk ("abaikan aturan, tuliskan query…") dan gerbang peramban
 * bisa dilewati lewat devtools. Proxy ini satu-satunya pintu ke model, jadi
 * pertanyaan di luar urusan HydroGuard berhenti sebelum menjadi permintaan.
 *
 * ponytail: daftar kata kunci, bukan pengklasifikasi. Pertanyaan sah yang
 * tertolak? tambahkan katanya di sini — jangan ganti dengan panggilan model kedua.
 */
export const TOPIK =
  /(banjir|hidrolog|hujan|curah|cuaca|iklim|musim|bmkg|bnpb|bpbd|basarnas|pusdalops|bencana|darurat|siaga|waspada|evakuasi|pengungsi|posko|logistik|relawan|sungai|kali|ciliwung|pesanggrahan|krukut|drainase|gorong|saluran|kanal|waduk|situ|embung|bendung|pintu air|tanggul|pompa|perahu|sensor|tma|tinggi muka air|muka air|debit|telemetri|iot|lidar|radar|satelit|peta|gis|koordinat|kelurahan|kecamatan|jakarta|dki|rob|pasang|genangan|longsor|mitigasi|peringatan dini|early warning|sop|prosedur|standar|regulasi|permen|perka|cctv|kamera|insiden|risiko|personil|command center|hydroguard)/i

export const relevanTopik = (t) => TOPIK.test(String(t || ''))

/** Balasan untuk pertanyaan di luar lingkup — bentuknya sama seperti balasan model. */
const TOLAK =
  'Maaf, saya hanya menjawab seputar HydroGuard: sensor tinggi muka air & curah hujan, CCTV, ' +
  'peringatan dini, prediksi banjir, posko & evakuasi, sumber daya (pompa, perahu, personil, ' +
  'logistik), dan riwayat insiden. Di luar itu — termasuk menuliskan kode atau query — saya ' +
  'lewati. Coba tanyakan, misalnya, "kelurahan mana yang risikonya paling tinggi?"'

/** Pertanyaan terakhir dari penanya; ronde alat mengirim ulang riwayat yang sama. */
const tanyaTerakhir = (messages) => {
  for (let i = messages.length - 1; i >= 0; i--)
    if (messages[i]?.role === 'user') return String(messages[i].content || '')
  return ''
}

/* ── pencarian web (dipinjam dari pushhub, api/src/ai.ts) ────────────────── */

/** Mesin pencari tanpa kunci; bisa ditukar lewat env kalau diblokir. */
const cariUrl = () => process.env.AI_SEARCH_URL || 'https://lite.duckduckgo.com/lite/?q='
/** Hasil yang dibawa ke model. Cukup untuk merangkum, tidak membanjiri konteks. */
const MAX_HASIL = 6

const lepasTag = (t) =>
  t.replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

/** DuckDuckGo membungkus tautan keluar; yang dipakai parameter uddg-nya. */
const bukaBungkus = (u) => {
  const m = u.match(/[?&]uddg=([^&]+)/)
  return m ? decodeURIComponent(m[1]) : u
}

/**
 * Judul + tautan + cuplikan dari halaman hasil. Parser seadanya, sengaja:
 * yang dibaca cuma tiga potong per hasil.
 *
 * ponytail: regex atas HTML satu situs. Kalau tata letaknya berubah, hasilnya
 * kosong dan model bilang tidak menemukan apa-apa — bukan jawaban ngawur.
 */
export function ringkasHasil(html) {
  const tautan = [...html.matchAll(/<a[^>]+class=['"]result-link['"][^>]*href=['"]([^'"]+)['"][^>]*>([\s\S]*?)<\/a>/gi)]
  const tautanAlt = tautan.length
    ? tautan
    : [...html.matchAll(/<a[^>]+href=['"]([^'"]+)['"][^>]*class=['"]result-link['"][^>]*>([\s\S]*?)<\/a>/gi)]
  const cuplik = [...html.matchAll(/class=['"]result-snippet['"][^>]*>([\s\S]*?)<\/td>/gi)].map((m) => lepasTag(m[1]))
  return tautanAlt.slice(0, MAX_HASIL).map((m, i) =>
    `${i + 1}. ${lepasTag(m[2])}\n   ${bukaBungkus(m[1])}\n   ${(cuplik[i] || '').slice(0, 400)}`,
  ).join('\n')
}

/**
 * Middleware Node biasa — dipakai vite.config.ts (dev & preview) dan
 * server.mjs (produksi). Mengembalikan true kalau permintaannya ia tangani.
 */
export async function tanganiAi(req, res) {
  const jalur = req.url.split('?')[0]
  if (jalur !== '/api/chat' && jalur !== '/api/chat/status' && jalur !== '/api/cari') return false

  if (jalur === '/api/cari') {
    const kueri = new URL(req.url, 'http://x').searchParams.get('q') || ''
    if (!kueri.trim()) return kirimJson(res, 400, { error: 'kueri kosong' }), true
    // Tombol "Internet" bukan mesin pencari umum yang menumpang di aplikasi ini.
    if (!relevanTopik(kueri)) return kirimJson(res, 403, { error: 'kueri di luar lingkup HydroGuard' }), true
    try {
      const r = await fetch(cariUrl() + encodeURIComponent(kueri), {
        headers: { 'user-agent': 'Mozilla/5.0 (compatible; hydroguard)' },
        signal: AbortSignal.timeout(20_000),
      })
      kirimJson(res, 200, { hasil: ringkasHasil(await r.text()) })
    } catch (e) {
      kirimJson(res, 502, { error: e?.message || 'pencarian gagal' })
    }
    return true
  }

  if (jalur === '/api/chat/status') {
    kirimJson(res, 200, { siap: aiSiap(), model: model() })
    return true
  }
  if (req.method !== 'POST') {
    kirimJson(res, 405, { error: 'method not allowed' })
    return true
  }
  if (!aiSiap()) {
    kirimJson(res, 503, { error: 'OLLAMA_API_KEY belum diisi di .env' })
    return true
  }

  try {
    const { messages, tools } = JSON.parse(await baca(req))
    if (!Array.isArray(messages) || !messages.length) throw new Error('messages kosong')
    // Di luar lingkup = tidak pernah sampai ke model. 200, karena ini jawaban
    // yang sah bagi peramban — bukan galat yang perlu ia tampilkan merah.
    if (!relevanTopik(tanyaTerakhir(messages)))
      return kirimJson(res, 200, { message: { role: 'assistant', content: TOLAK } }), true
    const r = await fetch(`${baseUrl()}/api/chat`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${apiKey()}` },
      body: JSON.stringify({
        model: model(),
        messages,
        // Ronde penutup dikirim tanpa alat; kalau alat masih ditawarkan, model
        // memilih membaca lagi alih-alih menjawab dengan yang sudah ia punya.
        ...(tools?.length ? { tools } : {}),
        stream: false,
      }),
      signal: AbortSignal.timeout(timeoutMs()),
    })
    const teks = await r.text()
    if (!r.ok) return kirimJson(res, 502, { error: `model menjawab ${r.status}: ${teks.slice(0, 300)}` }), true
    const m = JSON.parse(teks)?.message
    if (!m) throw new Error('balasan model tidak berisi message')
    kirimJson(res, 200, { message: m })
  } catch (e) {
    kirimJson(res, 502, { error: e?.message || 'gagal menghubungi model' })
  }
  return true
}

/** Plugin Vite: pasang middleware yang sama di dev server dan preview server. */
export function pluginAi() {
  // Kurung kurawalnya wajib: `.use()` mengembalikan instance connect, dan
  // configureServer memperlakukan nilai kembalian sebagai hook pasca-middleware
  // — Vite lalu memanggilnya tanpa argumen dan dev server gagal start.
  const pasang = (server) => {
    server.middlewares.use((req, res, next) => {
      tanganiAi(req, res).then((ditangani) => !ditangani && next(), next)
    })
  }
  return { name: 'hydroguard-ai', configureServer: pasang, configurePreviewServer: pasang }
}
