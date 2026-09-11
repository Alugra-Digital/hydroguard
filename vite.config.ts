import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// @ts-expect-error — modul .mjs polos, tanpa berkas tipe
import { pluginAi } from './ai/handler.mjs'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // OLLAMA_* dibaca ke process.env supaya handler proxy melihatnya. Sengaja
  // tanpa awalan VITE_: kunci ini tidak boleh ikut ke bundel peramban.
  Object.assign(process.env, loadEnv(mode, process.cwd(), 'OLLAMA_'))
  return { plugins: [react(), tailwindcss(), pluginAi()] }
})
