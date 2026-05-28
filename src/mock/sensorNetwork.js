// Mock data for SensorNetwork page

export const kecamatanList = [
  'Mampang Prapatan',
  'Kebayoran Lama',
  'Kebayoran Baru',
  'Pasar Minggu',
  'Cilandak',
  'Pancoran',
  'Tebet',
  'Setiabudi',
  'Pesanggrahan',
  'Jagakarsa',
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
