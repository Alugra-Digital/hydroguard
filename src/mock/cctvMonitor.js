// Mock data for CCTVMonitor page

export const cctvStatusMeta = {
  online: { label: 'Live', color: '#10B981' },
  alert: { label: 'ALERT', color: '#E11D48' },
  offline: { label: 'Offline', color: '#94A3B8' },
}

export const cctvData = [
  {
    id: 'CCTV-001', name: 'Gelora — Kamera 8', location: 'Gelora, Tanah Abang',
    coordinates: { lat: -6.218, lng: 106.800 }, status: 'online',
    detections: { flooding: false, waterLevel: 8, vehiclesStranded: 0, crowdDensity: 'high' },
    embedUrl: 'https://cctv.balitower.co.id/Gelora-017-700470_8/embed.html',
    thumbnailUrl: null, streamUrl: null, lastUpdate: '2026-05-27T10:29:00+07:00',
  },
  {
    id: 'CCTV-002', name: 'Gelora — Kamera 2', location: 'Gelora, Tanah Abang',
    coordinates: { lat: -6.219, lng: 106.801 }, status: 'online',
    detections: { flooding: false, waterLevel: 6, vehiclesStranded: 0, crowdDensity: 'medium' },
    embedUrl: 'https://cctv.balitower.co.id/Gelora-017-700470_2/embed.html',
    thumbnailUrl: null, streamUrl: null, lastUpdate: '2026-05-27T10:29:00+07:00',
  },
  {
    id: 'CCTV-003', name: 'Gelora — Kamera 3', location: 'Gelora, Tanah Abang',
    coordinates: { lat: -6.220, lng: 106.799 }, status: 'online',
    detections: { flooding: false, waterLevel: 4, vehiclesStranded: 0, crowdDensity: 'medium' },
    embedUrl: 'https://cctv.balitower.co.id/Gelora-017-700470_3/embed.html',
    thumbnailUrl: null, streamUrl: null, lastUpdate: '2026-05-27T10:29:00+07:00',
  },
  {
    id: 'CCTV-004', name: 'Gelora — Kamera 9', location: 'Gelora, Tanah Abang',
    coordinates: { lat: -6.217, lng: 106.802 }, status: 'online',
    detections: { flooding: false, waterLevel: 3, vehiclesStranded: 0, crowdDensity: 'high' },
    embedUrl: 'https://cctv.balitower.co.id/Gelora-017-700470_9/embed.html',
    thumbnailUrl: null, streamUrl: null, lastUpdate: '2026-05-27T10:29:00+07:00',
  },
  {
    id: 'CCTV-005', name: 'Bendungan Hilir — Kamera 3', location: 'Bendungan Hilir, Tanah Abang',
    coordinates: { lat: -6.210, lng: 106.818 }, status: 'alert',
    detections: { flooding: true, waterLevel: 42, vehiclesStranded: 5, crowdDensity: 'medium' },
    embedUrl: 'https://cctv.balitower.co.id/Bendungan-Hilir-003-700014_3/embed.html',
    thumbnailUrl: null, streamUrl: null, lastUpdate: '2026-05-27T10:29:00+07:00',
  },
  {
    id: 'CCTV-006', name: 'Bendungan Hilir — Kamera 2', location: 'Bendungan Hilir, Tanah Abang',
    coordinates: { lat: -6.211, lng: 106.819 }, status: 'alert',
    detections: { flooding: true, waterLevel: 35, vehiclesStranded: 3, crowdDensity: 'high' },
    embedUrl: 'https://cctv.balitower.co.id/Bendungan-Hilir-003-700014_2/embed.html',
    thumbnailUrl: null, streamUrl: null, lastUpdate: '2026-05-27T10:29:00+07:00',
  },
  {
    id: 'CCTV-007', name: 'Pintu Air Manggarai', location: 'Tebet',
    coordinates: { lat: -6.210, lng: 106.850 }, status: 'online',
    detections: { flooding: false, waterLevel: 12, vehiclesStranded: 0, crowdDensity: 'low' },
    embedUrl: null, thumbnailUrl: null, streamUrl: null, lastUpdate: '2026-05-27T10:29:00+07:00',
  },
  {
    id: 'CCTV-008', name: 'Jl. Bukit Duri Tanjakan', location: 'Tebet',
    coordinates: { lat: -6.225, lng: 106.855 }, status: 'online',
    detections: { flooding: false, waterLevel: 10, vehiclesStranded: 0, crowdDensity: 'medium' },
    embedUrl: null, thumbnailUrl: null, streamUrl: null, lastUpdate: '2026-05-27T10:29:00+07:00',
  },
  {
    id: 'CCTV-009', name: 'Jl. Tebet Raya', location: 'Tebet',
    coordinates: { lat: -6.232, lng: 106.852 }, status: 'online',
    detections: { flooding: false, waterLevel: 3, vehiclesStranded: 0, crowdDensity: 'high' },
    embedUrl: null, thumbnailUrl: null, streamUrl: null, lastUpdate: '2026-05-27T10:29:00+07:00',
  },
  {
    id: 'CCTV-010', name: 'Stasiun Pasar Minggu', location: 'Pasar Minggu',
    coordinates: { lat: -6.290, lng: 106.844 }, status: 'online',
    detections: { flooding: false, waterLevel: 6, vehiclesStranded: 0, crowdDensity: 'high' },
    embedUrl: null, thumbnailUrl: null, streamUrl: null, lastUpdate: '2026-05-27T10:29:00+07:00',
  },
  {
    id: 'CCTV-011', name: 'Jl. Pejaten Raya', location: 'Pasar Minggu',
    coordinates: { lat: -6.285, lng: 106.848 }, status: 'online',
    detections: { flooding: false, waterLevel: 14, vehiclesStranded: 0, crowdDensity: 'medium' },
    embedUrl: null, thumbnailUrl: null, streamUrl: null, lastUpdate: '2026-05-27T10:29:00+07:00',
  },
  {
    id: 'CCTV-012', name: 'Jl. Ragunan', location: 'Pasar Minggu',
    coordinates: { lat: -6.308, lng: 106.820 }, status: 'offline',
    detections: { flooding: false, waterLevel: 0, vehiclesStranded: 0, crowdDensity: 'low' },
    embedUrl: null, thumbnailUrl: null, streamUrl: null, lastUpdate: '2026-05-27T10:29:00+07:00',
  },
  {
    id: 'CCTV-013', name: 'Blok M Square', location: 'Kebayoran Baru',
    coordinates: { lat: -6.244, lng: 106.800 }, status: 'online',
    detections: { flooding: false, waterLevel: 1, vehiclesStranded: 0, crowdDensity: 'high' },
    embedUrl: null, thumbnailUrl: null, streamUrl: null, lastUpdate: '2026-05-27T10:29:00+07:00',
  },
  {
    id: 'CCTV-014', name: 'Jl. Petogogan', location: 'Kebayoran Baru',
    coordinates: { lat: -6.243, lng: 106.815 }, status: 'online',
    detections: { flooding: false, waterLevel: 9, vehiclesStranded: 0, crowdDensity: 'low' },
    embedUrl: null, thumbnailUrl: null, streamUrl: null, lastUpdate: '2026-05-27T10:29:00+07:00',
  },
  {
    id: 'CCTV-015', name: 'Jl. Gandaria', location: 'Kebayoran Baru',
    coordinates: { lat: -6.255, lng: 106.798 }, status: 'online',
    detections: { flooding: false, waterLevel: 4, vehiclesStranded: 0, crowdDensity: 'medium' },
    embedUrl: null, thumbnailUrl: null, streamUrl: null, lastUpdate: '2026-05-27T10:29:00+07:00',
  },
  {
    id: 'CCTV-016', name: 'Ulujami — Pesanggrahan', location: 'Pesanggrahan',
    coordinates: { lat: -6.245, lng: 106.762 }, status: 'online',
    detections: { flooding: false, waterLevel: 11, vehiclesStranded: 0, crowdDensity: 'low' },
    embedUrl: null, thumbnailUrl: null, streamUrl: null, lastUpdate: '2026-05-27T10:29:00+07:00',
  },
  {
    id: 'CCTV-017', name: 'Jl. Lebak Bulus Raya', location: 'Cilandak',
    coordinates: { lat: -6.302, lng: 106.778 }, status: 'online',
    detections: { flooding: false, waterLevel: 2, vehiclesStranded: 0, crowdDensity: 'medium' },
    embedUrl: null, thumbnailUrl: null, streamUrl: null, lastUpdate: '2026-05-27T10:29:00+07:00',
  },
  {
    id: 'CCTV-018', name: 'Jl. Pondok Labu', location: 'Cilandak',
    coordinates: { lat: -6.310, lng: 106.798 }, status: 'online',
    detections: { flooding: false, waterLevel: 7, vehiclesStranded: 0, crowdDensity: 'low' },
    embedUrl: null, thumbnailUrl: null, streamUrl: null, lastUpdate: '2026-05-27T10:29:00+07:00',
  },
  {
    id: 'CCTV-019', name: 'Jl. Kalibata Raya', location: 'Pancoran',
    coordinates: { lat: -6.258, lng: 106.845 }, status: 'offline',
    detections: { flooding: false, waterLevel: 0, vehiclesStranded: 0, crowdDensity: 'low' },
    embedUrl: null, thumbnailUrl: null, streamUrl: null, lastUpdate: '2026-05-27T10:29:00+07:00',
  },
  {
    id: 'CCTV-020', name: 'Jl. Setiabudi Tengah', location: 'Setiabudi',
    coordinates: { lat: -6.210, lng: 106.830 }, status: 'online',
    detections: { flooding: false, waterLevel: 3, vehiclesStranded: 0, crowdDensity: 'high' },
    embedUrl: null, thumbnailUrl: null, streamUrl: null, lastUpdate: '2026-05-27T10:29:00+07:00',
  },
]
