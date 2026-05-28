export interface AlertItem {
  time:       string
  sensorId:   string
  trigger:    string
  location:   string
  level:      'siaga1' | 'siaga2' | 'siaga3'
  aiProb:     number
  estDepth:   number
  estTimeMin: number
}

export interface PredictionItem {
  kelurahan:  string
  kecamatan:  string
  riskScore:  number
  riskLevel:  'critical' | 'high' | 'medium' | 'low'
  driver:     string
  prob1h:     number
  prob3h:     number
  prob6h:     number
  depth1h:    number
}

export interface KecamatanRisk {
  kecamatan:      string
  maxRiskLevel:   'critical' | 'high' | 'medium' | 'low'
  avgScore:       number
  kelurahanCount: number
  monitoredCount: number
  drivers:        string[]
}

export interface RiskKelurahan {
  id:        string
  name:      string
  kecamatan: string
  lat:       number
  lng:       number
  riskLevel: 'medium' | 'high' | 'critical'
}

export interface MetricCard {
  value:  string
  change: string
  spark:  number[]
  trend:  'up' | 'down' | 'neutral'
}

export interface ComputedMetrics {
  sensorAktif:  MetricCard
  avgTMA:       MetricCard
  curahHujan:   MetricCard
  alertAktif:   MetricCard
}

export interface ComputedMetricsSecondary {
  zonaKritis:  MetricCard
  zonaTinggi:  MetricCard
  suhuUdara:   MetricCard
  kelembaban:  MetricCard
}

export type TabView            = 'overview' | 'metrics' | 'evaluations'
export type AlertFilter        = 'Semua' | 'Siaga 1' | 'Siaga 2' | 'Siaga 3'
export type EndpointView       = 'flow' | 'map'
export type PiiRedactMode      = 'MASK' | 'ENCRYPT' | 'REPLACE'
export type PiiRedactEngine    = 'NER' | 'REGEX' | 'HYBRID'
export type InjectionHeuristic = 'ON' | 'OFF'

export interface CctvItem {
  id: string
  name: string
  location: string
  coordinates: { lat: number; lng: number }
  status: 'online' | 'alert' | 'offline'
  detections: { flooding: boolean; waterLevel: number; vehiclesStranded: number; crowdDensity: string }
  embedUrl: string | null
  lastUpdate: string
}

export interface ShelterItem {
  id: string
  name: string
  address: string
  capacity: number
  currentOccupancy: number
  status: 'active' | 'standby'
  lat: number
  lng: number
}

export interface EvacRoute {
  id: string
  name: string
  kelurahan: string
  status: 'aman' | 'terbatas' | 'tertutup'
  path: [number, number][]
}

export interface ResourceSummary {
  pumpsDeployed: number
  pumpsTotal: number
  boatsDeployed: number
  boatsTotal: number
  personnelActive: number
  personnelTotal: number
}
