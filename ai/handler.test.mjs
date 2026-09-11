/**
 * Cek mandiri proxy Chat AI — `node ai/handler.test.mjs`. Yang dijaga: gerbang
 * kunci (tanpa OLLAMA_API_KEY jangan sampai ada permintaan keluar) dan route
 * yang bukan miliknya harus diteruskan ke penanganan berikutnya. Tidak
 * menyentuh jaringan.
 */
import assert from 'node:assert'
import { tanganiAi, aiSiap, ringkasHasil, relevanTopik } from './handler.mjs'

const palsu = () => {
  const res = { status: 0, body: '' }
  res.writeHead = (s) => { res.status = s }
  res.end = (b) => { res.body = b }
  return res
}

delete process.env.OLLAMA_API_KEY
process.env.OLLAMA_BASE_URL = 'https://ollama.com'
assert.equal(aiSiap(), false, 'tanpa kunci & bukan lokal = belum siap')

let res = palsu()
assert.equal(await tanganiAi({ url: '/api/chat/status', method: 'GET' }, res), true)
assert.deepEqual(JSON.parse(res.body).siap, false)

res = palsu()
await tanganiAi({ url: '/api/chat', method: 'POST' }, res)
assert.equal(res.status, 503, 'tanpa kunci harus 503, bukan menembak ke luar')

process.env.OLLAMA_API_KEY = 'kunci-palsu'
res = palsu()
await tanganiAi({ url: '/api/chat', method: 'GET' }, res)
assert.equal(res.status, 405)

assert.equal(await tanganiAi({ url: '/command-center', method: 'GET' }, palsu()), false,
  'route lain harus diteruskan, bukan ditangani')

process.env.OLLAMA_BASE_URL = 'http://localhost:11434'
delete process.env.OLLAMA_API_KEY
assert.equal(aiSiap(), true, 'Ollama lokal tidak butuh kunci')

// --- pencarian web (tombol Internet) ---
res = palsu()
assert.equal(await tanganiAi({ url: '/api/cari', method: 'GET' }, res), true, 'route /api/cari miliknya')
assert.equal(res.status, 400, 'kueri kosong ditolak sebelum menembak ke luar')

const HTML = `<table><tr><td><a class="result-link" href="//duckduckgo.com/l/?uddg=https%3A%2F%2Fbnpb.go.id%2Fbanjir">Prosedur <b>banjir</b></a></td></tr>
<tr><td class="result-snippet">Tinggi muka air &amp; siaga</td></tr></table>`
const hasil = ringkasHasil(HTML)
assert.match(hasil, /https:\/\/bnpb\.go\.id\/banjir/, 'tautan dibuka dari bungkus uddg')
assert.match(hasil, /Prosedur banjir/, 'tag HTML dilepas dari judul')
assert.match(hasil, /Tinggi muka air & siaga/, 'entitas HTML dikembalikan di cuplikan')
assert.equal(ringkasHasil('<html>tata letak berubah</html>'), '',
  'halaman tak dikenal = kosong, bukan hasil ngawur')

// --- gerbang topik (temuan: asisten masih bisa dibawa keluar topik) ---
assert.equal(relevanTopik('kelurahan mana yang risikonya paling tinggi?'), true)
assert.equal(relevanTopik('buatkan query SQL untuk tabel pengguna'), false)

process.env.OLLAMA_API_KEY = 'kunci-palsu'
process.env.OLLAMA_BASE_URL = 'https://ollama.com'
const posting = async (isi) => {
  const r = palsu()
  const badan = JSON.stringify({ messages: [{ role: 'user', content: isi }] })
  await tanganiAi({ url: '/api/chat', method: 'POST', on: (ev, f) => (ev === 'data' ? f(badan) : ev === 'end' ? f() : null) }, r)
  return r
}
let tolak = await posting('tulis query SQL untuk ambil semua user')
assert.equal(tolak.status, 200, 'penolakan tampil sebagai jawaban, bukan galat merah')
assert.match(JSON.parse(tolak.body).message.content, /hanya menjawab seputar HydroGuard/,
  'pertanyaan di luar lingkup berhenti di proxy, tidak sampai ke model')

res = palsu()
await tanganiAi({ url: '/api/cari?q=resep%20rendang', method: 'GET' }, res)
assert.equal(res.status, 403, 'tombol Internet bukan mesin pencari umum')

console.log('ai/handler: ok')
