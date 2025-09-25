import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, Clock, TrendingUp } from 'lucide-react';
import { Patient, mockPatients, getWaitingTimesData, getAdmissionTrend } from '@/data/mockData';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PatientDashboard: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterWard, setFilterWard] = useState<string>('all');
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    guardian: '',
    contact: '',
    address: '',
    ward: '',
    reason: '',
    consultingDoctor: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.age || !formData.contact) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newPatient: Patient = {
      id: Date.now().toString(),
      ...formData,
      age: parseInt(formData.age),
      admissionDate: new Date().toISOString().split('T')[0],
      status: 'Admitted' as const
    };

    setPatients(prev => [newPatient, ...prev]);
    setFormData({
      name: '',
      age: '',
      gender: 'Male',
      guardian: '',
      contact: '',
      address: '',
      ward: '',
      reason: '',
      consultingDoctor: ''
    });
    setShowAddForm(false);
    
    toast({
      title: "Success",
      description: "Patient admission recorded successfully",
    });
  };

  // Filter patients
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.consultingDoctor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesWard = filterWard === 'all' || patient.ward === filterWard;
    return matchesSearch && matchesWard;
  });

  // Waiting times data
  const waitingTimesData = getWaitingTimesData();
  
  // Admission trend chart data
  const admissionTrendData = getAdmissionTrend();
  const chartData = {
    labels: admissionTrendData.map(item => new Date(item.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Admissions',
        data: admissionTrendData.map(item => item.admissions),
        borderColor: 'hsl(var(--primary))',
        backgroundColor: 'hsl(var(--primary) / 0.1)',
        tension: 0.4,
      },
      {
        label: 'Discharges',
        data: admissionTrendData.map(item => item.discharges),
        borderColor: 'hsl(var(--secondary))',
        backgroundColor: 'hsl(var(--secondary) / 0.1)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Admissions vs Discharges Trend',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Patient Management</h1>
          <p className="text-muted-foreground">Manage patient admissions and waiting times</p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Add Patient
        </Button>
      </div>

      <Tabs defaultValue="patients" className="space-y-6">
        <TabsList>
          <TabsTrigger value="patients">Patient List</TabsTrigger>
          <TabsTrigger value="waiting-times">Waiting Times</TabsTrigger>
          <TabsTrigger value="trends">Admission Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="patients" className="space-y-6">
          {/* Add Patient Form */}
          {showAddForm && (
            <Card>
              <CardHeader>
                <CardTitle>Add New Patient</CardTitle>
                <CardDescription>Enter patient admission details</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter patient name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="age">Age *</Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      placeholder="Enter age"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="guardian">Guardian</Label>
                    <Input
                      id="guardian"
                      value={formData.guardian}
                      onChange={(e) => handleInputChange('guardian', e.target.value)}
                      placeholder="Guardian name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contact">Contact *</Label>
                    <Input
                      id="contact"
                      value={formData.contact}
                      onChange={(e) => handleInputChange('contact', e.target.value)}
                      placeholder="Phone number"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ward">Ward</Label>
                    <Select value={formData.ward} onValueChange={(value) => handleInputChange('ward', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select ward" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="General">General</SelectItem>
                        <SelectItem value="ICU">ICU</SelectItem>
                        <SelectItem value="Emergency">Emergency</SelectItem>
                        <SelectItem value="Surgery">Surgery</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Patient address"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason for Admission</Label>
                    <Input
                      id="reason"
                      value={formData.reason}
                      onChange={(e) => handleInputChange('reason', e.target.value)}
                      placeholder="Reason for admission"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="doctor">Consulting Doctor</Label>
                    <Input
                      id="doctor"
                      value={formData.consultingDoctor}
                      onChange={(e) => handleInputChange('consultingDoctor', e.target.value)}
                      placeholder="Doctor name"
                    />
                  </div>
                  
                  <div className="md:col-span-2 flex gap-2">
                    <Button type="submit">Add Patient</Button>
                    <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Search and Filter */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search patients or doctors..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filterWard} onValueChange={setFilterWard}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filter by ward" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Wards</SelectItem>
                    <SelectItem value="General">General</SelectItem>
                    <SelectItem value="ICU">ICU</SelectItem>
                    <SelectItem value="Emergency">Emergency</SelectItem>
                    <SelectItem value="Surgery">Surgery</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Patient List */}
          <Card>
            <CardHeader>
              <CardTitle>Patient List ({filteredPatients.length})</CardTitle>
              <CardDescription>Currently admitted and recent patients</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredPatients.map((patient) => (
                  <div key={patient.id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground">{patient.name}</h3>
                          <Badge variant={patient.status === 'Admitted' ? 'default' : 
                                        patient.status === 'Discharged' ? 'secondary' : 'outline'}>
                            {patient.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {patient.age} years • {patient.gender} • {patient.ward} Ward
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Dr. {patient.consultingDoctor} • Admitted: {new Date(patient.admissionDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">{patient.reason}</p>
                        <p className="text-sm text-muted-foreground">{patient.contact}</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredPatients.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No patients found matching your criteria.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="waiting-times" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-primary" />
                Average Waiting Times by Department
              </CardTitle>
              <CardDescription>Current waiting times across hospital departments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {waitingTimesData.map((dept) => (
                  <div key={dept.department} className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-foreground">{dept.department}</h3>
                      <Badge variant={dept.avgWaitTime > 45 ? 'destructive' : 
                                   dept.avgWaitTime > 30 ? 'outline' : 'secondary'}>
                        {dept.avgWaitTime}min
                      </Badge>
                    </div>
                    <div className="mt-2">
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            dept.avgWaitTime > 45 ? 'bg-destructive' :
                            dept.avgWaitTime > 30 ? 'bg-warning' : 'bg-secondary'
                          }`}
                          style={{ width: `${Math.min((dept.avgWaitTime / 60) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                Admission Trends
              </CardTitle>
              <CardDescription>Hospital admission and discharge patterns over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <Line data={chartData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientDashboard;