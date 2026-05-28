// Mock data for ExecutiveView page
// Direct: predictionsData, incidentsData
// useFloodStore: systemLevel (derived from sensors)
// useSensorData → useFloodStore: sensorsData (onlineCount / total shown in KPI)
// useAlertStore: activeAlertsData
// useResourceStore: pumpsData, boatsData
// FloodMap component: sensorsData, kelurahanData, cctvData, sheltersData, evacRoutesData

export const riskLevelMeta = {
  low: { label: 'Rendah', color: '#10B981' },
  medium: { label: 'Sedang', color: '#FBBF24' },
  high: { label: 'Tinggi', color: '#F97316' },
  critical: { label: 'Kritis', color: '#E11D48' },
}

export const alertLevelMeta = {
  siaga1: { label: 'Siaga 1', color: '#E11D48', bg: 'bg-siaga1' },
  siaga2: { label: 'Siaga 2', color: '#F97316', bg: 'bg-siaga2' },
  siaga3: { label: 'Siaga 3', color: '#FBBF24', bg: 'bg-siaga3' },
}

export const predictionsData = [
  {
    kelurahanId: 'KEL-041', kelurahan: 'Pela Mampang', kecamatan: 'Mampang Prapatan',
    riskScore: 88, riskLevel: 'critical',
    forecast: { '1h': { probability: 82, estimatedDepth: 35, confidence: 74 }, '3h': { probability: 89, estimatedDepth: 65, confidence: 62 }, '6h': { probability: 93, estimatedDepth: 85, confidence: 49 } },
    primaryDriver: 'kombinasi', lastUpdated: '2026-05-27T10:25:00+07:00',
  },
  {
    kelurahanId: 'KEL-026', kelurahan: 'Cipulir', kecamatan: 'Kebayoran Lama',
    riskScore: 91, riskLevel: 'critical',
    forecast: { '1h': { probability: 86, estimatedDepth: 42, confidence: 71 }, '3h': { probability: 92, estimatedDepth: 70, confidence: 60 }, '6h': { probability: 95, estimatedDepth: 95, confidence: 46 } },
    primaryDriver: 'curah_hujan', lastUpdated: '2026-05-27T10:25:00+07:00',
  },
  {
    kelurahanId: 'KEL-046', kelurahan: 'Rawajati', kecamatan: 'Pancoran',
    riskScore: 84, riskLevel: 'high',
    forecast: { '1h': { probability: 76, estimatedDepth: 30, confidence: 70 }, '3h': { probability: 84, estimatedDepth: 58, confidence: 58 }, '6h': { probability: 90, estimatedDepth: 78, confidence: 45 } },
    primaryDriver: 'backwater', lastUpdated: '2026-05-27T10:25:00+07:00',
  },
  {
    kelurahanId: 'KEL-009', kelurahan: 'Pejaten Timur', kecamatan: 'Pasar Minggu',
    riskScore: 79, riskLevel: 'high',
    forecast: { '1h': { probability: 70, estimatedDepth: 25, confidence: 73 }, '3h': { probability: 80, estimatedDepth: 50, confidence: 61 }, '6h': { probability: 87, estimatedDepth: 72, confidence: 48 } },
    primaryDriver: 'backwater', lastUpdated: '2026-05-27T10:25:00+07:00',
  },
  {
    kelurahanId: 'KEL-055', kelurahan: 'Bukit Duri', kecamatan: 'Tebet',
    riskScore: 86, riskLevel: 'critical',
    forecast: { '1h': { probability: 78, estimatedDepth: 38, confidence: 69 }, '3h': { probability: 87, estimatedDepth: 68, confidence: 57 }, '6h': { probability: 92, estimatedDepth: 90, confidence: 44 } },
    primaryDriver: 'backwater', lastUpdated: '2026-05-27T10:25:00+07:00',
  },
  {
    kelurahanId: 'KEL-019', kelurahan: 'Ulujami', kecamatan: 'Pesanggrahan',
    riskScore: 72, riskLevel: 'high',
    forecast: { '1h': { probability: 64, estimatedDepth: 22, confidence: 72 }, '3h': { probability: 74, estimatedDepth: 45, confidence: 60 }, '6h': { probability: 82, estimatedDepth: 65, confidence: 47 } },
    primaryDriver: 'curah_hujan', lastUpdated: '2026-05-27T10:25:00+07:00',
  },
  {
    kelurahanId: 'KEL-017', kelurahan: 'Pondok Labu', kecamatan: 'Cilandak',
    riskScore: 58, riskLevel: 'medium',
    forecast: { '1h': { probability: 48, estimatedDepth: 15, confidence: 75 }, '3h': { probability: 60, estimatedDepth: 32, confidence: 63 }, '6h': { probability: 70, estimatedDepth: 50, confidence: 50 } },
    primaryDriver: 'curah_hujan', lastUpdated: '2026-05-27T10:25:00+07:00',
  },
  {
    kelurahanId: 'KEL-037', kelurahan: 'Petogogan', kecamatan: 'Kebayoran Baru',
    riskScore: 67, riskLevel: 'medium',
    forecast: { '1h': { probability: 58, estimatedDepth: 20, confidence: 73 }, '3h': { probability: 69, estimatedDepth: 40, confidence: 61 }, '6h': { probability: 78, estimatedDepth: 58, confidence: 48 } },
    primaryDriver: 'kombinasi', lastUpdated: '2026-05-27T10:25:00+07:00',
  },
  {
    kelurahanId: 'KEL-007', kelurahan: 'Pasar Minggu', kecamatan: 'Pasar Minggu',
    riskScore: 74, riskLevel: 'high',
    forecast: { '1h': { probability: 66, estimatedDepth: 24, confidence: 71 }, '3h': { probability: 76, estimatedDepth: 48, confidence: 59 }, '6h': { probability: 84, estimatedDepth: 68, confidence: 46 } },
    primaryDriver: 'kombinasi', lastUpdated: '2026-05-27T10:25:00+07:00',
  },
  {
    kelurahanId: 'KEL-028', kelurahan: 'Kebayoran Lama Selatan', kecamatan: 'Kebayoran Lama',
    riskScore: 69, riskLevel: 'medium',
    forecast: { '1h': { probability: 60, estimatedDepth: 21, confidence: 72 }, '3h': { probability: 71, estimatedDepth: 42, confidence: 60 }, '6h': { probability: 80, estimatedDepth: 60, confidence: 47 } },
    primaryDriver: 'curah_hujan', lastUpdated: '2026-05-27T10:25:00+07:00',
  },
]

export const incidentsData = [
  {
    id: 'INC-2026-014', date: '2026-05-20T03:00:00+07:00', kelurahan: 'Pela Mampang', kecamatan: 'Mampang Prapatan',
    level: 'siaga1', maxDepth: 120, duration: 9, affectedResidents: 1240, evacuees: 380, casualties: 0,
    chronology: [
      { time: '01:30', event: 'TMA Kali Mampang melampaui Siaga 2' },
      { time: '04:20', event: 'Evakuasi 380 warga ke Balai Kelurahan' },
      { time: '10:30', event: 'Air mulai surut, pompa dikerahkan' },
    ],
    actions: ['3 pompa dikerahkan', '2 perahu evakuasi', 'Posko diaktifkan'],
  },
  {
    id: 'INC-2026-013', date: '2026-04-18T05:00:00+07:00', kelurahan: 'Cipulir', kecamatan: 'Kebayoran Lama',
    level: 'siaga1', maxDepth: 95, duration: 7, affectedResidents: 890, evacuees: 210, casualties: 0,
    chronology: [
      { time: '04:00', event: 'Hujan ekstrem 80mm/jam di hulu Pesanggrahan' },
      { time: '05:00', event: 'Kali Pesanggrahan meluap' },
    ],
    actions: ['2 pompa dikerahkan', 'Posko Cipulir aktif'],
  },
  {
    id: 'INC-2026-012', date: '2026-03-22T14:00:00+07:00', kelurahan: 'Rawajati', kecamatan: 'Pancoran',
    level: 'siaga2', maxDepth: 60, duration: 5, affectedResidents: 420, evacuees: 0, casualties: 0,
    chronology: [{ time: '14:00', event: 'Genangan 60cm di RW 03' }],
    actions: ['1 pompa dikerahkan'],
  },
  {
    id: 'INC-2026-011', date: '2026-02-15T22:00:00+07:00', kelurahan: 'Bukit Duri', kecamatan: 'Tebet',
    level: 'siaga1', maxDepth: 150, duration: 12, affectedResidents: 2100, evacuees: 650, casualties: 1,
    chronology: [
      { time: '22:00', event: 'Luapan Ciliwung masuk Bukit Duri' },
      { time: '23:30', event: 'Evakuasi massal 650 warga' },
    ],
    actions: ['5 pompa', '4 perahu', '2 posko aktif'],
  },
  {
    id: 'INC-2026-010', date: '2026-01-28T09:00:00+07:00', kelurahan: 'Manggarai', kecamatan: 'Tebet',
    level: 'siaga2', maxDepth: 70, duration: 6, affectedResidents: 560, evacuees: 80, casualties: 0,
    chronology: [{ time: '09:00', event: 'Genangan permukiman' }],
    actions: ['2 pompa', '1 perahu'],
  },
]

export const activeAlertsData = [
  {
    id: 'ALT-2026-001', timestamp: '2026-05-27T09:45:00+07:00', level: 'siaga2',
    location: 'Pela Mampang, Mampang Prapatan', kelurahan: 'Pela Mampang', kecamatan: 'Mampang Prapatan',
    trigger: 'TMA melebihi batas Siaga 2 (215cm / ambang 200cm)', sensorId: 'SNS-001',
    aiPrediction: { probability: 82, estimatedTime: 45, estimatedDepth: 35 },
    status: 'active', acknowledgedBy: null, actions: [],
  },
  {
    id: 'ALT-2026-002', timestamp: '2026-05-27T10:05:00+07:00', level: 'siaga1',
    location: 'Cipulir, Kebayoran Lama', kelurahan: 'Cipulir', kecamatan: 'Kebayoran Lama',
    trigger: 'TMA melebihi batas Siaga 1 (232cm / ambang 250cm mendekati)', sensorId: 'SNS-011',
    aiPrediction: { probability: 86, estimatedTime: 30, estimatedDepth: 42 },
    status: 'active', acknowledgedBy: null, actions: [],
  },
  {
    id: 'ALT-2026-003', timestamp: '2026-05-27T10:15:00+07:00', level: 'siaga3',
    location: 'Pejaten Timur, Pasar Minggu', kelurahan: 'Pejaten Timur', kecamatan: 'Pasar Minggu',
    trigger: 'TMA Kali Ciliwung mendekati batas Siaga 2 (198cm)', sensorId: 'SNS-023',
    aiPrediction: { probability: 70, estimatedTime: 60, estimatedDepth: 25 },
    status: 'active', acknowledgedBy: null, actions: [],
  },
]

export const pumpsData = [
  { id: 'PMP-001', name: 'Pompa Mobile 1', type: 'mobile', capacity: '200 L/s', status: 'deployed', location: 'Pela Mampang', operator: 'Budi Santoso', deployedAt: '2026-05-27T09:50:00+07:00' },
  { id: 'PMP-002', name: 'Pompa Mobile 2', type: 'mobile', capacity: '150 L/s', status: 'deployed', location: 'Cipulir', operator: 'Agus Riyanto', deployedAt: '2026-05-27T10:10:00+07:00' },
  { id: 'PMP-003', name: 'Pompa Stasioner Manggarai', type: 'stationary', capacity: '500 L/s', status: 'deployed', location: 'Manggarai', operator: 'Tim PHB 3', deployedAt: '2026-05-27T08:30:00+07:00' },
  { id: 'PMP-004', name: 'Pompa Mobile 3', type: 'mobile', capacity: '200 L/s', status: 'standby', location: 'Gudang BPBD Jaksel', operator: '-', deployedAt: null },
  { id: 'PMP-005', name: 'Pompa Mobile 4', type: 'mobile', capacity: '150 L/s', status: 'standby', location: 'Gudang BPBD Jaksel', operator: '-', deployedAt: null },
]

export const boatsData = [
  { id: 'PRH-001', name: 'Perahu Karet 1', capacity: '8 orang', status: 'deployed', location: 'Kemang Utara' },
  { id: 'PRH-002', name: 'Perahu Karet 2', capacity: '8 orang', status: 'deployed', location: 'Bukit Duri' },
  { id: 'PRH-003', name: 'Perahu Karet 3', capacity: '6 orang', status: 'standby', location: 'Gudang BPBD Jaksel' },
  { id: 'PRH-004', name: 'Perahu Karet 4', capacity: '6 orang', status: 'standby', location: 'Gudang BPBD Jaksel' },
  { id: 'PRH-005', name: 'Perahu Fiber 1', capacity: '10 orang', status: 'standby', location: 'Gudang BPBD Jaksel' },
  { id: 'PRH-006', name: 'Perahu Karet 5', capacity: '8 orang', status: 'standby', location: 'Pos Pancoran' },
  { id: 'PRH-007', name: 'Perahu Karet 6', capacity: '8 orang', status: 'standby', location: 'Pos Kebayoran' },
  { id: 'PRH-008', name: 'Perahu Fiber 2', capacity: '10 orang', status: 'standby', location: 'Gudang BPBD Jaksel' },
]

export const sensorStatusMeta = {
  normal: { label: 'Normal', color: '#10B981' },
  siaga3: { label: 'Siaga 3', color: '#FBBF24' },
  siaga2: { label: 'Siaga 2', color: '#F97316' },
  siaga1: { label: 'Siaga 1', color: '#E11D48' },
  offline: { label: 'Offline', color: '#94A3B8' },
}

function statusFromValue(value, threshold) {
  if (value >= threshold.siaga1) return 'siaga1'
  if (value >= threshold.siaga2) return 'siaga2'
  if (value >= threshold.siaga3) return 'siaga3'
  return 'normal'
}

function genHistory(current, volatility, hours = 24) {
  const NOW = new Date('2026-05-27T10:30:00+07:00')
  const points = []
  let v = current - volatility * 4
  for (let i = hours; i >= 0; i--) {
    const t = new Date(NOW.getTime() - i * 3600 * 1000)
    const drift = (current - v) * 0.18
    v = Math.max(0, v + drift + (Math.random() - 0.5) * volatility * 2)
    points.push({ time: t.toISOString(), value: Math.round(i === 0 ? current : v) })
  }
  return points
}

const rawSensors = [
  ['SNS-001', 'Kali Mampang — Pela Mampang', 'water_level', -6.262, 106.822, 'Mampang Prapatan', 'Pela Mampang', 215, [150, 200, 250], 87, 4, true, 12],
  ['SNS-002', 'Kali Krukut — Bangka', 'water_level', -6.258, 106.818, 'Mampang Prapatan', 'Bangka', 168, [150, 200, 250], 92, 5, true, 8],
  ['SNS-003', 'Sensor Kemang Raya', 'combined', -6.260, 106.814, 'Mampang Prapatan', 'Bangka', 142, [140, 190, 240], 78, 3, true, 5],
  ['SNS-004', 'Tegal Parang Hulu', 'water_level', -6.250, 106.828, 'Mampang Prapatan', 'Tegal Parang', 175, [150, 200, 250], 64, 4, true, 6],
  ['SNS-005', 'Rain Gauge Mampang', 'rain_gauge', -6.248, 106.825, 'Mampang Prapatan', 'Mampang Prapatan', 23, [10, 20, 30], 90, 5, true, 3],
  ['SNS-006', 'Kali Mampang — Hilir', 'water_level', -6.254, 106.824, 'Mampang Prapatan', 'Tegal Parang', 188, [150, 200, 250], 55, 4, true, 9],
  ['SNS-007', 'Sensor Kemang Selatan', 'water_level', -6.265, 106.816, 'Mampang Prapatan', 'Bangka', 130, [150, 200, 250], 81, 5, true, -2],
  ['SNS-008', 'Kuningan Barat — Krukut', 'water_level', -6.238, 106.825, 'Mampang Prapatan', 'Kuningan Barat', 110, [150, 200, 250], 73, 4, true, 1],
  ['SNS-009', 'Pintu Air Pela Mampang', 'combined', -6.263, 106.823, 'Mampang Prapatan', 'Pela Mampang', 205, [150, 200, 250], 68, 3, true, 14],
  ['SNS-010', 'Rain Gauge Kemang', 'rain_gauge', -6.261, 106.815, 'Mampang Prapatan', 'Bangka', 18, [10, 20, 30], 95, 5, true, 4],
  ['SNS-011', 'Kali Pesanggrahan — Cipulir', 'water_level', -6.245, 106.775, 'Kebayoran Lama', 'Cipulir', 232, [150, 200, 250], 59, 3, true, 16],
  ['SNS-012', 'Ulujami — Pesanggrahan Hulu', 'water_level', -6.245, 106.762, 'Pesanggrahan', 'Ulujami', 178, [150, 200, 250], 84, 4, true, 7],
  ['SNS-013', 'Kebayoran Lama Selatan', 'water_level', -6.252, 106.783, 'Kebayoran Lama', 'Kebayoran Lama Selatan', 155, [150, 200, 250], 77, 4, true, 4],
  ['SNS-014', 'Grogol Selatan', 'water_level', -6.238, 106.782, 'Kebayoran Lama', 'Grogol Selatan', 124, [150, 200, 250], 88, 5, true, -1],
  ['SNS-015', 'Rain Gauge Cipulir', 'rain_gauge', -6.246, 106.776, 'Kebayoran Lama', 'Cipulir', 27, [10, 20, 30], 62, 3, true, 5],
  ['SNS-016', 'Pondok Pinang', 'water_level', -6.278, 106.778, 'Kebayoran Lama', 'Pondok Pinang', 98, [150, 200, 250], 91, 5, true, 0],
  ['SNS-017', 'Petukangan Utara', 'combined', -6.243, 106.752, 'Pesanggrahan', 'Petukangan Utara', 138, [150, 200, 250], 70, 4, true, 3],
  ['SNS-018', 'Petogogan — Kali Krukut', 'water_level', -6.243, 106.815, 'Kebayoran Baru', 'Petogogan', 192, [150, 200, 250], 66, 4, true, 10],
  ['SNS-019', 'Gandaria Utara', 'water_level', -6.255, 106.798, 'Kebayoran Baru', 'Gandaria Utara', 115, [150, 200, 250], 83, 5, true, 2],
  ['SNS-020', 'Cipete Utara', 'water_level', -6.262, 106.805, 'Kebayoran Baru', 'Cipete Utara', 102, [150, 200, 250], 79, 4, true, -1],
  ['SNS-021', 'Kramat Pela', 'water_level', -6.245, 106.795, 'Kebayoran Baru', 'Kramat Pela', 88, [150, 200, 250], 94, 5, true, 1],
  ['SNS-022', 'Rain Gauge Blok M', 'rain_gauge', -6.244, 106.800, 'Kebayoran Baru', 'Melawai', 15, [10, 20, 30], 89, 5, true, 2],
  ['SNS-023', 'Kali Ciliwung — Pejaten Timur', 'water_level', -6.285, 106.848, 'Pasar Minggu', 'Pejaten Timur', 198, [150, 200, 250], 71, 4, true, 11],
  ['SNS-024', 'Pasar Minggu Hulu', 'water_level', -6.290, 106.844, 'Pasar Minggu', 'Pasar Minggu', 167, [150, 200, 250], 75, 4, true, 6],
  ['SNS-025', 'Pejaten Barat', 'combined', -6.280, 106.832, 'Pasar Minggu', 'Pejaten Barat', 134, [150, 200, 250], 80, 5, true, 3],
  ['SNS-026', 'Kebagusan', 'water_level', -6.305, 106.828, 'Pasar Minggu', 'Kebagusan', 109, [150, 200, 250], 86, 4, true, 0],
  ['SNS-027', 'Rain Gauge Ragunan', 'rain_gauge', -6.308, 106.820, 'Pasar Minggu', 'Ragunan', 12, [10, 20, 30], 0, 0, false, 0],
  ['SNS-028', 'Kali Grogol — Pondok Labu', 'water_level', -6.310, 106.798, 'Cilandak', 'Pondok Labu', 145, [150, 200, 250], 82, 4, true, 4],
  ['SNS-029', 'Cilandak Barat', 'water_level', -6.296, 106.798, 'Cilandak', 'Cilandak Barat', 96, [150, 200, 250], 90, 5, true, -2],
  ['SNS-030', 'Lebak Bulus', 'combined', -6.302, 106.778, 'Cilandak', 'Lebak Bulus', 78, [150, 200, 250], 76, 4, true, 1],
]

