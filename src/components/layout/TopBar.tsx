import { useState, useEffect } from 'react'
import { Search, Bell, Plus, Sun, Moon, X } from 'lucide-react'

interface TopBarProps {
  pipelineName: string
  searchTerm: string
  onSearchChange: (term: string) => void
  isDark: boolean
  onToggleDark: () => void
  onNewFlow: () => void
  onShowToast: (msg: string) => void
}

// ── Real-time clock: YYYY-MM-DD HH:MM:SS ─────────────
function RealtimeClock() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const pad = (n: number) => String(n).padStart(2, '0')
  const Y   = now.getFullYear()
  const M   = pad(now.getMonth() + 1)
  const D   = pad(now.getDate())
  const h   = pad(now.getHours())
  const m   = pad(now.getMinutes())
  const s   = pad(now.getSeconds())

  return (
    <span className="font-mono text-xs tracking-tight select-none">
      <span className="text-zinc-500">{Y}-{M}-{D}</span>
      <span className="text-zinc-600 mx-1">·</span>
      <span className="text-zinc-300">{h}:{m}:{s}</span>
    </span>
  )
}

export default function TopBar({
  pipelineName,
  searchTerm,
  onSearchChange,
  isDark,
  onToggleDark,
  onNewFlow,
  onShowToast
}: TopBarProps) {
  return (
    <header className="h-14 border-b border-[var(--border-main)] bg-[var(--bg-base)] px-6 flex items-center justify-between select-none z-10">

      {/* Left: realtime clock + breadcrumb */}
      <div className="flex items-center gap-3">
        <RealtimeClock />
        <span className="text-zinc-700">/</span>
        <span className="text-zinc-200 text-xs font-semibold">{pipelineName}</span>
      </div>

      {/* Right: search, bell, toggle, new flow */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative w-64">
          <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-500">
            <Search className="w-3.5 h-3.5" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search..."
            className="w-full h-8 bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-zinc-700 focus:border-zinc-500 focus:outline-none rounded-lg pl-9 pr-4 text-xs text-white placeholder-zinc-500 transition-all"
          />
          {searchTerm && (
            <button onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-2.5 flex items-center text-zinc-500 hover:text-white">
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Notification Bell */}
        <button onClick={() => onShowToast('No new notifications')}
          className="w-8 h-8 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors relative">
          <Bell className="w-3.5 h-3.5" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500" />
        </button>

        {/* Light / Dark Toggle */}
        <button onClick={onToggleDark} title={isDark ? 'Light Mode' : 'Dark Mode'}
          className="w-8 h-8 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-all">
          {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </button>

        {/* Tambah Alert */}
        <button onClick={onNewFlow}
          className="h-8 bg-white hover:bg-zinc-200 text-black text-xs font-semibold px-3 rounded-lg flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer">
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          Tambah Alert
        </button>
      </div>
    </header>
  )
}
