# HydroGuard — Resume Aplikasi

Sistem pemantauan banjir & pusat komando untuk Jakarta Selatan. SPA frontend-only,
seluruh data masih mock (belum ada backend/API).

## Stack

| | |
|---|---|
| Framework | React 19 + TypeScript, Vite 8 |
| Styling | Tailwind CSS v4 (via `@tailwindcss/vite`), tema light/dark lewat CSS variable + `data-theme` |
| Routing | react-router-dom v7 |
| Peta | Leaflet + react-leaflet |
| Ikon | lucide-react |
| Deploy | GitHub Actions → SSH ke VPS → `docker compose up -d --build` (`.github/workflows/hydroguard.yml`) |

Ukuran: ~10.3k baris di `src/`, 9 halaman, 20 komponen dashboard.

## Struktur

```
src/
  App.tsx                 shell: auth gate, routing, tema, toast
  components/layout/      Sidebar (9 menu) + TopBar (jam realtime, search, dark toggle)
  components/PageKpiCard  kartu KPI dipakai ulang di semua halaman
  pages/<nama>/index.tsx  satu folder per halaman
  pages/dashboard/        + components/ (20), data/ (agregasi), types/
  mock/<halaman>.js       data dummy, satu file per halaman, di-reexport via mock/index.js
```

## Halaman

| Route | Isi |
|---|---|
| `/login` | Form email+password, **dummy** — submit apa pun langsung lolos (delay 800ms), session di `sessionStorage.hg_auth` |
| `/command-center` | Halaman utama: KPI animasi, peta Leaflet 5 layer (zona risiko, sensor, CCTV, posko, jalur evakuasi), banner peringatan BMKG, tabel prediksi, cuaca, status lapangan, resource, filter rentang waktu (1j/24j/7h/30h) |
| `/executive-view` | Ringkasan level pimpinan: risiko per kelurahan, sumber daya kritis, alert & insiden terkini |
| `/alert-management` | Alert aktif vs historis, filter level siaga & kecamatan |
| `/sensor-network` | 30 sensor (TMA/curah hujan), filter kecamatan/tipe/status, ringkasan per kecamatan |
| `/cctv-monitor` | 20 kamera, preview iframe + fallback, deteksi genangan/kendaraan/kepadatan |
| `/field-coordinator` | Terbesar (729 baris): form laporan kejadian banjir, tabel evakuasi/posko/CCTV dengan paginasi |
| `/resource-management` | Tab pompa · perahu · personil · posko · logistik, dengan ambang stok |
| `/prediction-analysis` | Prediksi AI: risk gauge SVG, forecast 1j/3j/6j, driver banjir (curah hujan, backwater, pasang surut/rob, kombinasi) |
| `/incident-history` | 14 insiden, grafik frekuensi per bulan, filter + pencarian |

## Data (mock)

65 kelurahan · 30 sensor · 20 CCTV · 13 prediksi · 52 personil · 8 perahu · 5 pompa ·
6 posko · 5 jalur evakuasi · 14 insiden · 20 alert historis.

Setiap halaman punya file mock sendiri sehingga sebagian data (sensor, CCTV, posko)
terduplikasi antar file.

## Catatan kondisi saat ini

- **Auth palsu** — tidak ada validasi kredensial, `sessionStorage` mudah di-set manual.
  Perlu backend sebelum produksi.
- **Data statis** — tidak ada fetch/websocket; angka "realtime" hanya jam di TopBar dan
  multiplier rentang waktu.
- **Duplikasi mock** — `sensorsData`, `cctvData`, `sheltersData` muncul di 3–5 file
  berbeda dengan isi berbeda-beda.
- Tidak ada test, tidak ada Dockerfile/compose di repo (diasumsikan sudah ada di VPS).

## Menjalankan

```bash
npm install
npm run dev      # vite dev server
npm run build    # tsc -b && vite build
npm run lint
```
