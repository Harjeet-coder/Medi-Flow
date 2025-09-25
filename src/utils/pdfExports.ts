import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { mockPatients, mockIllnesses, mockBloodInventory, mockBloodTransactions, Patient, Illness, BloodTransaction } from '@/data/mockData';

// Get data from the last 1 month
const getLastMonthData = () => {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  
  return {
    patients: mockPatients.filter(p => new Date(p.admissionDate) >= oneMonthAgo),
    illnesses: mockIllnesses.filter(i => new Date(i.date) >= oneMonthAgo),
    bloodTransactions: mockBloodTransactions.filter(t => new Date(t.date) >= oneMonthAgo)
  };
};

export const exportPatientAdmissionsPDF = () => {
  const doc = new jsPDF();
  const data = getLastMonthData();
  
  // Header
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Patient Admissions Report', 20, 20);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
  doc.text(`Data Period: Last 1 Month (${data.patients.length} records)`, 20, 38);
  
  // Table data
  const tableData = data.patients.map(patient => [
    patient.name,
    patient.age.toString(),
    patient.gender,
    patient.ward,
    patient.admissionDate,
    patient.status,
    patient.consultingDoctor,
    patient.reason
  ]);
  
  // Create table
  autoTable(doc, {
    head: [['Name', 'Age', 'Gender', 'Ward', 'Admission Date', 'Status', 'Doctor', 'Reason']],
    body: tableData,
    startY: 50,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [41, 128, 185] },
    margin: { top: 50 }
  });
  
  // Summary statistics
  const yPos = (doc as any).lastAutoTable.finalY + 20;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Summary Statistics', 20, yPos);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total Admissions: ${data.patients.length}`, 20, yPos + 10);
  doc.text(`Active Patients: ${data.patients.filter(p => p.status === 'Admitted').length}`, 20, yPos + 18);
  doc.text(`Discharged: ${data.patients.filter(p => p.status === 'Discharged').length}`, 20, yPos + 26);
  
  // Ward distribution
  const wardCounts = data.patients.reduce((acc, p) => {
    acc[p.ward] = (acc[p.ward] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  let wardY = yPos + 36;
  doc.text('Ward Distribution:', 20, wardY);
  Object.entries(wardCounts).forEach(([ward, count], index) => {
    doc.text(`${ward}: ${count} patients`, 25, wardY + 8 + (index * 8));
  });
  
  doc.save('patient-admissions-report.pdf');
};

export const exportIllnessInsightsPDF = () => {
  const doc = new jsPDF();
  const data = getLastMonthData();
  
  // Header
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Illness Insights Report', 20, 20);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
  doc.text(`Data Period: Last 1 Month (${data.illnesses.length} records)`, 20, 38);
  
  // Table data
  const tableData = data.illnesses.map(illness => [
    illness.patientName,
    illness.diagnosis,
    illness.date,
    illness.severity,
    illness.department
  ]);
  
  // Create table
  autoTable(doc, {
    head: [['Patient Name', 'Diagnosis', 'Date', 'Severity', 'Department']],
    body: tableData,
    startY: 50,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [231, 76, 60] },
    margin: { top: 50 }
  });
  
  // Summary statistics
  const yPos = (doc as any).lastAutoTable.finalY + 20;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Illness Analysis', 20, yPos);
  
  // Severity distribution
  const severityCounts = data.illnesses.reduce((acc, i) => {
    acc[i.severity] = (acc[i.severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  let severityY = yPos + 10;
  doc.text('Severity Distribution:', 20, severityY);
  Object.entries(severityCounts).forEach(([severity, count], index) => {
    doc.text(`${severity}: ${count} cases`, 25, severityY + 8 + (index * 8));
  });
  
  // Department distribution
  const deptCounts = data.illnesses.reduce((acc, i) => {
    acc[i.department] = (acc[i.department] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const deptY = severityY + 40;
  doc.text('Department Distribution:', 20, deptY);
  Object.entries(deptCounts).forEach(([dept, count], index) => {
    doc.text(`${dept}: ${count} cases`, 25, deptY + 8 + (index * 8));
  });
  
  doc.save('illness-insights-report.pdf');
};

export const exportBloodBankPDF = () => {
  const doc = new jsPDF();
  const data = getLastMonthData();
  
  // Header
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Blood Bank Management Report', 20, 20);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
  doc.text(`Data Period: Last 1 Month`, 20, 38);
  
  // Current Inventory
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Current Blood Inventory', 20, 55);
  
  const inventoryData = mockBloodInventory.map(item => [
    item.bloodType,
    item.unitsAvailable.toString(),
    item.minThreshold.toString(),
    item.unitsAvailable <= item.minThreshold ? 'LOW STOCK' : 'OK',
    item.lastUpdated
  ]);
  
  autoTable(doc, {
    head: [['Blood Type', 'Units Available', 'Min Threshold', 'Status', 'Last Updated']],
    body: inventoryData,
    startY: 65,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [155, 89, 182] },
    margin: { top: 65 }
  });
  
  // Transactions History
  const transY = (doc as any).lastAutoTable.finalY + 20;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Transaction History (Last Month)', 20, transY);
  
  const transactionData = data.bloodTransactions.map(trans => [
    trans.type,
    trans.bloodType,
    trans.units.toString(),
    trans.date,
    trans.patientName || trans.donorName || 'N/A'
  ]);
  
  autoTable(doc, {
    head: [['Type', 'Blood Type', 'Units', 'Date', 'Patient/Donor']],
    body: transactionData,
    startY: transY + 10,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [155, 89, 182] },
    margin: { top: transY + 10 }
  });
  
  // Summary statistics
  const summaryY = (doc as any).lastAutoTable.finalY + 20;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Summary Statistics', 20, summaryY);
  
  const totalUnits = mockBloodInventory.reduce((sum, item) => sum + item.unitsAvailable, 0);
  const lowStockItems = mockBloodInventory.filter(item => item.unitsAvailable <= item.minThreshold);
  const donations = data.bloodTransactions.filter(t => t.type === 'Donation');
  const usage = data.bloodTransactions.filter(t => t.type === 'Usage');
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total Blood Units in Stock: ${totalUnits}`, 20, summaryY + 10);
  doc.text(`Low Stock Alerts: ${lowStockItems.length} blood types`, 20, summaryY + 18);
  doc.text(`Donations (Last Month): ${donations.length} transactions`, 20, summaryY + 26);
  doc.text(`Usage (Last Month): ${usage.length} transactions`, 20, summaryY + 34);
  
  doc.save('blood-bank-report.pdf');
};