import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import Sidebar from './components/layout/Sidebar'
import TopBar  from './components/layout/TopBar'
import ChatAI, { ChatAIPage } from './components/ChatAI'

import LoginPage             from './pages/login'
import DashboardPage         from './pages/dashboard'
import AlertManagementPage   from './pages/alert-management'
import CCTVMonitorPage       from './pages/cctv-monitor'
import ExecutiveViewPage     from './pages/executive-view'
import FieldCoordinatorPage  from './pages/field-coordinator'
import IncidentHistoryPage   from './pages/incident-history'
import PredictionAnalysisPage from './pages/prediction-analysis'
import ResourceManagementPage from './pages/resource-management'
import SensorNetworkPage     from './pages/sensor-network'

// page-id → URL path mapping
const PAGE_PATHS: Record<string, string> = {
  'command-center':       '/command-center',
  'executive-view':       '/executive-view',
  'alert-management':     '/alert-management',
  'sensor-network':       '/sensor-network',
  'cctv-monitor':         '/cctv-monitor',
  'field-coordinator':    '/field-coordinator',
  'resource-management':  '/resource-management',
  'prediction-analysis':  '/prediction-analysis',
  'incident-history':     '/incident-history',
  'chat-ai':              '/chat-ai',
}

// URL path → page-id
const PATH_TO_PAGE = Object.fromEntries(
  Object.entries(PAGE_PATHS).map(([k, v]) => [v, k])
)

function AppLayout() {
  const navigate  = useNavigate()
  const location  = useLocation()

  const [isLoggedIn, setIsLoggedIn]       = useState(() => sessionStorage.getItem('hg_auth') === '1')
  const [isDark, setIsDark]               = useState(true)
  const [toastMessage, setToastMessage]   = useState<string | null>(null)
  const [pipelineName, setPipelineName]   = useState('Jakarta Selatan')
  const [searchTerm, setSearchTerm]       = useState('')
  const [isNewFlowModalOpen, setNewFlow]  = useState(false)

  // active page derived from URL
  const activePage = PATH_TO_PAGE[location.pathname] ?? 'command-center'

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleLogin = () => {
    sessionStorage.setItem('hg_auth', '1')
    setIsLoggedIn(true)
    navigate('/command-center', { replace: true })
  }

  const handleLogout = () => {
    sessionStorage.removeItem('hg_auth')
    setIsLoggedIn(false)
    navigate('/login', { replace: true })
  }

  const handleNavigate = (pageId: string) => {
    const path = PAGE_PATHS[pageId] ?? '/command-center'
    navigate(path)
  }

  // Not logged in → redirect to /login
  if (!isLoggedIn) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="*"      element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  const dashPage = (
    <DashboardPage
      isDark={isDark}
      pipelineName={pipelineName}
      onPipelineNameChange={setPipelineName}
      searchTerm={searchTerm}
      isNewFlowModalOpen={isNewFlowModalOpen}
      onCloseNewFlowModal={() => setNewFlow(false)}
      showToast={showToast}
    />
  )

  return (
    <div
      data-theme={isDark ? 'dark' : 'light'}
      className="h-screen bg-[var(--bg-base)] text-[var(--text-root)] flex relative overflow-hidden antialiased"
    >
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 px-4 py-3 rounded-lg shadow-xl shadow-black/80 backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      <Sidebar
        activePage={activePage}
        onNavigate={handleNavigate}
        onShowToast={showToast}
        onLogout={handleLogout}
      />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-0">
        <TopBar
          pipelineName={pipelineName}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          isDark={isDark}
          onToggleDark={() => setIsDark(p => !p)}
          onNewFlow={() => setNewFlow(true)}
          onShowToast={showToast}
        />

        <Routes>
          <Route path="/command-center"      element={dashPage} />
          <Route path="/executive-view"      element={<ExecutiveViewPage />} />
          <Route path="/alert-management"    element={<AlertManagementPage />} />
          <Route path="/sensor-network"      element={<SensorNetworkPage />} />
          <Route path="/cctv-monitor"        element={<CCTVMonitorPage />} />
          <Route path="/field-coordinator"   element={<FieldCoordinatorPage />} />
          <Route path="/resource-management" element={<ResourceManagementPage />} />
          <Route path="/prediction-analysis" element={<PredictionAnalysisPage />} />
          <Route path="/incident-history"    element={<IncidentHistoryPage />} />
          <Route path="/chat-ai"             element={<ChatAIPage />} />
          <Route path="/"                    element={<Navigate to="/command-center" replace />} />
          <Route path="*"                    element={<Navigate to="/command-center" replace />} />
        </Routes>
      </main>

      {/* Quick chat tidak ditumpuk di atas halaman Chat AI itu sendiri. */}
      {location.pathname !== PAGE_PATHS['chat-ai'] && <ChatAI />}
    </div>
  )
}

export default function App() {
  return <AppLayout />
}
