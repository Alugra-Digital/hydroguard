import React from 'react'
import {
  Cpu,
  Shield,
  Edit3,
  Sparkles,
  CheckCircle
} from 'lucide-react'
import type { ComputedMetrics } from '../types'

interface PipelineArchitectureProps {
  authProtocol: string
  rateLimit: number
  piiRedactMode: string
  piiRedactEngine: string
  injectionHeuristic: string
  toxicityThreshold: number
  computedMetrics: ComputedMetrics
  onEditClick: () => void
  onShowToast: (msg: string) => void
}

export default function PipelineArchitecture({
  authProtocol,
  rateLimit,
  piiRedactMode,
  piiRedactEngine,
  injectionHeuristic,
  toxicityThreshold,
  computedMetrics,
  onEditClick,
  onShowToast
}: PipelineArchitectureProps) {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)]/80 rounded-xl overflow-hidden flex flex-col justify-between h-full">
      <div className="px-5 py-4 border-b border-[var(--border-main)] flex justify-between items-center select-none">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-zinc-400" />
          <h2 className="text-sm font-bold text-zinc-200">Arsitektur Sistem Monitor</h2>
        </div>

        <button
          onClick={onEditClick}
          className="px-2.5 py-1 rounded-md border border-[var(--border-subtle)] hover:border-zinc-700 bg-zinc-900/30 hover:bg-zinc-900 text-[10.5px] font-semibold text-zinc-300 flex items-center gap-1 transition-all cursor-pointer"
        >
          <Edit3 className="w-2.5 h-2.5" />
          Edit Pipeline
        </button>
      </div>

      {/* Pipeline architecture list details */}
      <div className="p-5 flex-1 space-y-6">

        {/* SECTION 1: INGRESS */}
        <div className="space-y-2.5">
          <div className="text-[10.5px] font-bold text-zinc-500 tracking-wider uppercase select-none">
            1. INGRESS (ENTRY POINT)
          </div>
          <div className="bg-[var(--bg-inner)] border border-[var(--border-main)] rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-500 select-none">Endpoint:</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-zinc-200 font-semibold">/api/v1/flood-watch</span>
                <span className="bg-zinc-900 border border-[var(--border-medium)] text-zinc-300 font-bold font-mono text-[10.5px] px-1.5 py-0.5 rounded">
                  POST
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-500 select-none">Auth Protocol:</span>
              <span className="text-zinc-300 font-semibold">{authProtocol}</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-500 select-none">Rate Limit:</span>
              <div className="flex items-center gap-1">
                <span className="text-zinc-400 select-none text-[10.5px]">req/min per sensor</span>
                <span className="bg-[var(--bg-card)] border border-[var(--border-subtle)] text-zinc-200 font-bold px-2 py-0.5 rounded text-[10.5px] font-mono">
                  {rateLimit}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: PRE-PROCESSING */}
        <div className="space-y-2.5">
          <div className="text-[10.5px] font-bold text-zinc-500 tracking-wider uppercase select-none">
            2. PRE-PROCESSING (MIDDLEWARE)
          </div>
          <div className="grid grid-cols-3 gap-2.5">

            {/* Item A: PII Redact */}
            <div className="bg-[var(--bg-inner)] border border-[var(--border-main)] rounded-xl p-3 flex flex-col justify-between hover:border-zinc-800 transition-colors">
              <div className="flex items-center gap-1.5 text-zinc-200 font-bold text-[10.5px] mb-2 select-none">
                <Shield className="w-3 h-3 text-indigo-400" />
                <span>Validasi Data</span>
              </div>
              <div className="space-y-1.5 text-[10.5px]">
                <div className="flex justify-between text-zinc-500">
                  <span>Metode:</span>
                  <span className="text-zinc-300 font-semibold font-mono">{piiRedactMode}</span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>Sumber:</span>
                  <span className="text-zinc-300 font-semibold font-mono">{piiRedactEngine}</span>
                </div>
              </div>
            </div>

            {/* Item B: Injection */}
            <div className="bg-[var(--bg-inner)] border border-[var(--border-main)] rounded-xl p-3 flex flex-col justify-between hover:border-zinc-800 transition-colors">
              <div className="flex items-center gap-1.5 text-zinc-200 font-bold text-[10.5px] mb-2 select-none">
                <Shield className="w-3 h-3 text-emerald-400" />
                <span>Filter Anomali</span>
              </div>
              <div className="space-y-1.5 text-[10.5px]">
                <div className="flex justify-between text-zinc-500">
                  <span>Heuristic:</span>
                  <span className="text-zinc-300 font-semibold font-mono">{injectionHeuristic}</span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>Vector:</span>
                  <span className="text-zinc-300 font-semibold font-mono">STRICT</span>
                </div>
              </div>
            </div>

            {/* Item C: Toxicity Class. */}
            <div className="bg-[var(--bg-inner)] border border-[var(--border-main)] rounded-xl p-3 flex flex-col justify-between hover:border-zinc-800 transition-colors">
              <div className="flex items-center gap-1.5 text-zinc-200 font-bold text-[10.5px] mb-2 select-none">
                <CheckCircle className="w-3 h-3 text-rose-400" />
                <span className="truncate">Quality Check</span>
              </div>
              <div className="space-y-1.5 text-[10.5px]">
                <div className="flex justify-between text-zinc-500">
                  <span>Threshold:</span>
                  <span className="text-zinc-300 font-semibold font-mono">{toxicityThreshold}</span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>Action:</span>
                  <span className="text-zinc-300 font-semibold font-mono">DROP</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* SECTION 3: DYNAMIC ROUTER */}
        <div className="space-y-2.5">
          <div className="text-[10.5px] font-bold text-zinc-500 tracking-wider uppercase select-none">
            3. DYNAMIC ROUTER (DECISION MATRIX)
          </div>

          {/* Rule 01 Details */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs select-none">
              <span className="text-zinc-400 font-semibold">Rule 01</span>
              <div className="flex items-center gap-1 bg-rose-950/40 border border-rose-900/30 rounded px-1.5 py-0.5">
                <span className="w-1 h-1 rounded-full bg-rose-500" />
                <span className="text-[10.5px] font-bold text-rose-400 uppercase tracking-wide">High</span>
              </div>
            </div>

            <div className="bg-[var(--bg-inner)] border border-[var(--border-main)] rounded-xl p-4 space-y-3">
              {/* Logic Rule Condition Block */}
              <div className="flex items-center gap-1 text-[10.5px] font-medium text-zinc-300 bg-zinc-950 px-2.5 py-1.5 rounded-lg border border-[var(--border-subtle)] font-mono">
                <span className="text-indigo-400 font-bold">IF</span>
                <span className="text-zinc-500">[</span>
                <span className="text-zinc-200">risk_level</span>
                <span className="text-zinc-500">]</span>
                <span className="text-zinc-400">==</span>
                <span className="text-zinc-500">[</span>
                <span className="text-amber-400">critical</span>
                <span className="text-zinc-500">,</span>
                <span className="text-amber-400">high</span>
                <span className="text-zinc-500">]</span>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 select-none">Route to:</span>
                  <span className="text-zinc-200 font-semibold font-mono">Alert System</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 select-none">Temp:</span>
                  <span className="text-zinc-200 font-semibold font-mono">0.2</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 select-none">Max Tokens:</span>
                  <span className="text-zinc-200 font-semibold font-mono">1024</span>
                </div>
              </div>
            </div>
          </div>

          {/* Rule 02 - Collapsed Header */}
          <div
            className="flex justify-between items-center text-xs select-none bg-[var(--bg-inner)] border border-[var(--border-main)] px-4 py-2.5 rounded-xl hover:border-zinc-800 transition-colors cursor-pointer"
            onClick={() => onShowToast('Expanded Rule 02 detail')}
          >
            <span className="text-zinc-400 font-semibold">Rule 02</span>
            <div className="flex items-center gap-1 bg-amber-950/40 border border-amber-900/30 rounded px-1.5 py-0.5">
              <span className="w-1 h-1 rounded-full bg-amber-500" />
              <span className="text-[10.5px] font-bold text-amber-400 uppercase tracking-wide">Medium</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
