# HydroGuard — Flood Monitoring & Command Center

Sistem pemantauan banjir dan pusat komando untuk Jakarta Selatan.

## Tech Stack
- React 19 + TypeScript + Vite
- Tailwind CSS v4 + Leaflet.js
- react-router-dom v7

## Chat AI

Dua tampilan, satu logika (`src/components/ChatAI.tsx`), dipinjam dari pushhub.
Lingkupnya dibatasi ke data HydroGuard: sensor, CCTV, alert, prediksi, sumber
daya, insiden. **Hanya membaca** — tidak ada alat yang mengubah data.

- **Quick chat** — widget mengambang di kanan bawah, terbuka sebagai modal.
  Sengaja tanpa daftar riwayat: ini jalan pintas untuk satu pertanyaan cepat.
- **Menu Chat AI** (`/chat-ai`) — halaman penuh dengan daftar riwayat di kiri,
  tempat percakapan lama dilanjutkan atau dihapus.

Keduanya menulis ke kunci `localStorage` yang sama (`hg_chat_threads`), jadi
percakapan yang dimulai dari quick chat muncul di halaman Chat AI dan sebaliknya.
Widget mengambang disembunyikan saat sedang berada di `/chat-ai`.

Penelusuran datanya jalan di peramban (data aplikasi ini memang sudah ada di
sana, `src/mock`). `ai/handler.mjs` cuma proxy ke Ollama supaya kunci API tidak
ikut ke bundel — ollama.com tidak mengirim header CORS, jadi peramban tidak bisa
memanggilnya langsung.

Ikut pembaruan pushhub:
- **Grafik.** Minta "buat grafik …" dan jawabannya berupa blok ```` ```grafik ````
  (JSON `{tipe, judul, data}`) yang dirender jadi batang/donat/area. Angkanya
  dihitung di kode lebih dulu (blok "Sebaran nilai" pada jawaban alat) — model
  bahasa tidak bisa dipercaya menghitung puluhan entri.
- **Tombol Internet** di sebelah kotak ketik. Menyala = model boleh memanggil
  `cari_internet`, tapi hanya kalau pertanyaannya memang soal kebencanaan atau
  aplikasi ini (gerbang kata kunci di `relevanInternet`, bukan model yang
  memutuskan). Pencariannya lewat `/api/cari` di proxy yang sama — mesin
  pencari juga tidak mengirim header CORS. Ditukar lewat `AI_SEARCH_URL`.

```bash
cp .env.example .env      # isi OLLAMA_API_KEY
npm run dev               # proxy ikut terpasang di dev server
npm test                  # cek mandiri proxy (tidak menyentuh jaringan)
```

`OLLAMA_API_KEY` kosong = widget bilang fiturnya belum aktif.

## Produksi (VPS, Docker)

`vite build` cuma menghasilkan berkas statis; `/api/chat` butuh proses Node.
Karena itu tahap akhir Dockerfile adalah `node server.mjs` — ia yang melayani
`dist/` **dan** `/api/chat`, `/api/chat/status`, `/api/cari` sekaligus. Kalau
tahap akhirnya nginx statis, seluruh Chat AI mati (status selalu 404).

```bash
# lokal
npm run dev                    # proxy AI ikut terpasang di dev server
npx vite build && npm start    # tanpa Docker; server.mjs di :$PORT (.env)
                               # (`npm run build` masih tersandung tsc -b, lihat Catatan)

# di server (~/apps/hydroguard)
cp .env.example .env           # isi OLLAMA_API_KEY dan PORT
docker compose up -d --build
docker compose logs -f hydroguard
```

Container hanya mendengarkan di `127.0.0.1:${PORT}`; yang menghadap publik
nginx-proxy-manager. `PORT` (bawaan `4021`) dipakai dua-duanya — proses Node di
dalam container dan pemetaan port di host — jadi tidak ada nomor port yang
dipatok di Dockerfile maupun compose. Nilainya harus sama dengan port yang
sudah ditunjuk proxy host hydroguard.

> **Env baru hanya terbaca setelah container DIBUAT ULANG.** `env_file` dibaca
> saat container dibuat, jadi setelah mengubah `.env` jalankan
> `docker compose up -d` (atau `--force-recreate`) — `docker restart hydroguard`
> **tidak** memuat nilai baru dan `/api/chat/status` akan tetap bilang belum
> aktif.

## Catatan

`tsc -b` masih gagal karena `src/mock/*.js` tanpa tipe — kondisi yang sudah ada
sebelum Chat AI ditambahkan. `vite build` sendiri lolos.
