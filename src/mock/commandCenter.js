// Mock data for CommandCenter page
//
// ═══════════════════════════════════════════════════════════════════════════════
// 5 LAYER PETA — setiap layer punya popup/modal sendiri saat diklik
// ═══════════════════════════════════════════════════════════════════════════════
//
// LAYER 1 · Zona Risiko (zones) — FloodZoneOverlay
//   Tampilan : lingkaran berwarna per kelurahan (warna & ukuran dari riskColor + riskLevel)
//   Hover tooltip : kelurahan.name, kelurahan.kecamatan, pred.riskScore
//   Klik → Modal (CommandCenter.jsx) menampilkan:
//     - kelurahan.name, kelurahan.kecamatan, kelurahan.riskLevel
//     - pred.riskScore, pred.riskLevel (warna via riskLevelMeta)
//     - pred.forecast['1h'/'3h'/'6h'].probability (%), estimatedDepth (cm)
//     - pred.primaryDriver → diterjemahkan via driverLabel
//   Data: kelurahanData, riskColor, predictionsData, riskLevelMeta, driverLabel
//   NOTE: kelurahan yang tidak ada di predictionsData hanya menampilkan riskLevel historis
//
// LAYER 2 · Sensor IoT (sensors) — SensorMarker
//   Klik marker → Popup inline menampilkan:
//     - sensor.name, sensor.kelurahan, sensor.area
//     - sensor.currentValue + sensor.unit
//     - sensor.history.slice(-24) → sparkline chart
//     - sensor.id, sensor.battery (%)
//     - tombol "Detail Sensor"
//   Klik "Detail Sensor" → SensorModal menampilkan:
//     - sensor.currentValue, sensor.unit, sensor.status (SiagaBadge)
//     - sensor.kelurahan, sensor.battery, sensor.signal, sensor.lastUpdate
//     - sensor.history → chart garis + tabel 12 titik terakhir
//     - sensor.threshold.siaga3 / siaga2 / siaga1 (ambang batas)
//     - sensor.installDate, sensor.kalibrasiTerakhir
//     - tombol Kalibrasi Manual (update kalibrasiTerakhir via useFloodStore)
//   Data: sensorsData, sensorStatusMeta
//   NOTE: SensorModal TIDAK menampilkan prediksi AI, hanya data sensor murni
//
// LAYER 3 · CCTV (cctv) — Marker
//   Klik marker → Popup inline menampilkan:
//     - c.name, c.location
//     - cctvStatusMeta[c.status].label (Live / ALERT / Offline)
//     - c.detections.flooding → jika true: "Genangan ~{waterLevel}cm"
//   Data: cctvData, cctvStatusMeta
//
// LAYER 4 · Posko (shelters) — Marker ikon 🏠
//   Klik marker → Popup inline menampilkan:
//     - sh.name, sh.address
//     - sh.currentOccupancy / sh.capacity
//   Data: sheltersData
//
// LAYER 5 · Jalur Evakuasi (evac) — Polyline putus-putus
//   Klik garis → Popup inline menampilkan:
//     - r.name (mis. "Pela Mampang → Balai Kelurahan")
//     - evacStatusMeta[r.status].label (Aman / Terbatas / Tertutup)
//   Data: evacRoutesData, evacStatusMeta
//
// ═══════════════════════════════════════════════════════════════════════════════
// PANEL KANAN (di luar peta)
// ═══════════════════════════════════════════════════════════════════════════════
//
// AIpredictionPanel → predictionsData top-3 by riskScore
//   fields: kelurahan, kecamatan, riskScore, riskLevel, forecast[1h/3h/6h].probability
//   Data: predictionsData, riskLevelMeta
//
// AlertList → activeAlertsData
//   fields: level, timestamp, location, trigger
//   aiPrediction: probability (%), estimatedTime (menit), estimatedDepth (cm)
//   Data: activeAlertsData (tiap alert mengandung aiPrediction inline)
//
// WeatherPanel    → weatherData (via useFloodStore)
// TMAMonitor      → sensorsData top-5 siaga (via useSensorData → useFloodStore)
// StatusSummaryCard → systemLevel (via useFloodStore)
//                    pumpsData, boatsData, personnelData (via useResourceStore)

