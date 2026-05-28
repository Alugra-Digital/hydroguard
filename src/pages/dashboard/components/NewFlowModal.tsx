import { X } from 'lucide-react'

interface NewFlowModalProps {
  isOpen: boolean
  pipelineName: string
  onClose: () => void
  onSubmit: (name: string) => void
}

export default function NewFlowModal({ isOpen, pipelineName, onClose, onSubmit }: NewFlowModalProps) {
  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get('flowName') as string
    onSubmit(name)
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200 select-none">
      <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl max-w-md w-full overflow-hidden shadow-2xl shadow-black">
        <div className="px-5 py-4 border-b border-[var(--border-main)] flex justify-between items-center">
          <h3 className="text-sm font-bold text-white">Create New LLM Pipeline Flow</h3>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white p-0.5 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-zinc-400 font-semibold">Flow Name</label>
            <input
              type="text"
              name="flowName"
              required
              defaultValue={pipelineName}
              placeholder="e.g. Customer Support Bot"
              className="w-full h-9 bg-[var(--bg-base)] border border-[var(--border-subtle)] hover:border-zinc-700 focus:border-zinc-500 focus:outline-none rounded-lg px-3 text-white transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-zinc-400 font-semibold">Routing Endpoint Path</label>
            <input
              type="text"
              defaultValue="/v1/chat/completions"
              placeholder="/v1/chat/completions"
              className="w-full h-9 bg-[var(--bg-base)] border border-[var(--border-subtle)] hover:border-zinc-700 focus:border-zinc-500 focus:outline-none rounded-lg px-3 text-white transition-all font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-zinc-400 font-semibold">Primary Model</label>
              <select className="w-full h-9 bg-[var(--bg-base)] border border-[var(--border-subtle)] focus:border-zinc-500 focus:outline-none rounded-lg px-2.5 text-zinc-300 transition-all">
                <option>GPT-4o</option>
                <option>Claude 3.5 Sonnet</option>
                <option>Gemini Flash</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-zinc-400 font-semibold">Fallback Model</label>
              <select className="w-full h-9 bg-[var(--bg-base)] border border-[var(--border-subtle)] focus:border-zinc-500 focus:outline-none rounded-lg px-2.5 text-zinc-300 transition-all">
                <option>Gemini Flash</option>
                <option>Claude 3.5 Sonnet</option>
                <option>GPT-4o</option>
              </select>
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
              Deploy Flow
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
