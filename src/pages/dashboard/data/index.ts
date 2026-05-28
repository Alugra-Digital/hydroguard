import {
  activeAlertsData,
  weatherData,
  sensorsData,
  predictionsData,
  kelurahanData,
  alertLevelMeta,
  riskLevelMeta,
  driverLabel,
  cctvData,
  cctvStatusMeta,
  sheltersData,
  evacRoutesData,
  evacStatusMeta,
  pumpsData,
  boatsData,
  personnelData,
} from '../../../mock/commandCenter'

import type { AlertItem, PredictionItem, RiskKelurahan, KecamatanRisk } from '../types'

// ── Sensor stats ──────────────────────────────────────────
const waterLevelSensors = sensorsData.filter((s) => s.type === 'water_level' && s.isOnline)
const avgTMA      = Math.round(waterLevelSensors.reduce((sum, s) => sum + s.currentValue, 0) / waterLevelSensors.length)
const totalOnline = sensorsData.filter((s) => s.isOnline).length
const totalSensors = sensorsData.length

// ── Risk summary from predictions ─────────────────────────
const RISK_SUMMARY = {
  critical: predictionsData.filter((p) => p.riskLevel === 'critical').length,
  high:     predictionsData.filter((p) => p.riskLevel === 'high').length,
  medium:   predictionsData.filter((p) => p.riskLevel === 'medium').length,
  low:      predictionsData.filter((p) => p.riskLevel === 'low').length,
}

// ── Key sensor values ─────────────────────────────────────
const snsMampang   = sensorsData.find((s) => s.id === 'SNS-001') // Kali Mampang — Pela Mampang
const snsCiliwung  = sensorsData.find((s) => s.id === 'SNS-023') // Kali Ciliwung — Pejaten Timur
const snsPesanggrahan = sensorsData.find((s) => s.id === 'SNS-011') // Kali Pesanggrahan — Cipulir

// ── KPI snapshot ──────────────────────────────────────────
export const DASHBOARD_STATS = {
  // Row 1
  totalSensors,
  onlineSensors: totalOnline,
  avgTMA,
  rainfall:      weatherData.current.rainfall,
  totalAlerts:   activeAlertsData.length,
  // Row 2
  zonaKritis:    RISK_SUMMARY.critical,
  zonaTinggi:    RISK_SUMMARY.high,
  temperature:   weatherData.current.temperature,
  humidity:      weatherData.current.humidity,
  // Meta
  bmkgWarning:    weatherData.bmkgWarning,
  radarIntensity: weatherData.radarIntensity,
  // River sensors
  tmaMampang:     snsMampang?.currentValue ?? 0,
  statusMampang:  snsMampang?.status ?? 'normal',
  tmaCiliwung:    snsCiliwung?.currentValue ?? 0,
  statusCiliwung: snsCiliwung?.status ?? 'normal',
  tmaPesanggrahan:    snsPesanggrahan?.currentValue ?? 0,
  statusPesanggrahan: snsPesanggrahan?.status ?? 'normal',
  // Kelurahan counts by risk
  criticalKelurahan: predictionsData.filter((p) => p.riskLevel === 'critical').length,
  highKelurahan:     predictionsData.filter((p) => p.riskLevel === 'high').length,
}

// ── Weather current + forecast ────────────────────────────
export const WEATHER_CURRENT = {
  rainfall:    weatherData.current.rainfall,
  temperature: weatherData.current.temperature,
  humidity:    weatherData.current.humidity,
  windSpeed:   weatherData.current.windSpeed,
  windDir:     weatherData.current.windDirection,
  visibility:  weatherData.current.visibility,
  source:      weatherData.current.source,
  radarLabel:  weatherData.radarIntensity,
  lastUpdate:  weatherData.lastRadarUpdate,
}

export const FORECAST_6H = weatherData.forecast6h as Array<{
  hour: string
  rainfall: number
  probability: number
}>

export const BMKG_WARNING = weatherData.bmkgWarning

