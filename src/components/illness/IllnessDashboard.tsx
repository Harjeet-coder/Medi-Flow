import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, Activity, BarChart, Map } from 'lucide-react';
import { Illness, mockIllnesses, getIllnessStats } from '@/data/mockData';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const IllnessDashboard: React.FC = () => {
  const [illnesses, setIllnesses] = useState<Illness[]>(mockIllnesses);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    patientName: '',
    diagnosis: '',
    severity: 'Low' as 'Low' | 'Medium' | 'High' | 'Critical',
    department: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.patientName || !formData.diagnosis) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newIllness: Illness = {
      id: Date.now().toString(),
      patientId: Date.now().toString(),
      ...formData,
      date: new Date().toISOString().split('T')[0]
    };

    setIllnesses(prev => [newIllness, ...prev]);
    setFormData({
      patientName: '',
      diagnosis: '',
      severity: 'Low',
      department: ''
    });
    setShowAddForm(false);
    
    toast({
      title: "Success",
      description: "Illness record added successfully",
    });
  };

  // Filter illnesses
  const filteredIllnesses = illnesses.filter(illness => {
    const matchesSearch = illness.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         illness.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = filterSeverity === 'all' || illness.severity === filterSeverity;
    return matchesSearch && matchesSeverity;
  });

  // Illness statistics
  const illnessStats = getIllnessStats();
  const departmentStats = illnesses.reduce((acc, illness) => {
    acc[illness.department] = (acc[illness.department] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  // Chart data for most common illnesses
  const illnessChartData = {
    labels: Object.keys(illnessStats),
    datasets: [
      {
        label: 'Number of Cases',
        data: Object.values(illnessStats),
        backgroundColor: [
          'hsl(var(--primary) / 0.8)',
          'hsl(var(--secondary) / 0.8)',
          'hsl(var(--warning) / 0.8)',
          'hsl(var(--destructive) / 0.8)',
          'hsl(var(--success) / 0.8)',
        ],
        borderColor: [
          'hsl(var(--primary))',
          'hsl(var(--secondary))',
          'hsl(var(--warning))',
          'hsl(var(--destructive))',
          'hsl(var(--success))',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Department distribution chart
  const departmentChartData = {
    labels: Object.keys(departmentStats),
    datasets: [
      {
        data: Object.values(departmentStats),
        backgroundColor: [
          'hsl(var(--primary) / 0.8)',
          'hsl(var(--secondary) / 0.8)',
          'hsl(var(--warning) / 0.8)',
          'hsl(var(--destructive) / 0.8)',
          'hsl(var(--success) / 0.8)',
        ],
        borderColor: [
          'hsl(var(--primary))',
          'hsl(var(--secondary))',
          'hsl(var(--warning))',
          'hsl(var(--destructive))',
          'hsl(var(--success))',
        ],
        borderWidth: 2,
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
        text: 'Most Common Illnesses',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: true,
        text: 'Cases by Department',
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Illness Insights</h1>
          <p className="text-muted-foreground">Track diseases, patterns, and department analytics</p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Add Record
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="records">Illness Records</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{illnesses.length}</div>
                <p className="text-xs text-muted-foreground">All recorded cases</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Critical Cases</CardTitle>
                <Activity className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">
                  {illnesses.filter(i => i.severity === 'Critical').length}
                </div>
                <p className="text-xs text-muted-foreground">Require immediate attention</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Departments</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Object.keys(departmentStats).length}</div>
                <p className="text-xs text-muted-foreground">Active departments</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Cases</CardTitle>
                <Activity className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {illnesses.filter(i => i.date === new Date().toISOString().split('T')[0]).length}
                </div>
                <p className="text-xs text-muted-foreground">New cases today</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Most Common Illnesses</CardTitle>
                <CardDescription>Frequency of diagnoses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <Bar data={illnessChartData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Department Distribution</CardTitle>
                <CardDescription>Cases by hospital department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <Doughnut data={departmentChartData} options={doughnutOptions} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Geographic Heatmap Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Map className="h-5 w-5 mr-2 text-primary" />
                Geographic Distribution (Mock Heatmap)
              </CardTitle>
              <CardDescription>Illness distribution across regions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg p-8 text-center">
                <Map className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Interactive heatmap would show illness distribution across hospital catchment areas
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  In production: Integrate with mapping service (e.g., Leaflet, Mapbox)
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="records" className="space-y-6">
          {/* Add Illness Form */}
          {showAddForm && (
            <Card>
              <CardHeader>
                <CardTitle>Add Illness Record</CardTitle>
                <CardDescription>Record a new illness diagnosis</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patientName">Patient Name *</Label>
                    <Input
                      id="patientName"
                      value={formData.patientName}
                      onChange={(e) => handleInputChange('patientName', e.target.value)}
                      placeholder="Enter patient name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="diagnosis">Diagnosis *</Label>
                    <Input
                      id="diagnosis"
                      value={formData.diagnosis}
                      onChange={(e) => handleInputChange('diagnosis', e.target.value)}
                      placeholder="Enter diagnosis"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="severity">Severity</Label>
                    <Select value={formData.severity} onValueChange={(value) => handleInputChange('severity', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Emergency">Emergency</SelectItem>
                        <SelectItem value="Cardiology">Cardiology</SelectItem>
                        <SelectItem value="Surgery">Surgery</SelectItem>
                        <SelectItem value="Internal Medicine">Internal Medicine</SelectItem>
                        <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="md:col-span-2 flex gap-2">
                    <Button type="submit">Add Record</Button>
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
                      placeholder="Search patients or diagnoses..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filter by severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severities</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Illness Records Table */}
          <Card>
            <CardHeader>
              <CardTitle>Illness Records ({filteredIllnesses.length})</CardTitle>
              <CardDescription>All recorded illness diagnoses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredIllnesses.map((illness) => (
                  <div key={illness.id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground">{illness.patientName}</h3>
                          <Badge variant={
                            illness.severity === 'Critical' ? 'destructive' :
                            illness.severity === 'High' ? 'default' :
                            illness.severity === 'Medium' ? 'outline' : 'secondary'
                          }>
                            {illness.severity}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium text-foreground">{illness.diagnosis}</p>
                        <p className="text-sm text-muted-foreground">
                          {illness.department} • {new Date(illness.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredIllnesses.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No illness records found matching your criteria.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Severity Distribution</CardTitle>
                <CardDescription>Cases by severity level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Critical', 'High', 'Medium', 'Low'].map(severity => {
                    const count = illnesses.filter(i => i.severity === severity).length;
                    const percentage = (count / illnesses.length) * 100;
                    return (
                      <div key={severity} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{severity}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-muted rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                severity === 'Critical' ? 'bg-destructive' :
                                severity === 'High' ? 'bg-warning' :
                                severity === 'Medium' ? 'bg-primary' : 'bg-secondary'
                              }`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-muted-foreground w-12">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Department Workload</CardTitle>
                <CardDescription>Case distribution by department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(departmentStats).map(([dept, count]) => {
                    const percentage = (count / illnesses.length) * 100;
                    return (
                      <div key={dept} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{dept}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-muted rounded-full h-2">
                            <div 
                              className="h-2 rounded-full bg-primary"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-muted-foreground w-12">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IllnessDashboard;