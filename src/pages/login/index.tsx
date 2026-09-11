import { useState } from 'react'
import {
  ArrowRight, BarChart3, Building2, Eye, EyeOff, Lock,
  MapPin, Mail, ShieldCheck, Users, Waves,
} from 'lucide-react'
import Footprint from '../../components/Footprint'

interface LoginPageProps {
  onLogin: () => void
}

/** Kolom kiri: nilai jual, di atas foto pusat komando. */
const KEUNGGULAN = [
  { icon: BarChart3,   atas: 'Pantau',     bawah: 'Real-time'    },
  { icon: ShieldCheck, atas: 'Antisipasi', bawah: 'Risiko'       },
  { icon: Users,       atas: 'Respons',    bawah: 'Lebih Cepat'  },
]

const ANGKA = [
  { icon: Waves,       nilai: '120+',       ket: 'Titik Pemantauan' },
  { icon: MapPin,      nilai: '24/7',       ket: 'Pusat Komando'    },
  { icon: ShieldCheck, nilai: 'Lebih Aman', ket: 'Untuk Semua'      },
]

/** Email diingat di peramban saat "Ingat saya" dicentang — belum ada backend. */
const INGAT = 'hg_login_email'

/**
 * Quick login untuk demo. Belum ada backend maupun pembatasan per-peran, jadi
 * ketiganya bermuara ke dashboard yang sama — bedanya cuma akun yang terisi.
 */