// ── Alert logs → table ────────────────────────────────────
export const ALERT_LOGS: AlertItem[] = activeAlertsData.map((alert) => ({
  time:       new Date(alert.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
  sensorId:   alert.sensorId,
  trigger:    alert.trigger,
  location:   alert.location,
  level:      alert.level as AlertItem['level'],
  aiProb:     alert.aiPrediction.probability,
  estDepth:   alert.aiPrediction.estimatedDepth,
  estTimeMin: alert.aiPrediction.estimatedTime,
}))

// ── Prediction logs → table ───────────────────────────────
export const PREDICTION_LOGS: PredictionItem[] = predictionsData.map((p) => ({
  kelurahan:  p.kelurahan,
  kecamatan:  p.kecamatan,
  riskScore:  p.riskScore,
  riskLevel:  p.riskLevel as PredictionItem['riskLevel'],
  driver:     (driverLabel as Record<string, string>)[p.primaryDriver] ?? p.primaryDriver,
  prob1h:     p.forecast['1h'].probability,
  prob3h:     p.forecast['3h'].probability,
  prob6h:     p.forecast['6h'].probability,
  depth1h:    p.forecast['1h'].estimatedDepth,
}))

// ── Pipeline data per kecamatan ──────────────────────────
export interface KecPipeline {
  kecamatan:    string
  river:        string
  sensorLabel:  string
  tma:          number   // cm
  tmaChange:    number   // +cm per jam
  tmaStatus:    string   // siaga1/2/3/normal
  threshold:    number   // ambang batas yang sedang dimonitor (cm)
  overflowProb: number   // % probabilitas luapan 1 jam ke depan
  estDepth:     number   // cm estimasi kedalaman genangan
  estTimeMin:   number   // menit estimasi hingga genangan
  driver:       string   // "Curah Hujan" | "Backwater" | "Kombinasi"
  maxRiskLevel: string   // critical/high/medium/low
  riskScore:    number
  monitored:    string[] // kelurahan yang dimonitor
}

export const PIPELINE_BY_KECAMATAN: KecPipeline[] = [
  {
    kecamatan: 'Mampang Prapatan', river: 'Kali Mampang',
    sensorLabel: 'SNS-001', tma: 215, tmaChange: 12, tmaStatus: 'siaga2', threshold: 200,
    overflowProb: 82, estDepth: 35, estTimeMin: 45, driver: 'Kombinasi',
    maxRiskLevel: 'critical', riskScore: 88, monitored: ['Pela Mampang', 'Tegal Parang'],
  },
  {
    kecamatan: 'Kebayoran Lama', river: 'Kali Pesanggrahan',
    sensorLabel: 'SNS-011', tma: 232, tmaChange: 16, tmaStatus: 'siaga2', threshold: 200,
    overflowProb: 86, estDepth: 42, estTimeMin: 30, driver: 'Curah Hujan',
    maxRiskLevel: 'critical', riskScore: 91, monitored: ['Cipulir', 'Kebayoran Lama Selatan'],
  },
  {
    kecamatan: 'Tebet', river: 'Kali Ciliwung',
    sensorLabel: 'SNS-023', tma: 198, tmaChange: 11, tmaStatus: 'siaga3', threshold: 150,
    overflowProb: 78, estDepth: 38, estTimeMin: 50, driver: 'Backwater',
    maxRiskLevel: 'critical', riskScore: 86, monitored: ['Bukit Duri', 'Manggarai'],
  },
  {
    kecamatan: 'Pancoran', river: 'Kali Ciliwung',
    sensorLabel: 'SNS-023', tma: 198, tmaChange: 11, tmaStatus: 'siaga3', threshold: 150,
    overflowProb: 76, estDepth: 30, estTimeMin: 55, driver: 'Backwater',
    maxRiskLevel: 'critical', riskScore: 84, monitored: ['Rawajati', 'Kalibata'],
  },
  {
    kecamatan: 'Pasar Minggu', river: 'Kali Ciliwung',
    sensorLabel: 'SNS-024', tma: 167, tmaChange: 6, tmaStatus: 'siaga3', threshold: 150,
    overflowProb: 70, estDepth: 25, estTimeMin: 60, driver: 'Backwater',
    maxRiskLevel: 'high', riskScore: 77, monitored: ['Pejaten Timur', 'Pasar Minggu'],
  },
  {
    kecamatan: 'Pesanggrahan', river: 'Kali Pesanggrahan',
    sensorLabel: 'SNS-012', tma: 178, tmaChange: 7, tmaStatus: 'siaga3', threshold: 150,
    overflowProb: 64, estDepth: 22, estTimeMin: 75, driver: 'Curah Hujan',
    maxRiskLevel: 'high', riskScore: 72, monitored: ['Ulujami', 'Bintaro'],
  },
  {
    kecamatan: 'Kebayoran Baru', river: 'Kali Krukut',
    sensorLabel: 'SNS-018', tma: 192, tmaChange: 10, tmaStatus: 'siaga3', threshold: 150,
    overflowProb: 58, estDepth: 20, estTimeMin: 90, driver: 'Kombinasi',
    maxRiskLevel: 'medium', riskScore: 67, monitored: ['Petogogan', 'Gandaria Utara'],
  },
  {
    kecamatan: 'Cilandak', river: 'Kali Grogol',
    sensorLabel: 'SNS-028', tma: 145, tmaChange: 4, tmaStatus: 'normal', threshold: 150,
    overflowProb: 48, estDepth: 15, estTimeMin: 120, driver: 'Curah Hujan',
    maxRiskLevel: 'medium', riskScore: 58, monitored: ['Pondok Labu', 'Cilandak Barat'],
  },
  {
    kecamatan: 'Setiabudi', river: 'Kali Krukut',
    sensorLabel: 'SNS-008', tma: 110, tmaChange: 1, tmaStatus: 'normal', threshold: 150,
    overflowProb: 45, estDepth: 14, estTimeMin: 150, driver: 'Curah Hujan',
    maxRiskLevel: 'medium', riskScore: 55, monitored: ['Pasar Manggis', 'Menteng Atas'],
  },
  {
    kecamatan: 'Jagakarsa', river: 'Kali Ciliwung Hulu',
    sensorLabel: 'SNS-026', tma: 109, tmaChange: 0, tmaStatus: 'normal', threshold: 150,
    overflowProb: 52, estDepth: 18, estTimeMin: 130, driver: 'Backwater',
    maxRiskLevel: 'medium', riskScore: 61, monitored: ['Tanjung Barat', 'Lenteng Agung'],
  },
]

// ── Kecamatan risk summary ────────────────────────────────
const RISK_ORDER: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1 }