export const riskLevelMeta = {
  low: { label: 'Rendah', color: '#10B981' },
  medium: { label: 'Sedang', color: '#FBBF24' },
  high: { label: 'Tinggi', color: '#F97316' },
  critical: { label: 'Kritis', color: '#E11D48' },
}

export const driverLabel = {
  curah_hujan: 'Curah Hujan',
  backwater: 'Backwater (Luapan Sungai)',
  kombinasi: 'Kombinasi',
}

export const alertLevelMeta = {
  siaga1: { label: 'Siaga 1', color: '#E11D48', bg: 'bg-siaga1' },
  siaga2: { label: 'Siaga 2', color: '#F97316', bg: 'bg-siaga2' },
  siaga3: { label: 'Siaga 3', color: '#FBBF24', bg: 'bg-siaga3' },
}

export const riskColor = {
  low: '#10B981',
  medium: '#FBBF24',
  high: '#F97316',
  critical: '#E11D48',
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
    kelurahanId: 'KEL-064', kelurahan: 'Pasar Manggis', kecamatan: 'Setiabudi',
    riskScore: 55, riskLevel: 'medium',
    forecast: { '1h': { probability: 45, estimatedDepth: 14, confidence: 74 }, '3h': { probability: 57, estimatedDepth: 30, confidence: 62 }, '6h': { probability: 67, estimatedDepth: 48, confidence: 49 } },
    primaryDriver: 'curah_hujan', lastUpdated: '2026-05-27T10:25:00+07:00',
  },
  {
    kelurahanId: 'KEL-005', kelurahan: 'Tanjung Barat', kecamatan: 'Jagakarsa',
    riskScore: 61, riskLevel: 'medium',
    forecast: { '1h': { probability: 52, estimatedDepth: 18, confidence: 72 }, '3h': { probability: 63, estimatedDepth: 35, confidence: 60 }, '6h': { probability: 73, estimatedDepth: 55, confidence: 47 } },
    primaryDriver: 'backwater', lastUpdated: '2026-05-27T10:25:00+07:00',
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

export const weatherData = {
  current: {
    timestamp: '2026-05-27T10:30:00+07:00',
    rainfall: 23, temperature: 28, humidity: 89,
    windSpeed: 12, windDirection: 'Barat Daya', visibility: 4.2,
    source: 'Tomorrow.io + BMKG',
  },
  forecast6h: [
    { hour: '+1j', rainfall: 28, probability: 75 },
    { hour: '+2j', rainfall: 35, probability: 82 },
    { hour: '+3j', rainfall: 41, probability: 88 },
    { hour: '+4j', rainfall: 33, probability: 79 },
    { hour: '+5j', rainfall: 22, probability: 64 },
    { hour: '+6j', rainfall: 14, probability: 51 },
  ],
  radarIntensity: 'sedang-lebat',
  bmkgWarning: 'Peringatan Dini: Hujan Lebat disertai petir di Jakarta Selatan pukul 11.00–15.00 WIB. Waspada genangan dan luapan sungai.',
  lastRadarUpdate: '2026-05-27T10:20:00+07:00',
}

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
  { id: 'KEL-011', name: 'Jati Padang', kecamatan: 'Pasar Minggu', lat: -6.295, lng: 106.835, riskLevel: 'medium' },
  { id: 'KEL-012', name: 'Ragunan', kecamatan: 'Pasar Minggu', lat: -6.308, lng: 106.820, riskLevel: 'low' },
  { id: 'KEL-013', name: 'Cilandak Timur', kecamatan: 'Pasar Minggu', lat: -6.300, lng: 106.815, riskLevel: 'medium' },
  { id: 'KEL-014', name: 'Cilandak Barat', kecamatan: 'Cilandak', lat: -6.296, lng: 106.798, riskLevel: 'low' },
  { id: 'KEL-015', name: 'Gandaria Selatan', kecamatan: 'Cilandak', lat: -6.282, lng: 106.793, riskLevel: 'medium' },
  { id: 'KEL-016', name: 'Cipete Selatan', kecamatan: 'Cilandak', lat: -6.278, lng: 106.800, riskLevel: 'medium' },
  { id: 'KEL-017', name: 'Pondok Labu', kecamatan: 'Cilandak', lat: -6.310, lng: 106.798, riskLevel: 'medium' },
  { id: 'KEL-018', name: 'Lebak Bulus', kecamatan: 'Cilandak', lat: -6.302, lng: 106.778, riskLevel: 'low' },
  { id: 'KEL-019', name: 'Ulujami', kecamatan: 'Pesanggrahan', lat: -6.245, lng: 106.762, riskLevel: 'high' },
  { id: 'KEL-020', name: 'Petukangan Utara', kecamatan: 'Pesanggrahan', lat: -6.243, lng: 106.752, riskLevel: 'medium' },
  { id: 'KEL-021', name: 'Petukangan Selatan', kecamatan: 'Pesanggrahan', lat: -6.258, lng: 106.755, riskLevel: 'medium' },
  { id: 'KEL-022', name: 'Pesanggrahan', kecamatan: 'Pesanggrahan', lat: -6.262, lng: 106.745, riskLevel: 'medium' },
  { id: 'KEL-023', name: 'Bintaro', kecamatan: 'Pesanggrahan', lat: -6.270, lng: 106.762, riskLevel: 'high' },
  { id: 'KEL-024', name: 'Grogol Utara', kecamatan: 'Kebayoran Lama', lat: -6.222, lng: 106.788, riskLevel: 'medium' },
  { id: 'KEL-025', name: 'Grogol Selatan', kecamatan: 'Kebayoran Lama', lat: -6.238, lng: 106.782, riskLevel: 'medium' },
  { id: 'KEL-026', name: 'Cipulir', kecamatan: 'Kebayoran Lama', lat: -6.245, lng: 106.775, riskLevel: 'critical' },
  { id: 'KEL-027', name: 'Kebayoran Lama Utara', kecamatan: 'Kebayoran Lama', lat: -6.240, lng: 106.785, riskLevel: 'high' },
  { id: 'KEL-028', name: 'Kebayoran Lama Selatan', kecamatan: 'Kebayoran Lama', lat: -6.252, lng: 106.783, riskLevel: 'high' },
  { id: 'KEL-029', name: 'Pondok Pinang', kecamatan: 'Kebayoran Lama', lat: -6.278, lng: 106.778, riskLevel: 'medium' },
  { id: 'KEL-030', name: 'Selong', kecamatan: 'Kebayoran Baru', lat: -6.232, lng: 106.805, riskLevel: 'low' },
  { id: 'KEL-031', name: 'Gunung', kecamatan: 'Kebayoran Baru', lat: -6.238, lng: 106.802, riskLevel: 'low' },
  { id: 'KEL-032', name: 'Kramat Pela', kecamatan: 'Kebayoran Baru', lat: -6.245, lng: 106.795, riskLevel: 'medium' },
  { id: 'KEL-033', name: 'Gandaria Utara', kecamatan: 'Kebayoran Baru', lat: -6.255, lng: 106.798, riskLevel: 'medium' },
  { id: 'KEL-034', name: 'Cipete Utara', kecamatan: 'Kebayoran Baru', lat: -6.262, lng: 106.805, riskLevel: 'medium' },
  { id: 'KEL-035', name: 'Pulo', kecamatan: 'Kebayoran Baru', lat: -6.240, lng: 106.812, riskLevel: 'low' },
  { id: 'KEL-036', name: 'Melawai', kecamatan: 'Kebayoran Baru', lat: -6.244, lng: 106.800, riskLevel: 'low' },
  { id: 'KEL-037', name: 'Petogogan', kecamatan: 'Kebayoran Baru', lat: -6.243, lng: 106.815, riskLevel: 'high' },
  { id: 'KEL-038', name: 'Rawa Barat', kecamatan: 'Kebayoran Baru', lat: -6.235, lng: 106.815, riskLevel: 'low' },
  { id: 'KEL-039', name: 'Senayan', kecamatan: 'Kebayoran Baru', lat: -6.225, lng: 106.802, riskLevel: 'low' },
  { id: 'KEL-040', name: 'Bangka', kecamatan: 'Mampang Prapatan', lat: -6.258, lng: 106.818, riskLevel: 'high' },
  { id: 'KEL-041', name: 'Pela Mampang', kecamatan: 'Mampang Prapatan', lat: -6.262, lng: 106.822, riskLevel: 'critical' },
  { id: 'KEL-042', name: 'Tegal Parang', kecamatan: 'Mampang Prapatan', lat: -6.250, lng: 106.828, riskLevel: 'high' },
  { id: 'KEL-043', name: 'Mampang Prapatan', kecamatan: 'Mampang Prapatan', lat: -6.248, lng: 106.825, riskLevel: 'high' },
  { id: 'KEL-044', name: 'Kuningan Barat', kecamatan: 'Mampang Prapatan', lat: -6.238, lng: 106.825, riskLevel: 'medium' },
  { id: 'KEL-045', name: 'Kalibata', kecamatan: 'Pancoran', lat: -6.258, lng: 106.845, riskLevel: 'high' },
  { id: 'KEL-046', name: 'Rawajati', kecamatan: 'Pancoran', lat: -6.262, lng: 106.848, riskLevel: 'critical' },
  { id: 'KEL-047', name: 'Duren Tiga', kecamatan: 'Pancoran', lat: -6.255, lng: 106.835, riskLevel: 'medium' },
  { id: 'KEL-048', name: 'Cikoko', kecamatan: 'Pancoran', lat: -6.248, lng: 106.848, riskLevel: 'high' },
  { id: 'KEL-049', name: 'Pengadegan', kecamatan: 'Pancoran', lat: -6.252, lng: 106.852, riskLevel: 'high' },
  { id: 'KEL-050', name: 'Pancoran', kecamatan: 'Pancoran', lat: -6.245, lng: 106.840, riskLevel: 'medium' },
  { id: 'KEL-051', name: 'Tebet Timur', kecamatan: 'Tebet', lat: -6.232, lng: 106.852, riskLevel: 'medium' },
  { id: 'KEL-052', name: 'Tebet Barat', kecamatan: 'Tebet', lat: -6.235, lng: 106.845, riskLevel: 'medium' },
  { id: 'KEL-053', name: 'Menteng Dalam', kecamatan: 'Tebet', lat: -6.228, lng: 106.842, riskLevel: 'medium' },
  { id: 'KEL-054', name: 'Kebon Baru', kecamatan: 'Tebet', lat: -6.238, lng: 106.852, riskLevel: 'high' },
  { id: 'KEL-055', name: 'Bukit Duri', kecamatan: 'Tebet', lat: -6.225, lng: 106.855, riskLevel: 'critical' },
  { id: 'KEL-056', name: 'Manggarai', kecamatan: 'Tebet', lat: -6.210, lng: 106.850, riskLevel: 'critical' },
  { id: 'KEL-057', name: 'Manggarai Selatan', kecamatan: 'Tebet', lat: -6.218, lng: 106.848, riskLevel: 'high' },
  { id: 'KEL-058', name: 'Setiabudi', kecamatan: 'Setiabudi', lat: -6.210, lng: 106.830, riskLevel: 'low' },
  { id: 'KEL-059', name: 'Karet', kecamatan: 'Setiabudi', lat: -6.208, lng: 106.822, riskLevel: 'medium' },
  { id: 'KEL-060', name: 'Karet Semanggi', kecamatan: 'Setiabudi', lat: -6.218, lng: 106.815, riskLevel: 'low' },
  { id: 'KEL-061', name: 'Karet Kuningan', kecamatan: 'Setiabudi', lat: -6.222, lng: 106.828, riskLevel: 'medium' },
  { id: 'KEL-062', name: 'Kuningan Timur', kecamatan: 'Setiabudi', lat: -6.228, lng: 106.832, riskLevel: 'medium' },
  { id: 'KEL-063', name: 'Menteng Atas', kecamatan: 'Setiabudi', lat: -6.215, lng: 106.840, riskLevel: 'medium' },
  { id: 'KEL-064', name: 'Pasar Manggis', kecamatan: 'Setiabudi', lat: -6.205, lng: 106.842, riskLevel: 'high' },
  { id: 'KEL-065', name: 'Guntur', kecamatan: 'Setiabudi', lat: -6.212, lng: 106.835, riskLevel: 'low' },
]

