# HydroGuard — Flood Monitoring & Command Center

Sistem pemantauan banjir dan pusat komando untuk Jakarta Selatan.

## Tech Stack
- React 19 + TypeScript + Vite
- Tailwind CSS v4 + Leaflet.js
- react-router-dom v7

## Chat AI

Widget mengambang di kanan bawah tiap halaman (`src/components/ChatAI.tsx`),
dipinjam dari pushhub. Lingkupnya dibatasi ke data HydroGuard: sensor, CCTV,
alert, prediksi, sumber daya, insiden. **Hanya membaca** — tidak ada alat yang
mengubah data.

Penelusuran datanya jalan di peramban (data aplikasi ini memang sudah ada di
sana, `src/mock`). `ai/handler.mjs` cuma proxy ke Ollama supaya kunci API tidak
ikut ke bundel — ollama.com tidak mengirim header CORS, jadi peramban tidak bisa
memanggilnya langsung.

Riwayat percakapan disimpan di `localStorage` (belum ada backend).

```bash
cp .env.example .env      # isi OLLAMA_API_KEY
npm run dev               # proxy ikut terpasang di dev server
npm test                  # cek mandiri proxy (tidak menyentuh jaringan)
```

`OLLAMA_API_KEY` kosong = widget bilang fiturnya belum aktif.

## Produksi

`vite build` menghasilkan berkas statis, tapi `/api/chat` butuh proses Node:

```bash
npm run build && npm start   # server.mjs: static dist/ + /api/chat, port 8080
```

Kalau di VPS aplikasi ini masih disajikan nginx statis, Dockerfile-nya perlu
diubah menjadi `CMD ["node", "server.mjs"]` (atau nginx diberi
`proxy_pass /api/ → node`), dan `OLLAMA_*` dipasang sebagai env container.

## Catatan

`tsc -b` masih gagal karena `src/mock/*.js` tanpa tipe — kondisi yang sudah ada
sebelum Chat AI ditambahkan. `vite build` sendiri lolos.
