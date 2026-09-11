/**
 * Cek mandiri proxy Chat AI — `node ai/handler.test.mjs`. Yang dijaga: gerbang
 * kunci (tanpa OLLAMA_API_KEY jangan sampai ada permintaan keluar) dan route
 * yang bukan miliknya harus diteruskan ke penanganan berikutnya. Tidak
 * menyentuh jaringan.
 */
import assert from 'node:assert'
import { tanganiAi, aiSiap } from './handler.mjs'

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

console.log('ai/handler: ok')