export const sensorsData = rawSensors.map((r) => {
  const [id, name, type, lat, lng, area, kelurahan, currentValue, th, battery, signal, isOnline, rateOfChange] = r
  const threshold = { siaga3: th[0], siaga2: th[1], siaga1: th[2] }
  const unit = type === 'rain_gauge' ? 'mm/jam' : 'cm'
  const volatility = type === 'rain_gauge' ? 3 : 8
  return {
    id, name, type,
    location: { lat, lng },
    area, kelurahan, currentValue, unit, threshold,
    status: isOnline ? statusFromValue(currentValue, threshold) : 'offline',
    battery, signal,
    lastUpdate: '2026-05-27T10:30:00+07:00',
    history: isOnline ? genHistory(currentValue, volatility) : [],
    rateOfChange, isOnline,
    installDate: '2025-08-15',
    kalibrasiTerakhir: '2026-03-10',
  }
})

export const kelurahanData = [
  { id: 'KEL-001', name: 'Jagakarsa', kecamatan: 'Jagakarsa', lat: -6.336, lng: 106.823, riskLevel: 'low' },
  { id: 'KEL-002', name: 'Srengseng Sawah', kecamatan: 'Jagakarsa', lat: -6.345, lng: 106.835, riskLevel: 'low' },
  { id: 'KEL-003', name: 'Ciganjur', kecamatan: 'Jagakarsa', lat: -6.328, lng: 106.808, riskLevel: 'medium' },
  { id: 'KEL-004', name: 'Lenteng Agung', kecamatan: 'Jagakarsa', lat: -6.330, lng: 106.840, riskLevel: 'medium' },
  { id: 'KEL-005', name: 'Tanjung Barat', kecamatan: 'Jagakarsa', lat: -6.312, lng: 106.847, riskLevel: 'high' },
  { id: 'KEL-006', name: 'Cipedak', kecamatan: 'Jagakarsa', lat: -6.340, lng: 106.815, riskLevel: 'low' },
  { id: 'KEL-007', name: 'Pasar Minggu', kecamatan: 'Pasar Minggu', lat: -6.290, lng: 106.844, riskLevel: 'high' },
  { id: 'KEL-008', name: 'Pejaten Barat', kecamatan: 'Pasar Minggu', lat: -6.280, lng: 106.832, riskLevel: 'medium' },
  { id: 'KEL-009', name: 'Pejaten Timur', kecamatan: 'Pasar Minggu', lat: -6.285, lng: 106.848, riskLevel: 'high' },
  { id: 'KEL-010', name: 'Kebagusan', kecamatan: 'Pasar Minggu', lat: -6.305, lng: 106.828, riskLevel: 'medium' },
  { id: 'KEL-026', name: 'Cipulir', kecamatan: 'Kebayoran Lama', lat: -6.245, lng: 106.775, riskLevel: 'critical' },
  { id: 'KEL-037', name: 'Petogogan', kecamatan: 'Kebayoran Baru', lat: -6.243, lng: 106.815, riskLevel: 'high' },
  { id: 'KEL-041', name: 'Pela Mampang', kecamatan: 'Mampang Prapatan', lat: -6.262, lng: 106.822, riskLevel: 'critical' },
  { id: 'KEL-046', name: 'Rawajati', kecamatan: 'Pancoran', lat: -6.262, lng: 106.848, riskLevel: 'critical' },
  { id: 'KEL-055', name: 'Bukit Duri', kecamatan: 'Tebet', lat: -6.225, lng: 106.855, riskLevel: 'critical' },
  { id: 'KEL-056', name: 'Manggarai', kecamatan: 'Tebet', lat: -6.210, lng: 106.850, riskLevel: 'critical' },
]

