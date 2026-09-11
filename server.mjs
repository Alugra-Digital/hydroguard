/**
 * Server produksi: static `dist/` + satu route `/api/chat`. Vite dev/preview
 * memasang route yang sama lewat pluginAi(), jadi di kedua tempat perilakunya
 * sama. Tanpa dependensi — `node server.mjs` saja.
 */
import { createServer } from 'node:http'
import { createReadStream, existsSync, statSync } from 'node:fs'
import { extname, join, normalize } from 'node:path'
import { tanganiAi } from './ai/handler.mjs'

// Node tidak memuat .env sendiri. Absen = Chat AI bilang belum aktif, bukan
// crash — variabelnya boleh juga datang dari environment container.
try { process.loadEnvFile('.env') } catch { /* tidak ada .env */ }

const DIST = new URL('./dist/', import.meta.url).pathname
const PORT = Number(process.env.PORT) || 8080
const TIPE = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp',
  '.woff2': 'font/woff2', '.ico': 'image/x-icon',
}

createServer(async (req, res) => {
  if (await tanganiAi(req, res)) return

  // normalize() membuang '..' — tanpa ini URL bisa keluar dari dist/.
  const rel = normalize(decodeURIComponent(req.url.split('?')[0])).replace(/^(\.\.[/\\])+/, '')
  let file = join(DIST, rel)
  // SPA: path apa pun yang bukan berkas nyata dikembalikan ke index.html.
  if (!existsSync(file) || statSync(file).isDirectory()) file = join(DIST, 'index.html')
  res.writeHead(200, { 'content-type': TIPE[extname(file)] || 'application/octet-stream' })
  createReadStream(file).pipe(res)
}).listen(PORT, () => console.log(`hydroguard on :${PORT}`))