export const sensorStatusMeta = {
  normal: { label: 'Normal', color: '#10B981' },
  siaga3: { label: 'Siaga 3', color: '#FBBF24' },
  siaga2: { label: 'Siaga 2', color: '#F97316' },
  siaga1: { label: 'Siaga 1', color: '#E11D48' },
  offline: { label: 'Offline', color: '#94A3B8' },
}

export const cctvStatusMeta = {
  online: { label: 'Live', color: '#10B981' },
  alert: { label: 'ALERT', color: '#E11D48' },
  offline: { label: 'Offline', color: '#94A3B8' },
}

export const cctvData = [
  { id: 'CCTV-001', name: 'Gelora — Kamera 8', location: 'Gelora, Tanah Abang', coordinates: { lat: -6.218, lng: 106.800 }, status: 'online', detections: { flooding: false, waterLevel: 8, vehiclesStranded: 0, crowdDensity: 'high' }, embedUrl: 'https://cctv.balitower.co.id/Gelora-017-700470_8/embed.html', lastUpdate: '2026-05-27T10:29:00+07:00' },
  { id: 'CCTV-002', name: 'Gelora — Kamera 2', location: 'Gelora, Tanah Abang', coordinates: { lat: -6.219, lng: 106.801 }, status: 'online', detections: { flooding: false, waterLevel: 6, vehiclesStranded: 0, crowdDensity: 'medium' }, embedUrl: 'https://cctv.balitower.co.id/Gelora-017-700470_2/embed.html', lastUpdate: '2026-05-27T10:29:00+07:00' },
  { id: 'CCTV-003', name: 'Gelora — Kamera 3', location: 'Gelora, Tanah Abang', coordinates: { lat: -6.220, lng: 106.799 }, status: 'online', detections: { flooding: false, waterLevel: 4, vehiclesStranded: 0, crowdDensity: 'medium' }, embedUrl: 'https://cctv.balitower.co.id/Gelora-017-700470_3/embed.html', lastUpdate: '2026-05-27T10:29:00+07:00' },
  { id: 'CCTV-004', name: 'Gelora — Kamera 9', location: 'Gelora, Tanah Abang', coordinates: { lat: -6.217, lng: 106.802 }, status: 'online', detections: { flooding: false, waterLevel: 3, vehiclesStranded: 0, crowdDensity: 'high' }, embedUrl: 'https://cctv.balitower.co.id/Gelora-017-700470_9/embed.html', lastUpdate: '2026-05-27T10:29:00+07:00' },
  { id: 'CCTV-005', name: 'Bendungan Hilir — Kamera 3', location: 'Bendungan Hilir, Tanah Abang', coordinates: { lat: -6.210, lng: 106.818 }, status: 'alert', detections: { flooding: true, waterLevel: 42, vehiclesStranded: 5, crowdDensity: 'medium' }, embedUrl: 'https://cctv.balitower.co.id/Bendungan-Hilir-003-700014_3/embed.html', lastUpdate: '2026-05-27T10:29:00+07:00' },
  { id: 'CCTV-006', name: 'Bendungan Hilir — Kamera 2', location: 'Bendungan Hilir, Tanah Abang', coordinates: { lat: -6.211, lng: 106.819 }, status: 'alert', detections: { flooding: true, waterLevel: 35, vehiclesStranded: 3, crowdDensity: 'high' }, embedUrl: 'https://cctv.balitower.co.id/Bendungan-Hilir-003-700014_2/embed.html', lastUpdate: '2026-05-27T10:29:00+07:00' },
  { id: 'CCTV-007', name: 'Pintu Air Manggarai', location: 'Tebet', coordinates: { lat: -6.210, lng: 106.850 }, status: 'online', detections: { flooding: false, waterLevel: 12, vehiclesStranded: 0, crowdDensity: 'low' }, embedUrl: null, lastUpdate: '2026-05-27T10:29:00+07:00' },
  { id: 'CCTV-008', name: 'Jl. Bukit Duri Tanjakan', location: 'Tebet', coordinates: { lat: -6.225, lng: 106.855 }, status: 'online', detections: { flooding: false, waterLevel: 10, vehiclesStranded: 0, crowdDensity: 'medium' }, embedUrl: null, lastUpdate: '2026-05-27T10:29:00+07:00' },
  { id: 'CCTV-009', name: 'Jl. Tebet Raya', location: 'Tebet', coordinates: { lat: -6.232, lng: 106.852 }, status: 'online', detections: { flooding: false, waterLevel: 3, vehiclesStranded: 0, crowdDensity: 'high' }, embedUrl: null, lastUpdate: '2026-05-27T10:29:00+07:00' },
  { id: 'CCTV-010', name: 'Stasiun Pasar Minggu', location: 'Pasar Minggu', coordinates: { lat: -6.290, lng: 106.844 }, status: 'online', detections: { flooding: false, waterLevel: 6, vehiclesStranded: 0, crowdDensity: 'high' }, embedUrl: null, lastUpdate: '2026-05-27T10:29:00+07:00' },
  { id: 'CCTV-011', name: 'Jl. Pejaten Raya', location: 'Pasar Minggu', coordinates: { lat: -6.285, lng: 106.848 }, status: 'online', detections: { flooding: false, waterLevel: 14, vehiclesStranded: 0, crowdDensity: 'medium' }, embedUrl: null, lastUpdate: '2026-05-27T10:29:00+07:00' },
  { id: 'CCTV-012', name: 'Jl. Ragunan', location: 'Pasar Minggu', coordinates: { lat: -6.308, lng: 106.820 }, status: 'offline', detections: { flooding: false, waterLevel: 0, vehiclesStranded: 0, crowdDensity: 'low' }, embedUrl: null, lastUpdate: '2026-05-27T10:29:00+07:00' },
  { id: 'CCTV-013', name: 'Blok M Square', location: 'Kebayoran Baru', coordinates: { lat: -6.244, lng: 106.800 }, status: 'online', detections: { flooding: false, waterLevel: 1, vehiclesStranded: 0, crowdDensity: 'high' }, embedUrl: null, lastUpdate: '2026-05-27T10:29:00+07:00' },
  { id: 'CCTV-014', name: 'Jl. Petogogan', location: 'Kebayoran Baru', coordinates: { lat: -6.243, lng: 106.815 }, status: 'online', detections: { flooding: false, waterLevel: 9, vehiclesStranded: 0, crowdDensity: 'low' }, embedUrl: null, lastUpdate: '2026-05-27T10:29:00+07:00' },
  { id: 'CCTV-015', name: 'Jl. Gandaria', location: 'Kebayoran Baru', coordinates: { lat: -6.255, lng: 106.798 }, status: 'online', detections: { flooding: false, waterLevel: 4, vehiclesStranded: 0, crowdDensity: 'medium' }, embedUrl: null, lastUpdate: '2026-05-27T10:29:00+07:00' },
  { id: 'CCTV-016', name: 'Ulujami — Pesanggrahan', location: 'Pesanggrahan', coordinates: { lat: -6.245, lng: 106.762 }, status: 'online', detections: { flooding: false, waterLevel: 11, vehiclesStranded: 0, crowdDensity: 'low' }, embedUrl: null, lastUpdate: '2026-05-27T10:29:00+07:00' },
  { id: 'CCTV-017', name: 'Jl. Lebak Bulus Raya', location: 'Cilandak', coordinates: { lat: -6.302, lng: 106.778 }, status: 'online', detections: { flooding: false, waterLevel: 2, vehiclesStranded: 0, crowdDensity: 'medium' }, embedUrl: null, lastUpdate: '2026-05-27T10:29:00+07:00' },
  { id: 'CCTV-018', name: 'Jl. Pondok Labu', location: 'Cilandak', coordinates: { lat: -6.310, lng: 106.798 }, status: 'online', detections: { flooding: false, waterLevel: 7, vehiclesStranded: 0, crowdDensity: 'low' }, embedUrl: null, lastUpdate: '2026-05-27T10:29:00+07:00' },
  { id: 'CCTV-019', name: 'Jl. Kalibata Raya', location: 'Pancoran', coordinates: { lat: -6.258, lng: 106.845 }, status: 'offline', detections: { flooding: false, waterLevel: 0, vehiclesStranded: 0, crowdDensity: 'low' }, embedUrl: null, lastUpdate: '2026-05-27T10:29:00+07:00' },
  { id: 'CCTV-020', name: 'Jl. Setiabudi Tengah', location: 'Setiabudi', coordinates: { lat: -6.210, lng: 106.830 }, status: 'online', detections: { flooding: false, waterLevel: 3, vehiclesStranded: 0, crowdDensity: 'high' }, embedUrl: null, lastUpdate: '2026-05-27T10:29:00+07:00' },
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

const personnelNames = [
  'Ahmad Fauzi', 'Bambang Wijaya', 'Citra Lestari', 'Dedi Kurniawan', 'Eko Prasetyo',
  'Fitri Handayani', 'Gunawan Saputra', 'Hadi Susanto', 'Indra Maulana', 'Joko Widodo',
  'Kartika Sari', 'Lukman Hakim', 'Made Sukarya', 'Nanda Pratama', 'Oki Setiawan',
  'Putri Anggraini', 'Qori Ramadhan', 'Rudi Hartono', 'Siti Nurhaliza', 'Taufik Hidayat',
  'Umar Bakri', 'Vina Oktaviani', 'Wahyu Nugroho', 'Yusuf Ardian', 'Zainal Abidin',
]
const _units = ['Kec. Mampang', 'Kec. Kebayoran Lama', 'Kec. Pancoran', 'Kec. Tebet', 'Kec. Pasar Minggu', 'Kec. Cilandak', 'Kec. Setiabudi', 'Kec. Pesanggrahan']
const _roles = ['PPSU', 'Damkar', 'BPBD', 'Tagana', 'Relawan']

export const personnelData = Array.from({ length: 52 }).map((_, i) => ({
  id: `PRS-${String(i + 1).padStart(3, '0')}`,
  name: personnelNames[i % personnelNames.length] + (i >= personnelNames.length ? ` ${Math.floor(i / personnelNames.length) + 1}` : ''),
  role: _roles[i % _roles.length],
  unit: _units[i % _units.length],
  status: i % 7 === 0 ? 'standby' : 'active',
  location: i % 7 === 0 ? 'Posko Induk' : _units[i % _units.length].replace('Kec. ', ''),
  phone: `0812-${String(1000 + i).slice(0, 4)}-${String(2000 + i * 3).slice(0, 4)}`,
  assignment: i % 7 === 0 ? '-' : i % 3 === 0 ? 'Evakuasi warga' : 'Monitoring TMA',
}))

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
