import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Bed, 
  Clock, 
  Activity, 
  Droplets, 
  AlertTriangle,
  TrendingUp,
  Calendar,
  Download
} from 'lucide-react';
import { mockPatients, mockBeds, mockBloodInventory, getIllnessStats, getWaitingTimesData } from '@/data/mockData';
import { exportPatientAdmissionsPDF, exportIllnessInsightsPDF, exportBloodBankPDF } from '@/utils/pdfExports';

const DashboardSummary: React.FC = () => {
  const navigate = useNavigate();

  // Calculate statistics
  const totalPatientsToday = mockPatients.filter(p => 
    p.admissionDate === '2024-01-17' || p.status === 'Admitted'
  ).length;

  const bedsOccupied = mockBeds.filter(b => b.status === 'Occupied').length;
  const bedsAvailable = mockBeds.filter(b => b.status === 'Available').length;
  const totalBeds = mockBeds.length;

  const avgWaitTime = Math.round(
    getWaitingTimesData().reduce((acc, curr) => acc + curr.avgWaitTime, 0) / 
    getWaitingTimesData().length
  );

  const illnessStats = getIllnessStats();
  const mostCommonIllness = Object.entries(illnessStats).sort((a, b) => b[1] - a[1])[0];

  const lowStockBlood = mockBloodInventory.filter(b => b.unitsAvailable <= b.minThreshold);

  const summaryCards = [
    {
      title: 'Patients Today',
      value: totalPatientsToday,
      description: 'Total admitted patients',
      icon: Users,
      color: 'bg-primary',
      onClick: () => navigate('/patients'),
    },
    {
      title: 'Bed Occupancy',
      value: `${bedsOccupied}/${totalBeds}`,
      description: `${bedsAvailable} beds available`,
      icon: Bed,
      color: 'bg-secondary',
      onClick: () => navigate('/beds'),
    },
    {
      title: 'Avg Wait Time',
      value: `${avgWaitTime}min`,
      description: 'Across all departments',
      icon: Clock,
      color: 'bg-warning',
      onClick: () => navigate('/patients'),
    },
    {
      title: 'Common Illness',
      value: mostCommonIllness?.[1] || 0,
      description: mostCommonIllness?.[0] || 'No data',
      icon: Activity,
      color: 'bg-destructive',
      onClick: () => navigate('/illness'),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
          <p className="text-muted-foreground">Welcome to MediFlow Hospital Management System</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-all duration-200 cursor-pointer group" onClick={card.onClick}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${card.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{card.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-primary" />
              Quick Stats
            </CardTitle>
            <CardDescription>Key metrics at a glance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">Total Beds</span>
              <span className="text-lg font-bold text-primary">{totalBeds}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">Occupancy Rate</span>
              <span className="text-lg font-bold text-secondary">
                {Math.round((bedsOccupied / totalBeds) * 100)}%
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">Blood Types Low</span>
              <span className="text-lg font-bold text-destructive">{lowStockBlood.length}</span>
            </div>
          </CardContent>
        </Card>

        {/* Alerts & Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-warning" />
              Alerts & Notifications
            </CardTitle>
            <CardDescription>Important updates and warnings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {lowStockBlood.length > 0 && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="flex items-center">
                  <Droplets className="h-4 w-4 text-destructive mr-2" />
                  <span className="text-sm font-medium text-destructive">
                    Low Blood Stock Alert
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {lowStockBlood.length} blood type(s) below minimum threshold
                </p>
              </div>
            )}
            
            <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-warning mr-2" />
                <span className="text-sm font-medium text-warning">
                  High Wait Times
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Surgery department: 60min average wait time
              </p>
            </div>

            <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
              <div className="flex items-center">
                <Users className="h-4 w-4 text-success mr-2" />
                <span className="text-sm font-medium text-success">
                  System Status
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                All systems operational
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Access Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Access frequently used features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-20 flex-col space-y-2"
              onClick={() => navigate('/patients')}
            >
              <Users className="h-6 w-6" />
              <span className="text-xs">Add Patient</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col space-y-2"
              onClick={() => navigate('/beds')}
            >
              <Bed className="h-6 w-6" />
              <span className="text-xs">Manage Beds</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col space-y-2"
              onClick={() => navigate('/blood-bank')}
            >
              <Droplets className="h-6 w-6" />
              <span className="text-xs">Blood Bank</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col space-y-2"
              onClick={() => navigate('/illness')}
            >
              <Activity className="h-6 w-6" />
              <span className="text-xs">View Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* PDF Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Download Reports</CardTitle>
          <CardDescription>Export last 1 month data as PDF reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-16 flex-col space-y-2"
              onClick={exportPatientAdmissionsPDF}
            >
              <Download className="h-5 w-5" />
              <span className="text-xs">Patient Admissions PDF</span>
            </Button>
            <Button
              variant="outline"
              className="h-16 flex-col space-y-2"
              onClick={exportIllnessInsightsPDF}
            >
              <Download className="h-5 w-5" />
              <span className="text-xs">Illness Insights PDF</span>
            </Button>
            <Button
              variant="outline"
              className="h-16 flex-col space-y-2"
              onClick={exportBloodBankPDF}
            >
              <Download className="h-5 w-5" />
              <span className="text-xs">Blood Bank PDF</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSummary;