// Mock data for PredictionAnalysis page

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
  pasang_surut: 'Pasang Surut (Rob)',
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
  {
    kelurahanId: 'KEL-025', kelurahan: 'Grogol Selatan', kecamatan: 'Kebayoran Lama',
    riskScore: 63, riskLevel: 'medium',
    forecast: { '1h': { probability: 55, estimatedDepth: 19, confidence: 70 }, '3h': { probability: 65, estimatedDepth: 38, confidence: 58 }, '6h': { probability: 74, estimatedDepth: 55, confidence: 45 } },
    primaryDriver: 'pasang_surut', lastUpdated: '2026-05-27T10:25:00+07:00',
  },
]