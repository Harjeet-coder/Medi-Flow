// src/data/mockData.ts

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  guardian: string;
  contact: string;
  address: string;
  admissionDate: string;
  ward: string;
  reason: string;
  consultingDoctor: string;
  status: 'Admitted' | 'Discharged' | 'In Treatment';
}

export interface Illness {
  id: string;
  patientId: string;
  patientName: string;
  diagnosis: string;
  date: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  department: string;
}

export interface Bed {
  id: string;
  number: string;
  ward: string;
  status: 'Available' | 'Occupied' | 'Cleaning' | 'Reserved';
  patientId?: string;
  patientName?: string;
  admissionDate?: string;
}

export interface BloodInventory {
  bloodType: string;
  unitsAvailable: number;
  lastUpdated: string;
  minThreshold: number;
}

export interface BloodTransaction {
  id: string;
  type: 'Donation' | 'Usage';
  bloodType: string;
  units: number;
  date: string;
  patientName?: string;
  donorName?: string;
}

// Updated list of all departments
export const departments = [
  'ICU',
  'Emergency',
  'Surgery',
  'Maternity',
  'Pediatrics',
  'Psychiatry',
  'Rehabilitation',
  'Oncology',
  'Cardiology',
  'Neurology',
  'Orthopedics',
  'ENT',
  'Dermatology',
  'Ophthalmology',
  'Urology',
  'Gynecology',
  'Neonatal',
  'Burns Unit',
  'Isolation',
  'Day Care',
  'General',
];

// Function to generate a random illness record
const generateMockIllnesses = (count: number): Illness[] => {
  const patientNames = ['John Doe', 'Jane Smith', 'Peter Jones', 'Mary Brown', 'David Wilson', 'Emily Davis', 'William Green'];
  const diagnoses = [
    'ICU',
    'Emergency',
    'Surgery',
    'Maternity',
    'Pediatrics',
    'Psychiatry',
    'Rehabilitation',
    'Oncology',
    'Cardiology',
    'Neurology',
    'Orthopedics',
    'ENT',
    'Dermatology',
    'Ophthalmology',
    'Urology',
    'Gynecology',
    'Neonatal',
    'Burns Unit',
    'Isolation',
    'Day Care',
  ];
  const severities = ['Low', 'Medium', 'High', 'Critical'];
  const randomDate = () => {
    const d = new Date();
    d.setDate(d.getDate() - Math.floor(Math.random() * 30));
    return d.toISOString().split('T')[0];
  };

  const generatedIllnesses: Illness[] = [];
  for (let i = 0; i < count; i++) {
    generatedIllnesses.push({
      id: `illness-${i}`,
      patientId: `patient-${Math.floor(Math.random() * 1000)}`,
      patientName: patientNames[Math.floor(Math.random() * patientNames.length)],
      diagnosis: diagnoses[Math.floor(Math.random() * diagnoses.length)],
      severity: severities[Math.floor(Math.random() * severities.length)] as Illness['severity'],
      department: departments[Math.floor(Math.random() * departments.length)],
      date: randomDate(),
    });
  }
  return generatedIllnesses;
};

// Replace the existing mockIllnesses with the generated data
export const mockIllnesses: Illness[] = generateMockIllnesses(100);

// Mock data
export const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'John Smith',
    age: 45,
    gender: 'Male',
    guardian: 'Mary Smith',
    contact: '+1-555-0123',
    address: '123 Main St, Anytown, USA',
    admissionDate: '2024-01-15',
    ward: 'ICU',
    reason: 'Chest pain',
    consultingDoctor: 'Dr. Johnson',
    status: 'Admitted',
  },
  {
    id: '2',
    name: 'Sarah Wilson',
    age: 32,
    gender: 'Female',
    guardian: 'David Wilson',
    contact: '+1-555-0124',
    address: '456 Oak Ave, Anytown, USA',
    admissionDate: '2024-01-16',
    ward: 'Maternity',
    reason: 'Post-surgery monitoring',
    consultingDoctor: 'Dr. Brown',
    status: 'In Treatment',
  },
  {
    id: '3',
    name: 'Michael Chen',
    age: 28,
    gender: 'Male',
    guardian: 'Lisa Chen',
    contact: '+1-555-0125',
    address: '789 Pine St, Anytown, USA',
    admissionDate: '2024-01-14',
    ward: 'Emergency',
    reason: 'Severe allergic reaction',
    consultingDoctor: 'Dr. Martinez',
    status: 'Discharged',
  },
  {
    id: '4',
    name: 'Emily Davis',
    age: 67,
    gender: 'Female',
    guardian: 'Robert Davis',
    contact: '+1-555-0126',
    address: '101 Maple Ln, Anytown, USA',
    admissionDate: '2024-01-17',
    ward: 'Oncology',
    reason: 'Chemotherapy session',
    consultingDoctor: 'Dr. Lee',
    status: 'Admitted',
  },
  {
    id: '5',
    name: 'William Green',
    age: 7,
    gender: 'Male',
    guardian: 'Jessica Green',
    contact: '+1-555-0127',
    address: '202 Birch Rd, Anytown, USA',
    admissionDate: '2024-01-17',
    ward: 'Pediatrics',
    reason: 'Viral infection',
    consultingDoctor: 'Dr. Evans',
    status: 'Admitted',
  },
];

