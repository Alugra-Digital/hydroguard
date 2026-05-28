// Mock data for IncidentHistory page

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

export const incidentsData = [
  {
    id: 'INC-2026-014', date: '2026-05-20T03:00:00+07:00', kelurahan: 'Pela Mampang', kecamatan: 'Mampang Prapatan',
    level: 'siaga1', maxDepth: 120, duration: 9, affectedResidents: 1240, evacuees: 380, casualties: 0,
    chronology: [
      { time: '01:30', event: 'TMA Kali Mampang melampaui Siaga 2' },
      { time: '02:45', event: 'TMA mencapai Siaga 1, notifikasi warga dikirim' },
      { time: '03:00', event: 'Genangan masuk permukiman RW 04 & 05' },
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
      { time: '06:30', event: 'Evakuasi warga bantaran' },
    ],
    actions: ['2 pompa dikerahkan', 'Posko Cipulir aktif'],
  },
  {
    id: 'INC-2026-012', date: '2026-03-22T14:00:00+07:00', kelurahan: 'Rawajati', kecamatan: 'Pancoran',
    level: 'siaga2', maxDepth: 60, duration: 5, affectedResidents: 420, evacuees: 0, casualties: 0,
    chronology: [
      { time: '13:00', event: 'Backwater Ciliwung' },
      { time: '14:00', event: 'Genangan 60cm di RW 03' },
    ],
    actions: ['1 pompa dikerahkan'],
  },
  {
    id: 'INC-2026-011', date: '2026-02-15T22:00:00+07:00', kelurahan: 'Bukit Duri', kecamatan: 'Tebet',
    level: 'siaga1', maxDepth: 150, duration: 12, affectedResidents: 2100, evacuees: 650, casualties: 1,
    chronology: [
      { time: '20:00', event: 'Pintu Air Manggarai siaga 1' },
      { time: '22:00', event: 'Luapan Ciliwung masuk Bukit Duri' },
      { time: '23:30', event: 'Evakuasi massal 650 warga' },
    ],
    actions: ['5 pompa', '4 perahu', '2 posko aktif', 'Bantuan logistik'],
  },
  {
    id: 'INC-2026-010', date: '2026-01-28T09:00:00+07:00', kelurahan: 'Manggarai', kecamatan: 'Tebet',
    level: 'siaga2', maxDepth: 70, duration: 6, affectedResidents: 560, evacuees: 80, casualties: 0,
    chronology: [
      { time: '08:00', event: 'TMA naik cepat' },
      { time: '09:00', event: 'Genangan permukiman' },
    ],
    actions: ['2 pompa', '1 perahu'],
  },
  {
    id: 'INC-2025-009', date: '2025-12-30T16:00:00+07:00', kelurahan: 'Pejaten Timur', kecamatan: 'Pasar Minggu',
    level: 'siaga2', maxDepth: 55, duration: 4, affectedResidents: 340, evacuees: 0, casualties: 0,
    chronology: [
      { time: '15:00', event: 'Hujan lebat' },
      { time: '16:00', event: 'Genangan 55cm' },
    ],
    actions: ['1 pompa'],
  },
  {
    id: 'INC-2025-008', date: '2025-11-12T11:00:00+07:00', kelurahan: 'Ulujami', kecamatan: 'Pesanggrahan',
    level: 'siaga3', maxDepth: 30, duration: 3, affectedResidents: 180, evacuees: 0, casualties: 0,
    chronology: [{ time: '10:30', event: 'Genangan jalan' }],
    actions: ['Monitoring'],
  },
  {
    id: 'INC-2025-007', date: '2025-04-05T07:00:00+07:00', kelurahan: 'Pela Mampang', kecamatan: 'Mampang Prapatan',
    level: 'siaga1', maxDepth: 110, duration: 8, affectedResidents: 980, evacuees: 290, casualties: 0,
    chronology: [
      { time: '05:30', event: 'TMA Siaga 1' },
      { time: '07:00', event: 'Evakuasi' },
    ],
    actions: ['3 pompa', '2 perahu', 'Posko aktif'],
  },
  {
    id: 'INC-2025-006', date: '2025-02-20T13:00:00+07:00', kelurahan: 'Kalibata', kecamatan: 'Pancoran',
    level: 'siaga2', maxDepth: 65, duration: 5, affectedResidents: 450, evacuees: 40, casualties: 0,
    chronology: [{ time: '12:00', event: 'Luapan Ciliwung' }],
    actions: ['2 pompa'],
  },
  {
    id: 'INC-2024-005', date: '2024-12-15T04:00:00+07:00', kelurahan: 'Bukit Duri', kecamatan: 'Tebet',
    level: 'siaga1', maxDepth: 140, duration: 11, affectedResidents: 1800, evacuees: 520, casualties: 0,
    chronology: [
      { time: '03:00', event: 'Banjir kiriman Bogor' },
      { time: '04:00', event: 'Evakuasi' },
    ],
    actions: ['4 pompa', '3 perahu', '2 posko'],
  },
  {
    id: 'INC-2024-004', date: '2024-11-08T18:00:00+07:00', kelurahan: 'Cipulir', kecamatan: 'Kebayoran Lama',
    level: 'siaga2', maxDepth: 75, duration: 6, affectedResidents: 620, evacuees: 90, casualties: 0,
    chronology: [{ time: '17:00', event: 'Pesanggrahan meluap' }],
    actions: ['2 pompa', 'Posko aktif'],
  },
  {
    id: 'INC-2024-003', date: '2024-03-10T08:00:00+07:00', kelurahan: 'Manggarai', kecamatan: 'Tebet',
    level: 'siaga1', maxDepth: 130, duration: 10, affectedResidents: 1500, evacuees: 430, casualties: 0,
    chronology: [
      { time: '06:00', event: 'Pintu Air Siaga 1' },
      { time: '08:00', event: 'Evakuasi' },
    ],
    actions: ['4 pompa', '3 perahu'],
  },
  {
    id: 'INC-2024-002', date: '2024-02-28T15:00:00+07:00', kelurahan: 'Pasar Minggu', kecamatan: 'Pasar Minggu',
    level: 'siaga2', maxDepth: 58, duration: 4, affectedResidents: 380, evacuees: 0, casualties: 0,
    chronology: [{ time: '14:00', event: 'Genangan' }],
    actions: ['1 pompa'],
  },
  {
    id: 'INC-2024-001', date: '2024-01-15T02:00:00+07:00', kelurahan: 'Pela Mampang', kecamatan: 'Mampang Prapatan',
    level: 'siaga1', maxDepth: 125, duration: 9, affectedResidents: 1100, evacuees: 340, casualties: 0,
    chronology: [
      { time: '01:00', event: 'TMA Siaga 1' },
      { time: '02:00', event: 'Evakuasi' },
    ],
    actions: ['3 pompa', '2 perahu', 'Posko aktif'],
  },
]

export const incidentsByMonth = [
  { month: 'Jan 24', count: 1 }, { month: 'Feb 24', count: 1 }, { month: 'Mar 24', count: 1 },
  { month: 'Nov 24', count: 1 }, { month: 'Des 24', count: 1 }, { month: 'Feb 25', count: 1 },
  { month: 'Apr 25', count: 1 }, { month: 'Nov 25', count: 1 }, { month: 'Des 25', count: 1 },
  { month: 'Jan 26', count: 1 }, { month: 'Feb 26', count: 1 }, { month: 'Mar 26', count: 1 },
  { month: 'Apr 26', count: 1 }, { month: 'Mei 26', count: 1 },
]
