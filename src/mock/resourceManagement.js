// Mock data for ResourceManagement page

export const resourceStatusMeta = {
  deployed: { label: 'Dikerahkan', color: '#F97316' },
  standby: { label: 'Standby', color: '#10B981' },
  active: { label: 'Aktif', color: '#F97316' },
}

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

const personnelNames = [
  'Ahmad Fauzi', 'Bambang Wijaya', 'Citra Lestari', 'Dedi Kurniawan', 'Eko Prasetyo',
  'Fitri Handayani', 'Gunawan Saputra', 'Hadi Susanto', 'Indra Maulana', 'Joko Widodo',
  'Kartika Sari', 'Lukman Hakim', 'Made Sukarya', 'Nanda Pratama', 'Oki Setiawan',
  'Putri Anggraini', 'Qori Ramadhan', 'Rudi Hartono', 'Siti Nurhaliza', 'Taufik Hidayat',
  'Umar Bakri', 'Vina Oktaviani', 'Wahyu Nugroho', 'Yusuf Ardian', 'Zainal Abidin',
]
const units = ['Kec. Mampang', 'Kec. Kebayoran Lama', 'Kec. Pancoran', 'Kec. Tebet', 'Kec. Pasar Minggu', 'Kec. Cilandak', 'Kec. Setiabudi', 'Kec. Pesanggrahan']
const roles = ['PPSU', 'Damkar', 'BPBD', 'Tagana', 'Relawan']

export const personnelData = Array.from({ length: 52 }).map((_, i) => ({
  id: `PRS-${String(i + 1).padStart(3, '0')}`,
  name: personnelNames[i % personnelNames.length] + (i >= personnelNames.length ? ` ${Math.floor(i / personnelNames.length) + 1}` : ''),
  role: roles[i % roles.length],
  unit: units[i % units.length],
  status: i % 7 === 0 ? 'standby' : 'active',
  location: i % 7 === 0 ? 'Posko Induk' : units[i % units.length].replace('Kec. ', ''),
  phone: `0812-${String(1000 + i).slice(0, 4)}-${String(2000 + i * 3).slice(0, 4)}`,
  assignment: i % 7 === 0 ? '-' : i % 3 === 0 ? 'Evakuasi warga' : 'Monitoring TMA',
}))

export const sheltersData = [
  { id: 'PKS-001', name: 'Balai Kelurahan Pela Mampang', address: 'Jl. Pela Mampang No. 1', capacity: 200, currentOccupancy: 48, status: 'active', lat: -6.262, lng: 106.823 },
  { id: 'PKS-002', name: 'GOR Kebayoran Lama', address: 'Jl. Raya Kebayoran Lama No. 12', capacity: 350, currentOccupancy: 0, status: 'standby', lat: -6.245, lng: 106.783 },
  { id: 'PKS-003', name: 'Masjid Agung Pancoran', address: 'Jl. Raya Pasar Minggu Km 18', capacity: 250, currentOccupancy: 35, status: 'active', lat: -6.258, lng: 106.845 },
  { id: 'PKS-004', name: 'SDN Bukit Duri 01', address: 'Jl. Bukit Duri Tanjakan No. 5', capacity: 180, currentOccupancy: 0, status: 'standby', lat: -6.225, lng: 106.855 },
  { id: 'PKS-005', name: 'Kantor Camat Tebet', address: 'Jl. Tebet Raya No. 100', capacity: 220, currentOccupancy: 0, status: 'standby', lat: -6.232, lng: 106.852 },
  { id: 'PKS-006', name: 'Balai Warga Cipulir', address: 'Jl. Cipulir Raya No. 8', capacity: 150, currentOccupancy: 22, status: 'active', lat: -6.245, lng: 106.775 },
]

export const logisticsData = [
  { posko: 'Balai Kelurahan Pela Mampang', makanan: 320, air: 480, selimut: 150, obat: 40 },
  { posko: 'GOR Kebayoran Lama', makanan: 500, air: 720, selimut: 300, obat: 60 },
  { posko: 'Masjid Agung Pancoran', makanan: 280, air: 400, selimut: 200, obat: 35 },
  { posko: 'SDN Bukit Duri 01', makanan: 180, air: 260, selimut: 140, obat: 25 },
  { posko: 'Kantor Camat Tebet', makanan: 240, air: 350, selimut: 180, obat: 30 },
  { posko: 'Balai Warga Cipulir', makanan: 160, air: 220, selimut: 120, obat: 20 },
]
