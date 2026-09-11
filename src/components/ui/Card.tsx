import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

/**
 * Kartu standar — dipinjam dari pusgeoau (components/ui/Card.tsx), tokennya
 * diganti ke CSS variable HydroGuard. `rounded-xl` WAJIB dipertahankan: aturan
 * glassmorphism tema terang di index.css menempel pada selector `.rounded-xl`.
 */
interface CardProps {
  children: ReactNode
  className?: string
  /** buang padding dalam — untuk kartu yang isinya tabel/grafik edge-to-edge */
  flush?: boolean
}

export function Card({ children, className, flush }: CardProps) {
  return (
    <section
      className={cn(
        'rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)]',
        !flush && 'p-5',
        className,
      )}
    >
      {children}
    </section>
  )
}

interface CardHeaderProps {
  title: string
  caption?: string
  action?: ReactNode
  className?: string
}

/** Strip header kartu: judul + caption di kiri, aksi (mis. "Lihat semua") di kanan. */
export function CardHeader({ title, caption, action, className }: CardHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between gap-4', className)}>
      <div className="min-w-0">
        <h2 className="text-[15.5px] font-semibold tracking-[-0.015em] text-white">{title}</h2>
        {caption && <p className="mt-1 text-[12.5px] leading-snug text-zinc-500">{caption}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
