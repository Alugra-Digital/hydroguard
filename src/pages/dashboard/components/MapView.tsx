import { useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Tooltip, Popup, Polyline } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import {
  AT_RISK_KELURAHAN, SENSOR_MARKERS, CCTV_LIST, SHELTER_LIST,
  EVAC_ROUTES, PREDICTION_LOGS,
} from '../data'
import type { RiskKelurahan } from '../types'
import SensorDetailModal from './SensorDetailModal'

interface MapViewProps { isDark?: boolean }

// ── Layer config ─────────────────────────────────────────
const LAYERS = {
  zones:    { label: 'Zona Risiko', color: '#ef4444' },
  sensors:  { label: 'Sensor IoT',  color: '#3b82f6' },
  cctv:     { label: 'CCTV',        color: '#a855f7' },
  shelters: { label: 'Posko',       color: '#10b981' },
  evac:     { label: 'Evakuasi',    color: '#f59e0b' },
} as const
type LayerKey = keyof typeof LAYERS

// ── Color maps ────────────────────────────────────────────
const ZONE_COLOR: Record<string, string>    = { critical:'#ef4444', high:'#f97316', medium:'#f59e0b', low:'#10b981' }
const SENSOR_COLOR: Record<string, string>  = { siaga1:'#ef4444', siaga2:'#f97316', siaga3:'#f59e0b', normal:'#10b981', offline:'#71717a' }
const CCTV_COLOR: Record<string, string>    = { alert:'#ef4444', online:'#10b981', offline:'#71717a' }
const SHELTER_COLOR: Record<string, string> = { active:'#3b82f6', standby:'#52525b' }
const EVAC_COLOR: Record<string, string>    = { aman:'#10b981', terbatas:'#f97316', tertutup:'#ef4444' }
const RISK_LABEL: Record<string, string>    = { critical:'Kritis', high:'Tinggi', medium:'Sedang', low:'Rendah' }

// ── Popup base style ──────────────────────────────────────
const popupBase = (isDark: boolean): React.CSSProperties => ({
  fontFamily: 'ui-sans-serif, system-ui, sans-serif',
  padding: '12px 14px',
  minWidth: 210,
  color: isDark ? '#a1a1aa' : '#475569',
})
const popupTitle = (isDark: boolean): React.CSSProperties => ({
  fontSize: 13, fontWeight: 700, marginBottom: 4,
  color: isDark ? '#f4f4f5' : '#0f172a',
})
const popupSub = (): React.CSSProperties => ({ fontSize: 10, color: '#71717a', marginBottom: 8 })
const badgeStyle = (color: string): React.CSSProperties => ({
  display: 'inline-flex', alignItems: 'center', gap: 4,
  padding: '2px 8px', borderRadius: 20, fontSize: 9, fontWeight: 700,
  textTransform: 'uppercase', letterSpacing: '0.04em',
  border: `1px solid ${color}50`, background: color + '18', color,
})
const btnStyle = (color: string): React.CSSProperties => ({
  width: '100%', padding: '6px 0', marginTop: 10, borderRadius: 8,
  background: color, color: '#fff', fontSize: 11, fontWeight: 700,
  border: 'none', cursor: 'pointer',
})

// ── Find RiskKelurahan for a sensor ──────────────────────
function kelForSensor(sensorArea: string, sensorKelurahan: string): RiskKelurahan {
  return (
    AT_RISK_KELURAHAN.find(k => k.name === sensorKelurahan) ??
    AT_RISK_KELURAHAN.find(k => k.kecamatan === sensorArea) ?? {
      id: 'syn', name: sensorKelurahan, kecamatan: sensorArea,
      lat: 0, lng: 0, riskLevel: 'medium' as const,
    }
  )
}

