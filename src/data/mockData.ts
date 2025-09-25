// Mock data for the hospital management system

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
    ward: 'General',
    reason: 'Chest pain',
    consultingDoctor: 'Dr. Johnson',
    status: 'Admitted'
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
    ward: 'ICU',
    reason: 'Post-surgery monitoring',
    consultingDoctor: 'Dr. Brown',
    status: 'In Treatment'
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
    status: 'Discharged'
  }
];

export const mockIllnesses: Illness[] = [
  {
    id: '1',
    patientId: '1',
    patientName: 'John Smith',
    diagnosis: 'Acute Myocardial Infarction',
    date: '2024-01-15',
    severity: 'High',
    department: 'Cardiology'
  },
  {
    id: '2',
    patientId: '2',
    patientName: 'Sarah Wilson',
    diagnosis: 'Post-operative complications',
    date: '2024-01-16',
    severity: 'Medium',
    department: 'Surgery'
  },
  {
    id: '3',
    patientId: '3',
    patientName: 'Michael Chen',
    diagnosis: 'Severe Anaphylaxis',
    date: '2024-01-14',
    severity: 'Critical',
    department: 'Emergency'
  }
];

export const mockBeds: Bed[] = [
  {
    id: '1',
    number: 'G-101',
    ward: 'General',
    status: 'Occupied',
    patientId: '1',
    patientName: 'John Smith',
    admissionDate: '2024-01-15'
  },
  {
    id: '2',
    number: 'G-102',
    ward: 'General',
    status: 'Available'
  },
  {
    id: '3',
    number: 'G-103',
    ward: 'General',
    status: 'Cleaning'
  },
  {
    id: '4',
    number: 'I-201',
    ward: 'ICU',
    status: 'Occupied',
    patientId: '2',
    patientName: 'Sarah Wilson',
    admissionDate: '2024-01-16'
  },
  {
    id: '5',
    number: 'I-202',
    ward: 'ICU',
    status: 'Available'
  },
  {
    id: '6',
    number: 'E-301',
    ward: 'Emergency',
    status: 'Reserved'
  }
];

export const mockBloodInventory: BloodInventory[] = [
  { bloodType: 'A+', unitsAvailable: 25, lastUpdated: '2024-01-17', minThreshold: 10 },
  { bloodType: 'A-', unitsAvailable: 8, lastUpdated: '2024-01-17', minThreshold: 5 },
  { bloodType: 'B+', unitsAvailable: 18, lastUpdated: '2024-01-17', minThreshold: 8 },
  { bloodType: 'B-', unitsAvailable: 4, lastUpdated: '2024-01-17', minThreshold: 5 },
  { bloodType: 'AB+', unitsAvailable: 12, lastUpdated: '2024-01-17', minThreshold: 6 },
  { bloodType: 'AB-', unitsAvailable: 3, lastUpdated: '2024-01-17', minThreshold: 3 },
  { bloodType: 'O+', unitsAvailable: 35, lastUpdated: '2024-01-17', minThreshold: 15 },
  { bloodType: 'O-', unitsAvailable: 6, lastUpdated: '2024-01-17', minThreshold: 8 }
];

export const mockBloodTransactions: BloodTransaction[] = [
  {
    id: '1',
    type: 'Usage',
    bloodType: 'O-',
    units: 2,
    date: '2024-01-17',
    patientName: 'John Smith'
  },
  {
    id: '2',
    type: 'Donation',
    bloodType: 'A+',
    units: 1,
    date: '2024-01-16',
    donorName: 'Jane Doe'
  },
  {
    id: '3',
    type: 'Usage',
    bloodType: 'B+',
    units: 1,
    date: '2024-01-16',
    patientName: 'Sarah Wilson'
  }
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

export const getWaitingTimesData = () => [
  { department: 'Emergency', avgWaitTime: 15 },
  { department: 'General', avgWaitTime: 45 },
  { department: 'ICU', avgWaitTime: 30 },
  { department: 'Surgery', avgWaitTime: 60 },
  { department: 'Cardiology', avgWaitTime: 35 }
];

export const getAdmissionTrend = () => [
  { date: '2024-01-10', admissions: 12, discharges: 8 },
  { date: '2024-01-11', admissions: 15, discharges: 10 },
  { date: '2024-01-12', admissions: 18, discharges: 12 },
  { date: '2024-01-13', admissions: 22, discharges: 14 },
  { date: '2024-01-14', admissions: 20, discharges: 16 },
  { date: '2024-01-15', admissions: 25, discharges: 18 },
  { date: '2024-01-16', admissions: 28, discharges: 20 },
  { date: '2024-01-17', admissions: 24, discharges: 22 }
];