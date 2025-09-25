import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Bed, BedDouble, User, UserCheck, UserX, Plus, Filter, Building } from 'lucide-react';
import { Bed as BedType, mockBeds, mockPatients } from '@/data/mockData';

const BedDashboard: React.FC = () => {
  const [beds, setBeds] = useState<BedType[]>(mockBeds);
  const [selectedBed, setSelectedBed] = useState<BedType | null>(null);
  const [filterWard, setFilterWard] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showAllocationForm, setShowAllocationForm] = useState(false);
  const [showAddBedForm, setShowAddBedForm] = useState(false);
  const [showAddWardForm, setShowAddWardForm] = useState(false);
  const [wards, setWards] = useState<string[]>(['General', 'ICU', 'Emergency', 'Surgery']);
  const { toast } = useToast();

  // Form state for bed allocation
  const [allocationData, setAllocationData] = useState({
    patientName: '',
    bedId: '',
    reason: '',
    doctor: ''
  });

  // Form state for adding new bed
  const [newBedData, setNewBedData] = useState({
    number: '',
    ward: '',
    status: 'Available' as const
  });

  // Form state for adding new ward
  const [newWardName, setNewWardName] = useState('');

  const handleAllocationChange = (field: string, value: string) => {
    setAllocationData(prev => ({ ...prev, [field]: value }));
  };

  const handleNewBedChange = (field: string, value: string) => {
    setNewBedData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddBed = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newBedData.number || !newBedData.ward) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Check if bed number already exists
    const bedExists = beds.some(bed => bed.number === newBedData.number);
    if (bedExists) {
      toast({
        title: "Error",
        description: "Bed number already exists",
        variant: "destructive",
      });
      return;
    }

    const newBed: BedType = {
      id: (Date.now()).toString(),
      number: newBedData.number,
      ward: newBedData.ward,
      status: newBedData.status
    };

    setBeds(prev => [...prev, newBed]);
    setNewBedData({ number: '', ward: '', status: 'Available' });
    setShowAddBedForm(false);
    
    toast({
      title: "Success",
      description: "New bed added successfully",
    });
  };

  const handleAddWard = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newWardName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a ward name",
        variant: "destructive",
      });
      return;
    }

    if (wards.includes(newWardName)) {
      toast({
        title: "Error",
        description: "Ward already exists",
        variant: "destructive",
      });
      return;
    }

    setWards(prev => [...prev, newWardName]);
    setNewWardName('');
    setShowAddWardForm(false);
    
    toast({
      title: "Success",
      description: "New ward added successfully",
    });
  };

  const handleAllocateBed = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!allocationData.patientName || !allocationData.bedId) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setBeds(prev => prev.map(bed => 
      bed.id === allocationData.bedId 
        ? {
            ...bed, 
            status: 'Occupied' as const, 
            patientName: allocationData.patientName,
            patientId: Date.now().toString(),
            admissionDate: new Date().toISOString().split('T')[0]
          }
        : bed
    ));

    setAllocationData({ patientName: '', bedId: '', reason: '', doctor: '' });
    setShowAllocationForm(false);
    
    toast({
      title: "Success",
      description: "Bed allocated successfully",
    });
  };

  const handleDischarge = (bedId: string) => {
    setBeds(prev => prev.map(bed => 
      bed.id === bedId 
        ? { 
            ...bed, 
            status: 'Cleaning' as const, 
            patientName: undefined, 
            patientId: undefined, 
            admissionDate: undefined 
          }
        : bed
    ));

    // Simulate cleaning -> available transition after 2 seconds
    setTimeout(() => {
      setBeds(prev => prev.map(bed => 
        bed.id === bedId && bed.status === 'Cleaning'
          ? { ...bed, status: 'Available' as const }
          : bed
      ));
    }, 2000);

    toast({
      title: "Success",
      description: "Patient discharged. Bed is being cleaned.",
    });
  };

  // Filter beds
  const filteredBeds = beds.filter(bed => {
    const matchesWard = filterWard === 'all' || bed.ward === filterWard;
    const matchesStatus = filterStatus === 'all' || bed.status === filterStatus;
    return matchesWard && matchesStatus;
  });

  // Statistics
  const stats = {
    total: beds.length,
    occupied: beds.filter(b => b.status === 'Occupied').length,
    available: beds.filter(b => b.status === 'Available').length,
    cleaning: beds.filter(b => b.status === 'Cleaning').length,
    reserved: beds.filter(b => b.status === 'Reserved').length,
  };

  const getBedStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-status-available text-white';
      case 'Occupied': return 'bg-status-occupied text-white';
      case 'Cleaning': return 'bg-status-cleaning text-black';
      case 'Reserved': return 'bg-status-reserved text-white';
      default: return 'bg-muted';
    }
  };

  const getBedStatusIcon = (status: string) => {
    switch (status) {
      case 'Available': return <UserCheck className="h-4 w-4" />;
      case 'Occupied': return <User className="h-4 w-4" />;
      case 'Cleaning': return <BedDouble className="h-4 w-4" />;
      case 'Reserved': return <UserX className="h-4 w-4" />;
      default: return <Bed className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Bed Management</h1>
          <p className="text-muted-foreground">Monitor and manage hospital bed allocation</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowAllocationForm(true)} className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Allocate Bed
          </Button>
          <Button onClick={() => setShowAddBedForm(true)} variant="outline" className="flex items-center">
            <Bed className="h-4 w-4 mr-2" />
            Add Bed
          </Button>
          <Button onClick={() => setShowAddWardForm(true)} variant="outline" className="flex items-center">
            <Building className="h-4 w-4 mr-2" />
            Add Ward
          </Button>
        </div>
      </div>

      {/* Bed Allocation Form Dialog */}
      <Dialog open={showAllocationForm} onOpenChange={setShowAllocationForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Allocate Bed</DialogTitle>
            <DialogDescription>
              Assign a patient to an available bed
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAllocateBed} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="patientName">Patient Name *</Label>
              <Input
                id="patientName"
                value={allocationData.patientName}
                onChange={(e) => handleAllocationChange('patientName', e.target.value)}
                placeholder="Enter patient name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bedSelect">Select Bed *</Label>
              <Select value={allocationData.bedId} onValueChange={(value) => handleAllocationChange('bedId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose available bed" />
                </SelectTrigger>
                <SelectContent>
                  {beds.filter(bed => bed.status === 'Available').map(bed => (
                    <SelectItem key={bed.id} value={bed.id}>
                      {bed.number} - {bed.ward} Ward
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Admission</Label>
              <Input
                id="reason"
                value={allocationData.reason}
                onChange={(e) => handleAllocationChange('reason', e.target.value)}
                placeholder="Enter reason"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="doctor">Consulting Doctor</Label>
              <Input
                id="doctor"
                value={allocationData.doctor}
                onChange={(e) => handleAllocationChange('doctor', e.target.value)}
                placeholder="Doctor name"
              />
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button type="submit">Allocate Bed</Button>
              <Button type="button" variant="outline" onClick={() => setShowAllocationForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Bed Form Dialog */}
      <Dialog open={showAddBedForm} onOpenChange={setShowAddBedForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Bed</DialogTitle>
            <DialogDescription>
              Add a new bed to the hospital
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddBed} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bedNumber">Bed Number *</Label>
              <Input
                id="bedNumber"
                value={newBedData.number}
                onChange={(e) => handleNewBedChange('number', e.target.value)}
                placeholder="e.g., G-104, I-203"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bedWard">Ward *</Label>
              <Select value={newBedData.ward} onValueChange={(value) => handleNewBedChange('ward', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select ward" />
                </SelectTrigger>
                <SelectContent>
                  {wards.map(ward => (
                    <SelectItem key={ward} value={ward}>
                      {ward}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bedStatus">Initial Status</Label>
              <Select value={newBedData.status} onValueChange={(value) => handleNewBedChange('status', value as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Cleaning">Cleaning</SelectItem>
                  <SelectItem value="Reserved">Reserved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button type="submit">Add Bed</Button>
              <Button type="button" variant="outline" onClick={() => setShowAddBedForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Ward Form Dialog */}
      <Dialog open={showAddWardForm} onOpenChange={setShowAddWardForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Ward</DialogTitle>
            <DialogDescription>
              Add a new ward to the hospital
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddWard} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="wardName">Ward Name *</Label>
              <Input
                id="wardName"
                value={newWardName}
                onChange={(e) => setNewWardName(e.target.value)}
                placeholder="e.g., Pediatrics, Maternity"
                required
              />
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button type="submit">Add Ward</Button>
              <Button type="button" variant="outline" onClick={() => setShowAddWardForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Tabs defaultValue="grid" className="space-y-6">
        <TabsList>
          <TabsTrigger value="grid">Bed Grid</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Beds</CardTitle>
                <Bed className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Available</CardTitle>
                <UserCheck className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">{stats.available}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Occupied</CardTitle>
                <User className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">{stats.occupied}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cleaning</CardTitle>
                <BedDouble className="h-4 w-4 text-warning" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-warning">{stats.cleaning}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reserved</CardTitle>
                <UserX className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.reserved}</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <Select value={filterWard} onValueChange={setFilterWard}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filter by ward" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Wards</SelectItem>
                    {wards.map(ward => (
                      <SelectItem key={ward} value={ward}>{ward}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Occupied">Occupied</SelectItem>
                    <SelectItem value="Cleaning">Cleaning</SelectItem>
                    <SelectItem value="Reserved">Reserved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Bed Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredBeds.map((bed) => (
              <Card 
                key={bed.id} 
                className={`cursor-pointer hover:shadow-lg transition-all duration-200 ${getBedStatusColor(bed.status)}`}
                onClick={() => setSelectedBed(bed)}
              >
                <CardContent className="p-4 text-center">
                  <div className="flex flex-col items-center space-y-2">
                    {getBedStatusIcon(bed.status)}
                    <div className="font-semibold">{bed.number}</div>
                    <div className="text-xs opacity-90">{bed.ward}</div>
                    <Badge variant="outline" className="text-xs bg-white/20">
                      {bed.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Bed Details Dialog */}
          {selectedBed && (
            <Dialog open={!!selectedBed} onOpenChange={() => setSelectedBed(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Bed {selectedBed.number} - {selectedBed.ward} Ward</DialogTitle>
                  <DialogDescription>
                    <Badge variant={selectedBed.status === 'Available' ? 'secondary' : 
                                  selectedBed.status === 'Occupied' ? 'destructive' : 'outline'}>
                      {selectedBed.status}
                    </Badge>
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  {selectedBed.patientName && (
                    <div className="space-y-2">
                      <h4 className="font-semibold">Patient Information</h4>
                      <div className="bg-muted p-3 rounded-lg">
                        <p><strong>Name:</strong> {selectedBed.patientName}</p>
                        {selectedBed.admissionDate && (
                          <p><strong>Admitted:</strong> {new Date(selectedBed.admissionDate).toLocaleDateString()}</p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    {selectedBed.status === 'Occupied' && (
                      <Button 
                        onClick={() => {
                          handleDischarge(selectedBed.id);
                          setSelectedBed(null);
                        }}
                        variant="outline"
                      >
                        Discharge Patient
                      </Button>
                    )}
                    <Button variant="outline" onClick={() => setSelectedBed(null)}>
                      Close
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </TabsContent>

        <TabsContent value="list" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>All Beds ({filteredBeds.length})</CardTitle>
              <CardDescription>Detailed list view of all beds</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredBeds.map((bed) => (
                  <div key={bed.id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground">Bed {bed.number}</h3>
                          <Badge variant={bed.status === 'Available' ? 'secondary' : 
                                        bed.status === 'Occupied' ? 'destructive' : 'outline'}>
                            {bed.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{bed.ward} Ward</p>
                        {bed.patientName && (
                          <p className="text-sm font-medium text-foreground">
                            Patient: {bed.patientName}
                          </p>
                        )}
                        {bed.admissionDate && (
                          <p className="text-sm text-muted-foreground">
                            Admitted: {new Date(bed.admissionDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {bed.status === 'Occupied' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDischarge(bed.id)}
                          >
                            Discharge
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredBeds.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No beds found matching your criteria.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Occupancy Rate by Ward</CardTitle>
                <CardDescription>Bed utilization across hospital wards</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['General', 'ICU', 'Emergency', 'Surgery'].map(ward => {
                    const wardBeds = beds.filter(b => b.ward === ward);
                    const occupiedBeds = wardBeds.filter(b => b.status === 'Occupied').length;
                    const totalBeds = wardBeds.length;
                    const occupancyRate = totalBeds > 0 ? (occupiedBeds / totalBeds) * 100 : 0;
                    
                    return (
                      <div key={ward} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{ward}</span>
                          <span>{occupiedBeds}/{totalBeds} ({occupancyRate.toFixed(0)}%)</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-primary"
                            style={{ width: `${occupancyRate}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bed Status Overview</CardTitle>
                <CardDescription>Current status distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(stats).filter(([key]) => key !== 'total').map(([status, count]) => {
                    const percentage = (count / stats.total) * 100;
                    const capitalizedStatus = status.charAt(0).toUpperCase() + status.slice(1);
                    
                    return (
                      <div key={status} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{capitalizedStatus}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-muted rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                status === 'available' ? 'bg-success' :
                                status === 'occupied' ? 'bg-destructive' :
                                status === 'cleaning' ? 'bg-warning' : 'bg-muted-foreground'
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
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BedDashboard;