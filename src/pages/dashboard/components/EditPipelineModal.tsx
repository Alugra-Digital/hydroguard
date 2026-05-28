import { X } from 'lucide-react'
import type { PiiRedactMode, PiiRedactEngine, InjectionHeuristic } from '../types'

interface EditPipelineModalProps {
  isOpen: boolean
  authProtocol: string
  rateLimit: number
  piiRedactMode: PiiRedactMode
  piiRedactEngine: PiiRedactEngine
  injectionHeuristic: InjectionHeuristic
  toxicityThreshold: number
  onClose: () => void
  onAuthProtocolChange: (v: string) => void
  onRateLimitChange: (v: number) => void
  onPiiRedactModeChange: (v: PiiRedactMode) => void
  onPiiRedactEngineChange: (v: PiiRedactEngine) => void
  onInjectionHeuristicChange: (v: InjectionHeuristic) => void
  onToxicityThresholdChange: (v: number) => void
  onSubmit: () => void
}

export default function EditPipelineModal({
  isOpen,
  authProtocol,
  rateLimit,
  piiRedactMode,
  piiRedactEngine,
  injectionHeuristic,
  toxicityThreshold,
  onClose,
  onAuthProtocolChange,
  onRateLimitChange,
  onPiiRedactModeChange,
  onPiiRedactEngineChange,
  onInjectionHeuristicChange,
  onToxicityThresholdChange,
  onSubmit,
}: EditPipelineModalProps) {
  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200 select-none">
      <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl max-w-md w-full overflow-hidden shadow-2xl shadow-black">
        <div className="px-5 py-4 border-b border-[var(--border-main)] flex justify-between items-center">
          <h3 className="text-sm font-bold text-white">Edit Pipeline Architecture</h3>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white p-0.5 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">

          {/* Part 1: Ingress Config */}
          <div className="space-y-3">
            <h4 className="font-bold text-zinc-400 border-b border-[var(--border-main)] pb-1 uppercase tracking-wide text-[10.5px]">1. Ingress Settings</h4>

            <div className="space-y-1.5">
              <label className="text-zinc-500 font-semibold">Auth Protocol</label>
              <input
                type="text"
                required
                value={authProtocol}
                onChange={(e) => onAuthProtocolChange(e.target.value)}
                className="w-full h-8 bg-[var(--bg-base)] border border-[var(--border-subtle)] hover:border-zinc-700 focus:outline-none focus:border-zinc-500 rounded-lg px-3 text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-500 font-semibold">Rate Limit (req/min per IP)</label>
              <input
                type="number"
                required
                value={rateLimit}
                onChange={(e) => onRateLimitChange(Number(e.target.value))}
                className="w-full h-8 bg-[var(--bg-base)] border border-[var(--border-subtle)] hover:border-zinc-700 focus:outline-none focus:border-zinc-500 rounded-lg px-3 text-white"
              />
            </div>
          </div>

          {/* Part 2: Pre-Processing Config */}
          <div className="space-y-3 pt-1">
            <h4 className="font-bold text-zinc-400 border-b border-[var(--border-main)] pb-1 uppercase tracking-wide text-[10.5px]">2. Pre-Processing Middleware</h4>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-zinc-500 font-semibold font-mono">PII Redact Mode</label>
                <select
                  value={piiRedactMode}
                  onChange={(e) => onPiiRedactModeChange(e.target.value as PiiRedactMode)}
                  className="w-full h-8 bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-2 text-zinc-300"
                >
                  <option>MASK</option>
                  <option>ENCRYPT</option>
                  <option>REPLACE</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-zinc-500 font-semibold font-mono">PII Redact Engine</label>
                <select
                  value={piiRedactEngine}
                  onChange={(e) => onPiiRedactEngineChange(e.target.value as PiiRedactEngine)}
                  className="w-full h-8 bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-2 text-zinc-300"
                >
                  <option>NER</option>
                  <option>REGEX</option>
                  <option>HYBRID</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-zinc-500 font-semibold font-mono">Injection Heuristics</label>
                <select
                  value={injectionHeuristic}
                  onChange={(e) => onInjectionHeuristicChange(e.target.value as InjectionHeuristic)}
                  className="w-full h-8 bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-2 text-zinc-300"
                >
                  <option>ON</option>
                  <option>OFF</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-zinc-500 font-semibold font-mono">Toxicity Threshold</label>
                <input
                  type="number"
                  step="0.05"
                  min="0.1"
                  max="1.0"
                  value={toxicityThreshold}
                  onChange={(e) => onToxicityThresholdChange(Number(e.target.value))}
                  className="w-full h-8 bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-3 text-white"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-4 rounded-lg border border-[var(--border-subtle)] hover:border-zinc-700 text-zinc-300 font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-9 px-4 rounded-lg bg-white hover:bg-zinc-200 text-black font-semibold transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
