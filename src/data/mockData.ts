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
    'Influenza', 'Pneumonia', 'Heart Attack', 'Appendicitis', 'Stroke', 'Fracture', 
    'Severe Anaphylaxis', 'Viral Pneumonia', 'Breast Cancer', 'Angina Pectoris'
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

// Function to generate a large, random set of patient records
const getRandomPatient = (id: number): Patient => {
  const names = ['John Smith', 'Jane Wilson', 'Michael Johnson', 'Emily Davis', 'Chris Brown', 'Sarah Adams', 'David Lee'];
  const genders = ['Male', 'Female', 'Other'];
  const doctors = ['Dr. Johnson', 'Dr. Lee', 'Dr. Martinez', 'Dr. Evans', 'Dr. Chen'];
  const reasons = ['Fever', 'Fracture', 'Influenza', 'Hypertension', 'Diabetes', 'Check-up', 'Chest pain', 'Allergic reaction'];
  const statuses = ['Admitted', 'In Treatment', 'Discharged'];

  const randomDate = () => {
    const d = new Date();
    d.setDate(d.getDate() - Math.floor(Math.random() * 60));
    return d.toISOString().split('T')[0];
  };

  return {
    id: `patient-${id}`,
    name: names[Math.floor(Math.random() * names.length)],
    age: Math.floor(Math.random() * 80) + 1,
    gender: genders[Math.floor(Math.random() * genders.length)] as Patient['gender'],
    guardian: 'N/A',
    contact: `+1-555-${Math.floor(Math.random() * 9000) + 1000}`,
    address: '123 Hospital Rd',
    admissionDate: randomDate(),
    ward: departments[Math.floor(Math.random() * departments.length)],
    reason: reasons[Math.floor(Math.random() * reasons.length)],
    consultingDoctor: doctors[Math.floor(Math.random() * doctors.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)] as Patient['status']
  };
};

export const mockPatients: Patient[] = Array.from({ length: 150 }, (_, i) => getRandomPatient(i + 1));

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