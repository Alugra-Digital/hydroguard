import { useState, useEffect } from 'react'

// ── Hook: reads data-theme from <html> element ────────────
export function useIsDark(): boolean {
  const [isDark, setIsDark] = useState(
    () => document.documentElement.getAttribute('data-theme') !== 'light'
  )
  useEffect(() => {
    const obs = new MutationObserver(() =>
      setIsDark(document.documentElement.getAttribute('data-theme') !== 'light')
    )
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => obs.disconnect()
  }, [])
  return isDark
}

// ── Color map: vibrant → dark readable for light backgrounds ─
const LIGHT_MAP: Record<string, string> = {
  // Rose / Red
  '#ef4444': '#9f1239',
  '#f87171': '#be123c',
  '#dc2626': '#9f1239',
  // Orange
  '#f97316': '#9a3412',
  '#fb923c': '#9a3412',
  '#ea580c': '#7c2d12',
  // Amber / Yellow
  '#f59e0b': '#92400e',
  '#fbbf24': '#92400e',
  '#d97706': '#78350f',
  // Emerald / Green
  '#10b981': '#065f46',
  '#34d399': '#065f46',
  '#059669': '#064e3b',
  // Blue
  '#3b82f6': '#1d4ed8',
  '#60a5fa': '#1d4ed8',
  '#2563eb': '#1e3a8a',
  // Sky
  '#0ea5e9': '#0369a1',
  '#38bdf8': '#0369a1',
  // Indigo
  '#6366f1': '#3730a3',
  '#818cf8': '#3730a3',
  // Violet / Purple
  '#8b5cf6': '#5b21b6',
  '#7c3aed': '#5b21b6',
  '#a78bfa': '#6d28d9',
  '#a855f7': '#7e22ce',
  '#c084fc': '#7e22ce',
  // Cyan / Teal
  '#06b6d4': '#0e7490',
  '#22d3ee': '#0e7490',
  '#67e8f9': '#0e7490',
  '#14b8a6': '#0f766e',
  '#2dd4bf': '#0f766e',
  // Pink
  '#ec4899': '#9d174d',
  '#f472b6': '#9d174d',
  // Zinc / neutral — already dark enough or handled
  '#71717a': '#3f3f46',
  '#94a3b8': '#475569',
}

export function adaptColor(color: string, isDark: boolean): string {
  if (isDark) return color
  return LIGHT_MAP[color.toLowerCase()] ?? color
}
