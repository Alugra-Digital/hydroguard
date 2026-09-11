import { useState } from 'react'
import {
  LayoutDashboard,
  BarChart3,
  Bell,
  Activity,
  Camera,
  MapPin,
  Package,
  Brain,
  FileText,
  Settings,
  HelpCircle,
  LogOut,
  PanelLeftOpen,
  PanelLeftClose,
} from 'lucide-react'
import Footprint from '../Footprint'

interface SidebarProps {
  activePage: string
  onNavigate: (page: string) => void
  onShowToast: (msg: string) => void
  onLogout: () => void
}

const navItems = [
  { id: 'command-center',      icon: LayoutDashboard, label: 'Command Center'      },
  { id: 'executive-view',      icon: BarChart3,       label: 'Executive View'       },
  { id: 'alert-management',    icon: Bell,            label: 'Alert Management'     },
  { id: 'sensor-network',      icon: Activity,        label: 'Sensor Network'       },
  { id: 'cctv-monitor',        icon: Camera,          label: 'CCTV Monitor'         },
  { id: 'field-coordinator',   icon: MapPin,          label: 'Field Coordinator'    },
  { id: 'resource-management', icon: Package,         label: 'Resource Management'  },
  { id: 'prediction-analysis', icon: Brain,           label: 'Prediction Analysis'  },
  { id: 'incident-history',    icon: FileText,        label: 'Incident History'     },
]

export default function Sidebar({ activePage, onNavigate, onShowToast, onLogout }: SidebarProps) {
  const [expanded, setExpanded] = useState(() => localStorage.getItem('hg-sidebar-expanded') === '1')

  const toggle = () => {
    setExpanded((v) => {
      localStorage.setItem('hg-sidebar-expanded', v ? '0' : '1')
      return !v
    })
  }

  // Satu kelas dipakai semua tombol: ikon terpusat saat rapat, rata kiri + label saat lebar
  const row = expanded ? 'w-full h-11 px-3 gap-3 justify-start' : 'w-12 h-12 justify-center'

  return (
    <aside
      className={`${expanded ? 'w-[220px]' : 'w-[68px]'} transition-[width] duration-200 bg-[var(--bg-sidebar)] border-r border-[var(--border-main)] flex flex-col py-4 px-2 flex-shrink-0 z-20 justify-between select-none overflow-hidden`}
    >
      <div className="flex flex-col gap-6 w-full">
        {/* Logo + toggle */}
        <div className={`flex items-center ${expanded ? 'justify-between px-1' : 'justify-center'}`}>
          <div
            onClick={() => onShowToast('Hydroguard home console')}
            title="HydroGuard"
            className="h-10 cursor-pointer flex items-center gap-2 group"
          >
            <img
              src="/brand/hydroguard-mark.png"
              alt="HydroGuard"
              className="w-9 h-9 object-contain group-hover:scale-105 transition-transform"
            />
            {expanded && <span className="text-sm font-semibold text-white whitespace-nowrap">HydroGuard</span>}
          </div>
          {expanded && (
            <button
              onClick={toggle}
              title="Collapse sidebar"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/40 transition-colors"
            >
              <PanelLeftClose className="w-[18px] h-[18px]" />
            </button>
          )}
        </div>

        {!expanded && (
          <button
            onClick={toggle}
            title="Expand sidebar"
            className="w-12 h-9 self-center rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/40 transition-colors"
          >
            <PanelLeftOpen className="w-[18px] h-[18px]" />
          </button>
        )}

        <div className={`h-[1px] bg-[#1e1e23] ${expanded ? 'w-full' : 'w-8 self-center'}`} />

        {/* Navigation Items */}
        <nav className={`flex flex-col gap-2 w-full ${expanded ? '' : 'items-center'}`}>
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activePage === item.id
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                title={item.label}
                className={`${row} rounded-lg flex items-center relative transition-all duration-200 group ${
                  isActive
                    ? 'bg-zinc-800/40 text-white border border-[var(--border-medium)]'
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40'
                }`}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <div className="absolute left-0 w-[3px] h-5 bg-white rounded-r-md" />
                )}
                <Icon className={`w-[18px] h-[18px] flex-shrink-0 transition-transform group-hover:scale-105 ${isActive ? 'text-white' : ''}`} />
                {expanded && <span className="text-xs font-medium whitespace-nowrap">{item.label}</span>}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Bottom items */}
      <div className={`flex flex-col gap-2 w-full ${expanded ? '' : 'items-center'}`}>
        <button
          onClick={() => onShowToast('Settings opened')}
          title="Settings"
          className={`${row} rounded-lg flex items-center text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40 transition-colors`}
        >
          <Settings className="w-[18px] h-[18px] flex-shrink-0" />
          {expanded && <span className="text-xs font-medium whitespace-nowrap">Settings</span>}
        </button>
        <button
          onClick={() => onShowToast('Help Center')}
          title="Help"
          className={`${row} rounded-lg flex items-center text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40 transition-colors`}
        >
          <HelpCircle className="w-[18px] h-[18px] flex-shrink-0" />
          {expanded && <span className="text-xs font-medium whitespace-nowrap">Help Center</span>}
        </button>
        <div className={`h-px bg-[var(--border-medium)] my-1 ${expanded ? 'w-full' : 'w-8 self-center'}`} />
        <button
          onClick={onLogout}
          title="Logout"
          className={`${row} rounded-lg flex items-center text-zinc-600 hover:text-rose-400 hover:bg-rose-950/30 transition-colors`}
        >
          <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
          {expanded && <span className="text-xs font-medium whitespace-nowrap">Logout</span>}
        </button>
        <Footprint varian={expanded ? 'wide' : 'mark'} />
      </div>
    </aside>
  )
}