export const mockBeds: Bed[] = [
  {
    id: '1',
    number: 'G-101',
    ward: 'Cardiology',
    status: 'Occupied',
    patientId: '1',
    patientName: 'John Smith',
    admissionDate: '2024-01-15',
  },
  {
    id: '2',
    number: 'S-201',
    ward: 'Surgery',
    status: 'Available',
  },
  {
    id: '3',
    number: 'E-301',
    ward: 'Emergency',
    status: 'Occupied',
    patientId: '3',
    patientName: 'Michael Chen',
    admissionDate: '2024-01-14',
  },
  {
    id: '4',
    number: 'O-401',
    ward: 'Oncology',
    status: 'Occupied',
    patientId: '4',
    patientName: 'Emily Davis',
    admissionDate: '2024-01-17',
  },
  {
    id: '5',
    number: 'P-501',
    ward: 'Pediatrics',
    status: 'Occupied',
    patientId: '5',
    patientName: 'William Green',
    admissionDate: '2024-01-17',
  },
  {
    id: '6',
    number: 'I-601',
    ward: 'ICU',
    status: 'Available',
  },
];

export const mockBloodInventory: BloodInventory[] = [
  { bloodType: 'A+', unitsAvailable: 25, lastUpdated: '2024-01-17', minThreshold: 10 },
  { bloodType: 'A-', unitsAvailable: 8, lastUpdated: '2024-01-17', minThreshold: 5 },
  { bloodType: 'B+', unitsAvailable: 18, lastUpdated: '2024-01-17', minThreshold: 8 },
  { bloodType: 'B-', unitsAvailable: 4, lastUpdated: '2024-01-17', minThreshold: 5 },
  { bloodType: 'AB+', unitsAvailable: 12, lastUpdated: '2024-01-17', minThreshold: 6 },
  { bloodType: 'AB-', unitsAvailable: 3, lastUpdated: '2024-01-17', minThreshold: 3 },
  { bloodType: 'O+', unitsAvailable: 35, lastUpdated: '2024-01-17', minThreshold: 15 },
  { bloodType: 'O-', unitsAvailable: 6, lastUpdated: '2024-01-17', minThreshold: 8 },
];

export const mockBloodTransactions: BloodTransaction[] = [
  {
    id: '1',
    type: 'Usage',
    bloodType: 'O-',
    units: 2,
    date: '2024-01-17',
    patientName: 'John Smith',
  },
  {
    id: '2',
    type: 'Donation',
    bloodType: 'A+',
    units: 1,
    date: '2024-01-16',
    donorName: 'Jane Doe',
  },
  {
    id: '3',
    type: 'Usage',
    bloodType: 'B+',
    units: 1,
    date: '2024-01-16',
    patientName: 'Sarah Wilson',
  },
];

// Statistics data for charts
export const getIllnessStats = () => {
  const illnessCount: { [key: string]: number } = {};
  mockIllnesses.forEach(illness => {
    const diagnosis = illness.diagnosis;
    illnessCount[diagnosis] = (illnessCount[diagnosis] || 0) + 1;
  });
  return illnessCount;
};

// Updated function to generate waiting times for all wards
export const getWaitingTimesData = () => {
  const waitingTimes = departments.map(department => ({
    department,
    avgWaitTime: Math.floor(Math.random() * 60) + 5, // Generate a random wait time between 5 and 64 minutes
  }));
  return waitingTimes.sort((a, b) => a.department.localeCompare(b.department));
};

export const getAdmissionTrend = () => [
  { date: '2024-01-10', admissions: 12, discharges: 8 },
  { date: '2024-01-11', admissions: 15, discharges: 10 },
  { date: '2024-01-12', admissions: 18, discharges: 12 },
  { date: '2024-01-13', admissions: 22, discharges: 14 },
  { date: '2024-01-14', admissions: 20, discharges: 16 },
  { date: '2024-01-15', admissions: 25, discharges: 18 },
  { date: '2024-01-16', admissions: 28, discharges: 20 },
  { date: '2024-01-17', admissions: 24, discharges: 22 },
];