export default function MapView({ isDark = true }: MapViewProps) {
  const [layers, setLayers]           = useState<Record<LayerKey, boolean>>({ zones:true, sensors:true, cctv:true, shelters:true, evac:true })
  const [selectedKel, setSelectedKel] = useState<RiskKelurahan | null>(null)
  const [showModal, setShowModal]     = useState(false)

  const tileUrl = isDark
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'

  const toggle = (k: LayerKey) => setLayers(p => ({ ...p, [k]: !p[k] }))
  const openModal = (kel: RiskKelurahan) => { setSelectedKel(kel); setShowModal(true) }

  // Stats
  const criticalCount = AT_RISK_KELURAHAN.filter(k => k.riskLevel === 'critical').length
  const highCount     = AT_RISK_KELURAHAN.filter(k => k.riskLevel === 'high').length
  const mediumCount   = AT_RISK_KELURAHAN.filter(k => k.riskLevel === 'medium').length
  const cctvAlert     = CCTV_LIST.filter(c => c.status === 'alert').length

  return (
    <>
      <div className="relative" style={{ height: 460 }}>

        {/* ── Layer Toggles ── */}
        <div
          className="absolute top-3 right-3 z-[1001] flex flex-wrap gap-1 justify-end"
          style={{ maxWidth: 'calc(100% - 60px)' }}
        >
          {(Object.keys(LAYERS) as LayerKey[]).map(k => (
            <button
              key={k}
              onClick={() => toggle(k)}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-[10.5px] font-semibold transition-all border"
              style={{
                background: layers[k] ? (LAYERS[k].color + '22') : (isDark ? 'rgba(12,12,14,0.85)' : 'rgba(255,255,255,0.85)'),
                borderColor: layers[k] ? LAYERS[k].color : (isDark ? '#27272a' : '#e2e8f0'),
                color: layers[k] ? LAYERS[k].color : (isDark ? '#71717a' : '#64748b'),
                backdropFilter: 'blur(8px)',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: layers[k] ? LAYERS[k].color : (isDark ? '#3f3f46' : '#94a3b8') }} />
              {LAYERS[k].label}
            </button>
          ))}
        </div>

        <MapContainer
          center={[-6.2615, 106.8106]} zoom={12}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true} scrollWheelZoom={true} doubleClickZoom={true} attributionControl={true}
        >
          <TileLayer key={tileUrl} url={tileUrl}
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
            subdomains="abcd" maxZoom={19} />

          {/* ═══ LAYER 1: Zona Risiko (heatmap) ═══ */}
          {layers.zones && AT_RISK_KELURAHAN.map(k => {
            const color = ZONE_COLOR[k.riskLevel]
            const r = k.riskLevel === 'critical' ? 35 : k.riskLevel === 'high' ? 25 : 16
            return [
              <CircleMarker key={`z-out-${k.id}`} center={[k.lat, k.lng]} radius={r}
                pathOptions={{ color:'transparent', fillColor:color, fillOpacity:0.07, weight:0 }} />,
              <CircleMarker key={`z-mid-${k.id}`} center={[k.lat, k.lng]} radius={Math.round(r*0.55)}
                pathOptions={{ color:'transparent', fillColor:color, fillOpacity:0.16, weight:0 }} />,
              <CircleMarker key={`z-dot-${k.id}`} center={[k.lat, k.lng]} radius={k.riskLevel === 'critical' ? 6 : k.riskLevel === 'high' ? 5 : 4}
                pathOptions={{ color, fillColor:color, fillOpacity:0.9, weight:1.5 }}>
                <Popup><div style={popupBase(isDark)}>
                  <div style={popupTitle(isDark)}>{k.name}</div>
                  <div style={popupSub()}>{k.kecamatan}</div>
                  {(() => {
                    const p = PREDICTION_LOGS.find(x => x.kelurahan === k.name)
                    return p ? (
                      <>
                        <div style={{ display:'flex', gap:8, marginBottom:8 }}>
                          <span style={badgeStyle(color)}>{RISK_LABEL[k.riskLevel]}</span>
                          <span style={{ fontSize:11, fontWeight:700, color }}>{p.riskScore}/100</span>
                        </div>
                        <div style={{ fontSize:10, color: isDark ? '#71717a' : '#64748b', lineHeight:1.6 }}>
                          <div>1j: <b>{p.prob1h}%</b> · {p.depth1h}cm</div>
                          <div>3j: <b>{p.prob3h}%</b></div>
                          <div>Driver: {p.driver}</div>
                        </div>
                      </>
                    ) : <span style={badgeStyle(color)}>{RISK_LABEL[k.riskLevel]}</span>
                  })()}
                </div></Popup>
              </CircleMarker>
            ]
          })}

          {/* ═══ LAYER 2: Sensor IoT ═══ */}
          {layers.sensors && SENSOR_MARKERS.map(s => {
            const color = SENSOR_COLOR[s.status] ?? '#71717a'
            return (
              <CircleMarker key={`sns-${s.id}`} center={[s.lat, s.lng]} radius={s.isOnline ? 5 : 4}
                pathOptions={{ color, fillColor:color, fillOpacity: s.isOnline ? 0.85 : 0.4, weight:1.5, dashArray: s.isOnline ? undefined : '3,3' }}>
                <Tooltip direction="top" offset={[0,-6]} opacity={1} className="hg-tooltip">
                  <div className="hg-tooltip-inner">
                    <div className="hg-tooltip-name">{s.id}</div>
                    <div style={{color:'#94a3b8'}}>{s.name}</div>
                  </div>
                </Tooltip>
                <Popup><div style={popupBase(isDark)}>
                  <div style={popupTitle(isDark)}>{s.name}</div>
                  <div style={popupSub()}>{s.kelurahan} · {s.area}</div>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                    <span style={{ fontSize:18, fontWeight:700, color }}>{s.value} <span style={{fontSize:11}}>{s.unit}</span></span>
                    <span style={badgeStyle(color)}>{s.status}</span>
                  </div>
                  <button style={btnStyle(color)} onClick={() => openModal(kelForSensor(s.area, s.kelurahan))}>
                    Detail Sensor →
                  </button>
                </div></Popup>
              </CircleMarker>
            )
          })}

          {/* ═══ LAYER 3: CCTV ═══ */}
          {layers.cctv && CCTV_LIST.map(c => {
            const color = CCTV_COLOR[c.status] ?? '#71717a'
            return (
              <CircleMarker key={`cctv-${c.id}`} center={[c.coordinates.lat, c.coordinates.lng]} radius={6}
                pathOptions={{ color, fillColor: c.status === 'alert' ? color : 'transparent', fillOpacity: c.status === 'alert' ? 0.3 : 0, weight: 2, dashArray: c.status === 'offline' ? '3,3' : undefined }}>
                <Popup><div style={popupBase(isDark)}>
                  <div style={popupTitle(isDark)}>{c.name}</div>
                  <div style={popupSub()}>{c.location}</div>
                  <div style={{ display:'flex', gap:6, marginBottom:8 }}>
                    <span style={badgeStyle(color)}>{c.status === 'alert' ? '⚠ ALERT' : c.status === 'online' ? '● Live' : '○ Offline'}</span>
                    {c.detections.flooding && (
                      <span style={badgeStyle('#ef4444')}>Banjir ~{c.detections.waterLevel}cm</span>
                    )}
                  </div>
                  {c.detections.vehiclesStranded > 0 && (
                    <div style={{ fontSize:10, color:'#f97316', marginBottom:6 }}>
                      {c.detections.vehiclesStranded} kendaraan terjebak
                    </div>
                  )}
                  {c.embedUrl && (
                    <a href={c.embedUrl} target="_blank" rel="noreferrer" style={{ ...btnStyle(color), display:'block', textAlign:'center', textDecoration:'none' }}>
                      Live Feed →
                    </a>
                  )}
                </div></Popup>
              </CircleMarker>
            )
          })}

          {/* ═══ LAYER 4: Posko/Shelters ═══ */}
          {layers.shelters && SHELTER_LIST.map(sh => {
            const color = SHELTER_COLOR[sh.status] ?? '#52525b'
            const pct   = Math.round((sh.currentOccupancy / sh.capacity) * 100)
            return (
              <CircleMarker key={`sh-${sh.id}`} center={[sh.lat, sh.lng]} radius={7}
                pathOptions={{ color, fillColor:color, fillOpacity:0.25, weight:2.5 }}>
                <Popup><div style={popupBase(isDark)}>
                  <div style={popupTitle(isDark)}>{sh.name}</div>
                  <div style={popupSub()}>{sh.address}</div>
                  <div style={{ display:'flex', gap:6, alignItems:'center', marginBottom:8 }}>
                    <span style={badgeStyle(color)}>{sh.status === 'active' ? 'Aktif' : 'Standby'}</span>
                    {sh.currentOccupancy > 0 && (
                      <span style={{ fontSize:10, fontWeight:700, color }}>{sh.currentOccupancy} jiwa</span>
                    )}
                  </div>
                  <div style={{ fontSize:10, color: isDark ? '#71717a' : '#64748b', marginBottom:6 }}>
                    Kapasitas: {sh.currentOccupancy}/{sh.capacity} ({pct}%)
                  </div>
                  <div style={{ height:4, background: isDark ? '#27272a' : '#e2e8f0', borderRadius:2, overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${pct}%`, background: pct > 75 ? '#ef4444' : pct > 40 ? '#f59e0b' : color, borderRadius:2 }} />
                  </div>
                </div></Popup>
              </CircleMarker>
            )
          })}

          {/* ═══ LAYER 5: Jalur Evakuasi ═══ */}
          {layers.evac && EVAC_ROUTES.map(r => {
            const color = EVAC_COLOR[r.status] ?? '#71717a'
            return (
              <Polyline key={`evac-${r.id}`} positions={r.path}
                pathOptions={{ color, weight:3, dashArray: r.status === 'tertutup' ? '8,6' : r.status === 'terbatas' ? '4,4' : undefined, opacity:0.75 }}>
                <Popup><div style={popupBase(isDark)}>
                  <div style={popupTitle(isDark)}>{r.name}</div>
                  <div style={popupSub()}>Kelurahan {r.kelurahan}</div>
                  <span style={badgeStyle(color)}>
                    {r.status === 'aman' ? '✓ Aman' : r.status === 'terbatas' ? '⚠ Terbatas' : '✕ Tertutup'}
                  </span>
                </div></Popup>
              </Polyline>
            )
          })}
        </MapContainer>

        {/* Stats bar */}
        <div
          className={`absolute bottom-0 left-0 right-0 border-t px-4 py-2.5 flex items-center justify-between ${
            isDark ? 'border-[#19191c] bg-[#070708]/90' : 'border-[rgba(255,255,255,0.5)] bg-[rgba(214,234,248,0.75)] backdrop-blur-md'
          }`}
          style={{ zIndex: 1000 }}
        >
          <div className="flex items-center gap-3 text-[10.5px] font-medium flex-wrap">
            {[
              { color:'#ef4444', label:'Kritis', count:criticalCount },
              { color:'#f97316', label:'Tinggi', count:highCount },
              { color:'#f59e0b', label:'Sedang', count:mediumCount },
            ].map(x => (
              <div key={x.label} className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ background:x.color }} />
                <span className="text-zinc-500">{x.label} <span className="text-white font-bold">{x.count}</span></span>
              </div>
            ))}
            <span className="text-zinc-700">·</span>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              <span className="text-zinc-500">CCTV Alert <span className="text-rose-400 font-bold">{cctvAlert}</span></span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-zinc-500">Sensor <span className="text-white font-bold">{SENSOR_MARKERS.filter(s=>s.isOnline).length}/{SENSOR_MARKERS.length}</span></span>
            </div>
          </div>
          <span className="text-[10.5px] text-zinc-600 font-mono flex-shrink-0">
            {SHELTER_LIST.filter(s=>s.status==='active').length} posko aktif · {EVAC_ROUTES.filter(r=>r.status==='aman').length}/{EVAC_ROUTES.length} jalur aman
          </span>
        </div>
      </div>

      {/* Sensor detail modal */}
      {showModal && selectedKel && (
        <SensorDetailModal kelurahan={selectedKel} isDark={isDark}
          onClose={() => { setShowModal(false); setSelectedKel(null) }} />
      )}
    </>
  )
}
