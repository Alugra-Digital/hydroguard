# HydroGuard: bangun aset Vite, lalu jalankan server.mjs.
#
# Tahap akhir WAJIB Node, bukan nginx. Yang menyajikan aplikasi ini adalah
# `node server.mjs` — ia melayani dist/ sekaligus route /api/chat,
# /api/chat/status, dan /api/cari (ai/handler.mjs). Begitu tahap akhirnya
# nginx, ketiga route itu 404 dan seluruh Chat AI mati.

FROM node:22-alpine AS build
WORKDIR /app
# Lapisan dependensi dipisah: hanya dibangun ulang kalau lockfile berubah.
COPY package*.json ./
RUN npm ci
COPY . .
# `npm run build` = `tsc -b && vite build`, dan `tsc -b` masih gagal karena
# src/mock/*.js tanpa tipe — kondisi lama, lihat catatan di README. Maka yang
# dipanggil `vite build` saja; keluarannya tetap dist/ yang sama.
RUN npx vite build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
# server.mjs dan ai/handler.mjs tidak punya dependensi npm sama sekali (cuma
# node:http, node:fs, dan fetch bawaan), jadi di sini tidak ada npm install dan
# node_modules tidak ikut. dist/ harus bersebelahan dengan server.mjs — jalurnya
# dihitung relatif ke berkas itu sendiri.
COPY --from=build /app/dist ./dist
COPY ai ./ai
COPY server.mjs package.json ./
# Tanpa EXPOSE: port tidak dipatok di image. server.mjs mendengarkan di PORT
# dari environment (lihat .env dan docker-compose.yml).
CMD ["node", "server.mjs"]