const kelurahanCountByKec: Record<string, number> = {}
kelurahanData.forEach((k) => {
  kelurahanCountByKec[k.kecamatan] = (kelurahanCountByKec[k.kecamatan] || 0) + 1
})

const predByKec: Record<string, typeof predictionsData> = {}
predictionsData.forEach((p) => {
  if (!predByKec[p.kecamatan]) predByKec[p.kecamatan] = []
  predByKec[p.kecamatan].push(p)
})

export const KECAMATAN_RISK: KecamatanRisk[] = Object.entries(predByKec)
  .map(([kecamatan, items]) => {
    const topItem = items.reduce((a, b) =>
      RISK_ORDER[a.riskLevel] >= RISK_ORDER[b.riskLevel] ? a : b
    )
    const avgScore = Math.round(items.reduce((s, i) => s + i.riskScore, 0) / items.length)
    const drivers  = [...new Set(items.map((i) => (driverLabel as Record<string, string>)[i.primaryDriver] ?? i.primaryDriver))]
    return {
      kecamatan,
      maxRiskLevel: topItem.riskLevel as KecamatanRisk['maxRiskLevel'],
      avgScore,
      kelurahanCount: kelurahanCountByKec[kecamatan] ?? items.length,
      monitoredCount: items.length,
      drivers,
    }
  })
  .sort((a, b) => RISK_ORDER[b.maxRiskLevel] - RISK_ORDER[a.maxRiskLevel])

// ── At-risk kelurahan → map markers ──────────────────────
export const AT_RISK_KELURAHAN: RiskKelurahan[] = kelurahanData
  .filter((k) => k.riskLevel !== 'low')
  .map((k) => ({
    id:        k.id,
    name:      k.name,
    kecamatan: k.kecamatan,
    lat:       k.lat,
    lng:       k.lng,
    riskLevel: k.riskLevel as RiskKelurahan['riskLevel'],
  }))

