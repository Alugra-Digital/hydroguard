// Mock data for FieldCoordinator page
// Direct: kelurahanData, kecamatanList, evacRoutesData, evacStatusMeta
// FloodMap component → useFloodStore: sensorsData
// FloodMap component → direct: cctvData, sheltersData, evacRoutesData

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

export const evacStatusMeta = {
  aman: { label: 'Aman', color: '#10B981' },
  terbatas: { label: 'Terbatas', color: '#F97316' },
  tertutup: { label: 'Tertutup', color: '#E11D48' },
}

export const evacRoutesData = [
  {
    id: 'EVR-001', name: 'Pela Mampang → Balai Kelurahan', kelurahan: 'Pela Mampang', status: 'aman',
    path: [[-6.2635, 106.8215], [-6.2628, 106.8222], [-6.262, 106.823]],
  },
  {
    id: 'EVR-002', name: 'Cipulir → Balai Warga Cipulir', kelurahan: 'Cipulir', status: 'aman',
    path: [[-6.2462, 106.7742], [-6.2455, 106.7748], [-6.245, 106.775]],
  },
  {
    id: 'EVR-003', name: 'Rawajati → Masjid Agung Pancoran', kelurahan: 'Rawajati', status: 'terbatas',
    path: [[-6.2625, 106.8478], [-6.2605, 106.8465], [-6.258, 106.845]],
  },
  {
    id: 'EVR-004', name: 'Bukit Duri → SDN Bukit Duri 01', kelurahan: 'Bukit Duri', status: 'aman',
    path: [[-6.2258, 106.8558], [-6.2255, 106.8554], [-6.225, 106.855]],
  },
  {
    id: 'EVR-005', name: 'Pejaten Timur → GOR Kebayoran', kelurahan: 'Pejaten Timur', status: 'aman',
    path: [[-6.2852, 106.8482], [-6.27, 106.82], [-6.245, 106.783]],
  },
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
  { id: 'CCTV-016', name: 'Ulujami — Pesanggrahan', location: 'Pesanggrahan', coordinates: { lat: -6.245, lng: 106.762 }, status: 'online', detections: { flooding: false, waterLevel: 11, vehiclesStranded: 0, crowdDensity: 'low' }, embedUrl: null, lastUpdate: '2026-05-27T10:29:00+07:00' },
  { id: 'CCTV-017', name: 'Jl. Lebak Bulus Raya', location: 'Cilandak', coordinates: { lat: -6.302, lng: 106.778 }, status: 'online', detections: { flooding: false, waterLevel: 2, vehiclesStranded: 0, crowdDensity: 'medium' }, embedUrl: null, lastUpdate: '2026-05-27T10:29:00+07:00' },
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