export const cctvStatusMeta = {
  online: { label: 'Live', color: '#10B981' },
  alert: { label: 'ALERT', color: '#E11D48' },
  offline: { label: 'Offline', color: '#94A3B8' },
}

export const cctvData = [
  { id: 'CCTV-001', name: 'Gelora — Kamera 8', location: 'Gelora, Tanah Abang', coordinates: { lat: -6.218, lng: 106.800 }, status: 'online', detections: { flooding: false, waterLevel: 8, vehiclesStranded: 0, crowdDensity: 'high' }, embedUrl: 'https://cctv.balitower.co.id/Gelora-017-700470_8/embed.html', lastUpdate: '2026-05-27T10:29:00+07:00' },
  { id: 'CCTV-005', name: 'Bendungan Hilir — Kamera 3', location: 'Bendungan Hilir, Tanah Abang', coordinates: { lat: -6.210, lng: 106.818 }, status: 'alert', detections: { flooding: true, waterLevel: 42, vehiclesStranded: 5, crowdDensity: 'medium' }, embedUrl: 'https://cctv.balitower.co.id/Bendungan-Hilir-003-700014_3/embed.html', lastUpdate: '2026-05-27T10:29:00+07:00' },
  { id: 'CCTV-006', name: 'Bendungan Hilir — Kamera 2', location: 'Bendungan Hilir, Tanah Abang', coordinates: { lat: -6.211, lng: 106.819 }, status: 'alert', detections: { flooding: true, waterLevel: 35, vehiclesStranded: 3, crowdDensity: 'high' }, embedUrl: 'https://cctv.balitower.co.id/Bendungan-Hilir-003-700014_2/embed.html', lastUpdate: '2026-05-27T10:29:00+07:00' },
  { id: 'CCTV-007', name: 'Pintu Air Manggarai', location: 'Tebet', coordinates: { lat: -6.210, lng: 106.850 }, status: 'online', detections: { flooding: false, waterLevel: 12, vehiclesStranded: 0, crowdDensity: 'low' }, embedUrl: null, lastUpdate: '2026-05-27T10:29:00+07:00' },
  { id: 'CCTV-010', name: 'Stasiun Pasar Minggu', location: 'Pasar Minggu', coordinates: { lat: -6.290, lng: 106.844 }, status: 'online', detections: { flooding: false, waterLevel: 6, vehiclesStranded: 0, crowdDensity: 'high' }, embedUrl: null, lastUpdate: '2026-05-27T10:29:00+07:00' },
  { id: 'CCTV-013', name: 'Blok M Square', location: 'Kebayoran Baru', coordinates: { lat: -6.244, lng: 106.800 }, status: 'online', detections: { flooding: false, waterLevel: 1, vehiclesStranded: 0, crowdDensity: 'high' }, embedUrl: null, lastUpdate: '2026-05-27T10:29:00+07:00' },
  { id: 'CCTV-019', name: 'Jl. Kalibata Raya', location: 'Pancoran', coordinates: { lat: -6.258, lng: 106.845 }, status: 'offline', detections: { flooding: false, waterLevel: 0, vehiclesStranded: 0, crowdDensity: 'low' }, embedUrl: null, lastUpdate: '2026-05-27T10:29:00+07:00' },
]