// ── Re-exports ────────────────────────────────────────────
export { alertLevelMeta, riskLevelMeta }
export const TIME_RANGES = ['Last Hour', 'Last 24 Hours', 'Last 7 Days', 'Last 30 Days'] as const

import type { CctvItem, ShelterItem, EvacRoute, ResourceSummary } from '../types'

// ── Sensor list ───────────────────────────────────────────
export interface SensorListItem {
  id:           string
  name:         string
  area:         string
  kelurahan:    string
  type:         string   // 'water_level' | 'rain_gauge' | 'combined'
  tma:          number
  unit:         string   // 'cm' | 'mm/jam'
  status:       string   // 'siaga1' | 'siaga2' | 'siaga3' | 'normal' | 'offline'
  battery:      number   // 0-100
  signal:       number   // 0-5
  rateOfChange: number   // cm or mm per hour
  isOnline:     boolean
}

const STATUS_ORDER: Record<string, number> = { siaga1: 5, siaga2: 4, siaga3: 3, normal: 2, offline: 1 }

export const SENSOR_LIST: SensorListItem[] = sensorsData
  .map((s) => ({
    id:           s.id,
    name:         s.name,
    area:         s.area,
    kelurahan:    s.kelurahan,
    type:         s.type,
    tma:          s.currentValue,
    unit:         s.unit,
    status:       s.isOnline ? s.status : 'offline',
    battery:      s.battery,
    signal:       s.signal,
    rateOfChange: s.rateOfChange,
    isOnline:     s.isOnline,
  }))
  .sort((a, b) => (STATUS_ORDER[b.status] ?? 0) - (STATUS_ORDER[a.status] ?? 0))

// ── CCTV, Shelters, Evac Routes, Resources ────────────────
export const CCTV_LIST: CctvItem[] = cctvData as CctvItem[]

export const SHELTER_LIST: ShelterItem[] = sheltersData as ShelterItem[]

export const EVAC_ROUTES: EvacRoute[] = evacRoutesData as EvacRoute[]

export const RESOURCE_SUMMARY: ResourceSummary = {
  pumpsDeployed:   pumpsData.filter((p: any) => p.status === 'deployed').length,
  pumpsTotal:      pumpsData.length,
  boatsDeployed:   boatsData.filter((b: any) => b.status === 'deployed').length,
  boatsTotal:      boatsData.length,
  personnelActive: personnelData.filter((p: any) => p.status === 'active').length,
  personnelTotal:  personnelData.length,
}

export { cctvStatusMeta, evacStatusMeta }
export const PUMPS_DATA     = pumpsData
export const BOATS_DATA     = boatsData
export const PERSONNEL_DATA = personnelData

// ── Sensor map markers (with lat/lng for Leaflet) ────────
export const SENSOR_MARKERS = sensorsData.map((s) => ({
  id:        s.id as string,
  name:      s.name as string,
  lat:       (s.location as { lat: number; lng: number }).lat,
  lng:       (s.location as { lat: number; lng: number }).lng,
  status:    (s.isOnline ? s.status : 'offline') as string,
  value:     s.currentValue as number,
  unit:      s.unit as string,
  area:      s.area as string,
  kelurahan: s.kelurahan as string,
  type:      s.type as string,
  isOnline:  s.isOnline as boolean,
}))

// ── Sensor details (history + threshold + install meta) ───
export const SENSOR_DETAILS = sensorsData as Array<{
  id: string
  history: { time: string; value: number }[]
  threshold: { siaga3: number; siaga2: number; siaga1: number }
  installDate: string
  kalibrasiTerakhir: string
}>

// ── Full detail exports for modals ────────────────────────
export const ALERT_DETAILS = activeAlertsData as Array<{
  id: string; timestamp: string; level: string
  location: string; kelurahan: string; kecamatan: string
  trigger: string; sensorId: string
  aiPrediction: { probability: number; estimatedTime: number; estimatedDepth: number }
  status: string; acknowledgedBy: string | null; actions: string[]
}>

export const PREDICTION_DETAILS = predictionsData as Array<{
  kelurahanId: string; kelurahan: string; kecamatan: string
  riskScore: number; riskLevel: string
  forecast: Record<string, { probability: number; estimatedDepth: number; confidence: number }>
  primaryDriver: string; lastUpdated: string
}>