const DEMO = [
  { peran: 'Operator',    email: 'operator@bpbd.go.id'    },
  { peran: 'Koordinator', email: 'koordinator@bpbd.go.id' },
  { peran: 'Pimpinan',    email: 'pimpinan@bpbd.go.id'    },
]

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState(() => localStorage.getItem(INGAT) || '')
  const [password, setPassword] = useState('')
  const [ingat, setIngat] = useState(() => Boolean(localStorage.getItem(INGAT)))
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [catatan, setCatatan] = useState<string | null>(null)

  const masuk = (surel: string) => {
    if (ingat) localStorage.setItem(INGAT, surel)
    else localStorage.removeItem(INGAT)
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      onLogin()
    }, 800)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    masuk(email)
  }

  /** Isi formulirnya dulu supaya terlihat masuk sebagai siapa, lalu masuk. */
  const quickLogin = (surel: string) => {
    setEmail(surel)
    setPassword('demo1234')
    setCatatan(null)
    masuk(surel)
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#070708] text-zinc-300">
      {/* Foto jadi latar satu halaman penuh — dipakai kedua kolom. */}
      <img
        src="/brand/login-hero.jpg"
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Dua lapis gelap: dari kiri supaya teks terbaca, dari bawah supaya
          kaki kolom tidak beradu dengan lampu kota. */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#04060c]/90 via-[#04060c]/55 to-[#04060c]/80" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#04060c]/85 via-transparent to-[#04060c]/40" />

      {/* ── Kiri: panel cerita. Disembunyikan di layar sempit — di sana yang
             dibutuhkan cuma formulirnya. ── */}
      <section className="relative hidden flex-1 flex-col justify-between p-10 lg:flex xl:p-14">

        <div className="relative">
          <div className="mb-4 h-px w-10 bg-[#38bdf8]" />
          <p className="text-[11px] font-medium uppercase leading-relaxed tracking-[0.25em] text-zinc-400">
            Lebih Aman
            <br />
            Untuk Hari Esok
          </p>
        </div>

        <div className="relative max-w-2xl">
          <h1 className="text-4xl font-bold leading-[1.12] tracking-tight text-white xl:text-5xl">
            Bersama Mengantisipasi
            <br />
            Banjir, <span className="text-[#38bdf8]">Melindungi</span>
            <br />
            <span className="text-[#38bdf8]">Lebih Banyak Kehidupan</span>
          </h1>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-zinc-300/90 xl:text-base">
            Data real-time, analisis akurat, dan koordinasi terpadu untuk
            masyarakat yang lebih aman dan tangguh.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {KEUNGGULAN.map((k) => (
              <div
                key={k.atas}
                className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 backdrop-blur-sm"
              >
                <k.icon className="h-4 w-4 shrink-0 text-[#38bdf8]" />
                <p className="text-xs font-medium leading-snug text-white">
                  {k.atas}
                  <br />
                  <span className="text-zinc-400">{k.bawah}</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex items-end justify-between gap-8">
          <div>
            <div className="mb-3 h-px w-10 bg-[#38bdf8]" />
            <p className="text-[10px] font-medium uppercase leading-relaxed tracking-[0.25em] text-zinc-500">
              Air Lebih Aman
              <br />
              Masyarakat Lebih Kuat
            </p>
          </div>
          <div className="flex items-center gap-6 xl:gap-8">
            {ANGKA.map((a) => (
              <div key={a.ket} className="flex items-center gap-2.5">
                <a.icon className="h-5 w-5 shrink-0 text-[#38bdf8]" />
                <div>
                  <p className="text-sm font-semibold leading-tight text-white">{a.nilai}</p>
                  <p className="text-[11px] leading-tight text-zinc-400">{a.ket}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Kanan: formulir ── */}
      <section className="relative flex w-full items-center justify-center px-5 py-8 lg:w-[540px] lg:shrink-0 lg:px-10">
        <div className="w-full max-w-sm">
          <div className="rounded-2xl border border-white/10 bg-[#0f0f12]/80 p-7 shadow-2xl shadow-black/60 backdrop-blur-xl">
            {/* Baris subjudul bawaan gambar dipotong — di bawahnya sudah ada
                versi Bahasa Indonesia-nya. */}
            <img
              src="/brand/hydroguard-lockup.png"
              alt="HydroGuard"
              className="mx-auto h-28 w-auto [clip-path:inset(0_0_12%_0)]"
            />
            <p className="mt-0.5 text-center text-[13px] text-zinc-400">
              Sistem Pemantauan Banjir &amp; Pusat Komando
            </p>

            <div className="my-5 h-px bg-[var(--border-subtle)]" />

            <p className="text-center text-sm font-semibold text-white">
              Pantau risiko, respons lebih cepat.
            </p>
            <p className="mt-1.5 text-center text-xs leading-relaxed text-zinc-500">
              Masuk untuk mengakses dashboard pemantauan, laporan, dan sistem komando.
            </p>

            <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3.5">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-xs font-medium text-zinc-300">Email</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@instansi.go.id"
                    autoComplete="email"
                    className="h-11 w-full rounded-xl border border-[var(--border-medium)] bg-[var(--bg-inner)] pl-10 pr-3 text-sm text-white outline-none transition-colors placeholder:text-zinc-600 focus:border-[#0077b6] focus:ring-1 focus:ring-[#0077b6]/30"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="sandi" className="text-xs font-medium text-zinc-300">Kata Sandi</label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
                  <input
                    id="sandi"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="h-11 w-full rounded-xl border border-[var(--border-medium)] bg-[var(--bg-inner)] pl-10 pr-10 text-sm text-white outline-none transition-colors placeholder:text-zinc-600 focus:border-[#0077b6] focus:ring-1 focus:ring-[#0077b6]/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors hover:text-zinc-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex cursor-pointer items-center gap-2 text-zinc-400">
                  <input
                    type="checkbox"
                    checked={ingat}
                    onChange={(e) => setIngat(e.target.checked)}
                    className="h-4 w-4 accent-[#0077b6]"
                  />
                  Ingat saya
                </label>
                <button
                  type="button"
                  onClick={() => setCatatan('Atur ulang kata sandi lewat admin Pusdalops — belum ada di versi demo.')}
                  className="font-medium text-[#38bdf8] transition-colors hover:text-[#7dd3fc]"
                >
                  Lupa kata sandi?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-1 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0077b6] to-[#0ea5e9] text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Masuk…
                  </>
                ) : (
                  <>
                    Masuk <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-[var(--border-subtle)]" />
              <span className="text-[11px] text-zinc-600">atau masuk dengan</span>
              <div className="h-px flex-1 bg-[var(--border-subtle)]" />
            </div>

            <button
              type="button"
              onClick={() => setCatatan('SSO instansi belum dipasang di versi demo — pakai form di atas.')}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[var(--border-medium)] bg-[var(--bg-inner)] text-sm font-medium text-zinc-300 transition-colors hover:border-[#0077b6] hover:text-white"
            >
              <Building2 className="h-4 w-4" /> Masuk dengan SSO
            </button>

            {catatan && (
              <p className="mt-4 text-center text-[11px] leading-snug text-amber-400/90">{catatan}</p>
            )}

            <div className="mt-5 border-t border-[var(--border-subtle)] pt-4">
              <p className="mb-2 text-center text-[10px] uppercase tracking-wide text-zinc-600">
                Quick login — akun demo
              </p>
              <div className="grid grid-cols-3 gap-1.5">
                {DEMO.map((d) => (
                  <button
                    key={d.email}
                    type="button"
                    onClick={() => quickLogin(d.email)}
                    disabled={isLoading}
                    title={d.email}
                    className="h-8 rounded-lg border border-[var(--border-medium)] bg-[var(--bg-inner)] text-[11px] text-zinc-400 transition-colors hover:border-[#0077b6] hover:text-white disabled:opacity-50"
                  >
                    {d.peran}
                  </button>
                ))}
              </div>
            </div>

            <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-zinc-600">
              <ShieldCheck className="h-3.5 w-3.5" /> Akses Anda dilindungi dengan enkripsi tingkat tinggi.
            </p>
          </div>

          <Footprint />
        </div>
      </section>
    </div>
  )
}
