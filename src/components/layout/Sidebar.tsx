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
} from 'lucide-react'

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
  return (
    <aside className="w-[68px] bg-[var(--bg-sidebar)] border-r border-[var(--border-main)] flex flex-col items-center py-4 flex-shrink-0 z-20 justify-between select-none">
      <div className="flex flex-col gap-6 items-center w-full">
        {/* Logo */}
        <div
          onClick={() => onShowToast('Hydroguard home console')}
          className="w-10 h-10 rounded-xl bg-black border border-[var(--border-medium)] hover:border-zinc-400 transition-all duration-300 cursor-pointer flex items-center justify-center group"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-2 group-hover:scale-105 transition-transform" style={{ stroke: 'var(--logo-color)' }}>
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 15c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5z" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 7c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" style={{ fill: 'var(--logo-color)' }} />
          </svg>
        </div>

        <div className="w-8 h-[1px] bg-[#1e1e23] my-1" />

        {/* Navigation Items */}
        <nav className="flex flex-col gap-2 w-full items-center">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activePage === item.id
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                title={item.label}
                className={`w-12 h-12 rounded-lg flex items-center justify-center relative transition-all duration-200 group ${
                  isActive
                    ? 'bg-zinc-800/40 text-white border border-[var(--border-medium)]'
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40'
                }`}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <div className="absolute left-0 w-[3px] h-5 bg-white rounded-r-md" />
                )}
                <Icon className={`w-[18px] h-[18px] transition-transform group-hover:scale-105 ${isActive ? 'text-white' : ''}`} />
              </button>
            )
          })}
        </nav>
      </div>

      {/* Bottom items */}
      <div className="flex flex-col gap-2 w-full items-center">
        <button
          onClick={() => onShowToast('Settings opened')}
          title="Settings"
          className="w-12 h-12 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40 transition-colors"
        >
          <Settings className="w-[18px] h-[18px]" />
        </button>
        <button
          onClick={() => onShowToast('Help Center')}
          title="Help"
          className="w-12 h-12 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40 transition-colors"
        >
          <HelpCircle className="w-[18px] h-[18px]" />
        </button>
        <div className="w-8 h-px bg-[var(--border-medium)] my-1" />
        <button
          onClick={onLogout}
          title="Logout"
          className="w-12 h-12 rounded-lg flex items-center justify-center text-zinc-600 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
        >
          <LogOut className="w-[18px] h-[18px]" />
        </button>
      </div>
    </aside>
  )
}
