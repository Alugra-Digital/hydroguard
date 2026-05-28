import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface LoginPageProps {
  onLogin: () => void
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      onLogin()
    }, 800)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#070708]">
      {/* Subtle radial glow behind the card */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(0,119,182,0.08) 0%, transparent 70%)',
        }}
      />

      <div className="relative w-full max-w-sm mx-4">
        {/* Card */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl p-8 w-full shadow-2xl shadow-black/60">

          {/* Logo area */}
          <div className="flex flex-col items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-black border border-[var(--border-medium)] flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-2" style={{ stroke: 'var(--logo-color)' }}>
                <path
                  d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 15c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 7c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
                  style={{ fill: 'var(--logo-color)', stroke: 'none' }}
                />
              </svg>
            </div>
            <div className="text-center">
              <h1 className="text-white font-bold text-lg leading-tight tracking-tight">
                HydroGuard
              </h1>
              <p className="text-zinc-500 text-xs mt-0.5 leading-snug">
                Flood Monitoring System · Jakarta Selatan
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-[var(--border-subtle)] mb-6" />

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-zinc-400 text-xs font-medium tracking-wide uppercase">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@bpbd.go.id"
                autoComplete="email"
                className="w-full h-10 bg-[var(--bg-inner)] border border-[var(--border-medium)] rounded-xl px-3 text-sm text-white placeholder-zinc-600 outline-none focus:border-[#0077b6] focus:ring-1 focus:ring-[#0077b6]/30 transition-all duration-200"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-zinc-400 text-xs font-medium tracking-wide uppercase">
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full h-10 bg-[var(--bg-inner)] border border-[var(--border-medium)] rounded-xl px-3 pr-10 text-sm text-white placeholder-zinc-600 outline-none focus:border-[#0077b6] focus:ring-1 focus:ring-[#0077b6]/30 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 mt-1 bg-[#0077b6] hover:bg-[#005f92] disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-sm transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Masuk…
                </>
              ) : (
                'Masuk'
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-[10.5px] text-zinc-600 text-center mt-6 leading-snug">
            Sistem Peringatan Dini Banjir · BPBD Jakarta Selatan
          </p>
        </div>
      </div>
    </div>
  )
}
