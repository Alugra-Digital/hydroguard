/**
 * Jejak pembuat — sama seperti di pushhub: wordmark Alugra di halaman login,
 * ikonnya saja di kaki sidebar (lebarnya cuma 68px, wordmark tidak muat).
 */
export default function Footprint({ varian = 'wide' }: { varian?: 'wide' | 'mark' }) {
  if (varian === 'mark')
    return (
      <div className="flex justify-center border-t border-[var(--border-main)] w-full pt-3 mt-1">
        <img
          src="/logo-com/logo-alugra-mark.png"
          alt="Alugra Digital Indonesia"
          title="Alugra Digital Indonesia"
          className="h-5 w-5 opacity-50 hover:opacity-100 transition-opacity"
        />
      </div>
    )

  return (
    <p className="mt-2 flex items-center justify-center gap-1.5 text-[10.5px] text-zinc-600">
      POWERED BY
      <img src="/logo-com/logo-alugra-opt.png" alt="" aria-hidden className="h-6 w-fit" />
    </p>
  )
}