export const sheltersData = [
  { id: 'PKS-001', name: 'Balai Kelurahan Pela Mampang', address: 'Jl. Pela Mampang No. 1', capacity: 200, currentOccupancy: 48, status: 'active', lat: -6.262, lng: 106.823 },
  { id: 'PKS-002', name: 'GOR Kebayoran Lama', address: 'Jl. Raya Kebayoran Lama No. 12', capacity: 350, currentOccupancy: 0, status: 'standby', lat: -6.245, lng: 106.783 },
  { id: 'PKS-003', name: 'Masjid Agung Pancoran', address: 'Jl. Raya Pasar Minggu Km 18', capacity: 250, currentOccupancy: 35, status: 'active', lat: -6.258, lng: 106.845 },
  { id: 'PKS-004', name: 'SDN Bukit Duri 01', address: 'Jl. Bukit Duri Tanjakan No. 5', capacity: 180, currentOccupancy: 0, status: 'standby', lat: -6.225, lng: 106.855 },
  { id: 'PKS-005', name: 'Kantor Camat Tebet', address: 'Jl. Tebet Raya No. 100', capacity: 220, currentOccupancy: 0, status: 'standby', lat: -6.232, lng: 106.852 },
  { id: 'PKS-006', name: 'Balai Warga Cipulir', address: 'Jl. Cipulir Raya No. 8', capacity: 150, currentOccupancy: 22, status: 'active', lat: -6.245, lng: 106.775 },
]

export const evacStatusMeta = {
  aman: { label: 'Aman', color: '#10B981' },
  terbatas: { label: 'Terbatas', color: '#F97316' },
  tertutup: { label: 'Tertutup', color: '#E11D48' },
}

export const evacRoutesData = [
  { id: 'EVR-001', name: 'Pela Mampang → Balai Kelurahan', kelurahan: 'Pela Mampang', status: 'aman', path: [[-6.2635, 106.8215], [-6.2628, 106.8222], [-6.262, 106.823]] },
  { id: 'EVR-002', name: 'Cipulir → Balai Warga Cipulir', kelurahan: 'Cipulir', status: 'aman', path: [[-6.2462, 106.7742], [-6.2455, 106.7748], [-6.245, 106.775]] },
  { id: 'EVR-003', name: 'Rawajati → Masjid Agung Pancoran', kelurahan: 'Rawajati', status: 'terbatas', path: [[-6.2625, 106.8478], [-6.2605, 106.8465], [-6.258, 106.845]] },
  { id: 'EVR-004', name: 'Bukit Duri → SDN Bukit Duri 01', kelurahan: 'Bukit Duri', status: 'aman', path: [[-6.2258, 106.8558], [-6.2255, 106.8554], [-6.225, 106.855]] },
  { id: 'EVR-005', name: 'Pejaten Timur → GOR Kebayoran', kelurahan: 'Pejaten Timur', status: 'aman', path: [[-6.2852, 106.8482], [-6.27, 106.82], [-6.245, 106.783]] },
]
