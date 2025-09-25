import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Droplets, Plus, Minus, AlertTriangle, Activity, Clock } from 'lucide-react';
import { BloodInventory, BloodTransaction, mockBloodInventory, mockBloodTransactions } from '@/data/mockData';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const BloodBankDashboard: React.FC = () => {
  const [inventory, setInventory] = useState<BloodInventory[]>(mockBloodInventory);
  const [transactions, setTransactions] = useState<BloodTransaction[]>(mockBloodTransactions);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const { toast } = useToast();

  // Form state
  const [transactionData, setTransactionData] = useState({
    type: 'Donation' as 'Donation' | 'Usage',
    bloodType: '',
    units: '',
    patientName: '',
    donorName: ''
  });

  const handleTransactionChange = (field: string, value: string) => {
    setTransactionData(prev => ({ ...prev, [field]: value }));
  };

  const handleTransactionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!transactionData.bloodType || !transactionData.units) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const units = parseInt(transactionData.units);
    const bloodType = transactionData.bloodType;

    // Update inventory
    setInventory(prev => prev.map(item => 
      item.bloodType === bloodType 
        ? {
            ...item,
            unitsAvailable: transactionData.type === 'Donation' 
              ? item.unitsAvailable + units
              : Math.max(0, item.unitsAvailable - units),
            lastUpdated: new Date().toISOString().split('T')[0]
          }
        : item
    ));

    // Add transaction record
    const newTransaction: BloodTransaction = {
      id: Date.now().toString(),
      type: transactionData.type,
      bloodType: bloodType,
      units: units,
      date: new Date().toISOString().split('T')[0],
      patientName: transactionData.type === 'Usage' ? transactionData.patientName : undefined,
      donorName: transactionData.type === 'Donation' ? transactionData.donorName : undefined
    };

    setTransactions(prev => [newTransaction, ...prev]);

    // Reset form
    setTransactionData({
      type: 'Donation',
      bloodType: '',
      units: '',
      patientName: '',
      donorName: ''
    });
    setShowTransactionForm(false);

    toast({
      title: "Success",
      description: `Blood ${transactionData.type.toLowerCase()} recorded successfully`,
    });
  };

  // Statistics
  const totalUnits = inventory.reduce((acc, item) => acc + item.unitsAvailable, 0);
  const lowStockItems = inventory.filter(item => item.unitsAvailable <= item.minThreshold);
  const criticalStockItems = inventory.filter(item => item.unitsAvailable < item.minThreshold * 0.5);

  // Chart data
  const chartData = {
    labels: inventory.map(item => item.bloodType),
    datasets: [
      {
        data: inventory.map(item => item.unitsAvailable),
        backgroundColor: [
          'hsl(var(--primary) / 0.8)',
          'hsl(var(--secondary) / 0.8)',
          'hsl(var(--warning) / 0.8)',
          'hsl(var(--destructive) / 0.8)',
          'hsl(var(--success) / 0.8)',
          'hsl(var(--accent) / 0.8)',
          'hsl(var(--muted) / 0.8)',
          'hsl(var(--border) / 0.8)',
        ],
        borderColor: [
          'hsl(var(--primary))',
          'hsl(var(--secondary))',
          'hsl(var(--warning))',
          'hsl(var(--destructive))',
          'hsl(var(--success))',
          'hsl(var(--accent))',
          'hsl(var(--muted))',
          'hsl(var(--border))',
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: true,
        text: 'Blood Type Distribution',
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Blood Bank Management</h1>
          <p className="text-muted-foreground">Monitor blood inventory and track donations/usage</p>
        </div>
        <Button onClick={() => setShowTransactionForm(true)} className="flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Record Transaction
        </Button>
      </div>

      {/* Transaction Form Dialog */}
      <Dialog open={showTransactionForm} onOpenChange={setShowTransactionForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Blood Transaction</DialogTitle>
            <DialogDescription>
              Add a new donation or usage record
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleTransactionSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="type">Transaction Type *</Label>
              <Select value={transactionData.type} onValueChange={(value: 'Donation' | 'Usage') => handleTransactionChange('type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Donation">Donation</SelectItem>
                  <SelectItem value="Usage">Usage</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bloodType">Blood Type *</Label>
              <Select value={transactionData.bloodType} onValueChange={(value) => handleTransactionChange('bloodType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select blood type" />
                </SelectTrigger>
                <SelectContent>
                  {inventory.map(item => (
                    <SelectItem key={item.bloodType} value={item.bloodType}>
                      {item.bloodType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="units">Units *</Label>
              <Input
                id="units"
                type="number"
                value={transactionData.units}
                onChange={(e) => handleTransactionChange('units', e.target.value)}
                placeholder="Number of units"
                min="1"
                required
              />
            </div>
            
            {transactionData.type === 'Donation' && (
              <div className="space-y-2">
                <Label htmlFor="donorName">Donor Name</Label>
                <Input
                  id="donorName"
                  value={transactionData.donorName}
                  onChange={(e) => handleTransactionChange('donorName', e.target.value)}
                  placeholder="Enter donor name"
                />
              </div>
            )}
            
            {transactionData.type === 'Usage' && (
              <div className="space-y-2">
                <Label htmlFor="patientName">Patient Name</Label>
                <Input
                  id="patientName"
                  value={transactionData.patientName}
                  onChange={(e) => handleTransactionChange('patientName', e.target.value)}
                  placeholder="Enter patient name"
                />
              </div>
            )}
            
            <div className="flex gap-2 pt-4">
              <Button type="submit">Record Transaction</Button>
              <Button type="button" variant="outline" onClick={() => setShowTransactionForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Tabs defaultValue="inventory" className="space-y-6">
        <TabsList>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Units</CardTitle>
                <Droplets className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{totalUnits}</div>
                <p className="text-xs text-muted-foreground">All blood types</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
                <AlertTriangle className="h-4 w-4 text-warning" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-warning">{lowStockItems.length}</div>
                <p className="text-xs text-muted-foreground">Below threshold</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Critical Stock</CardTitle>
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">{criticalStockItems.length}</div>
                <p className="text-xs text-muted-foreground">Urgent restocking needed</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Transactions</CardTitle>
                <Activity className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-secondary">
                  {transactions.filter(t => t.date === new Date().toISOString().split('T')[0]).length}
                </div>
                <p className="text-xs text-muted-foreground">Donations + Usage</p>
              </CardContent>
            </Card>
          </div>

          {/* Alerts */}
          {lowStockItems.length > 0 && (
            <Card className="border-warning bg-warning/5">
              <CardHeader>
                <CardTitle className="flex items-center text-warning">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Stock Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {lowStockItems.map(item => (
                    <div key={item.bloodType} className="flex items-center justify-between p-2 bg-background rounded">
                      <span className="font-medium">{item.bloodType}</span>
                      <Badge variant={item.unitsAvailable < item.minThreshold * 0.5 ? 'destructive' : 'outline'}>
                        {item.unitsAvailable} units (Min: {item.minThreshold})
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Blood Inventory Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {inventory.map((item) => {
              const isLowStock = item.unitsAvailable <= item.minThreshold;
              const isCriticalStock = item.unitsAvailable < item.minThreshold * 0.5;
              
              return (
                <Card key={item.bloodType} className={`hover:shadow-lg transition-all duration-200 ${
                  isCriticalStock ? 'border-destructive bg-destructive/5' :
                  isLowStock ? 'border-warning bg-warning/5' : ''
                }`}>
                  <CardHeader className="text-center pb-2">
                    <div className="flex justify-center mb-2">
                      <div className={`p-3 rounded-full ${
                        isCriticalStock ? 'bg-destructive' :
                        isLowStock ? 'bg-warning' : 'bg-primary'
                      }`}>
                        <Droplets className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <CardTitle className="text-lg">{item.bloodType}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className={`text-3xl font-bold mb-2 ${
                      isCriticalStock ? 'text-destructive' :
                      isLowStock ? 'text-warning' : 'text-primary'
                    }`}>
                      {item.unitsAvailable}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">units available</p>
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">
                        Min: {item.minThreshold} units
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Updated: {new Date(item.lastUpdated).toLocaleDateString()}
                      </div>
                    </div>
                    {isLowStock && (
                      <Badge variant={isCriticalStock ? 'destructive' : 'outline'} className="mt-2">
                        {isCriticalStock ? 'Critical' : 'Low Stock'}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-primary" />
                Transaction History
              </CardTitle>
              <CardDescription>Recent blood donations and usage records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant={transaction.type === 'Donation' ? 'secondary' : 'outline'}>
                            {transaction.type === 'Donation' ? <Plus className="h-3 w-3 mr-1" /> : <Minus className="h-3 w-3 mr-1" />}
                            {transaction.type}
                          </Badge>
                          <span className="font-semibold">{transaction.bloodType}</span>
                          <span className="text-sm text-muted-foreground">
                            {transaction.units} {transaction.units === 1 ? 'unit' : 'units'}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {transaction.type === 'Donation' && transaction.donorName && `Donor: ${transaction.donorName}`}
                          {transaction.type === 'Usage' && transaction.patientName && `Patient: ${transaction.patientName}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">{new Date(transaction.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {transactions.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No transactions recorded yet.
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
                <CardTitle>Blood Type Distribution</CardTitle>
                <CardDescription>Current inventory by blood type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <Pie data={chartData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Stock Status Overview</CardTitle>
                <CardDescription>Inventory levels compared to minimum thresholds</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inventory.map(item => {
                    const percentage = (item.unitsAvailable / (item.minThreshold * 2)) * 100;
                    const isLow = item.unitsAvailable <= item.minThreshold;
                    const isCritical = item.unitsAvailable < item.minThreshold * 0.5;
                    
                    return (
                      <div key={item.bloodType} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{item.bloodType}</span>
                          <span className={`${
                            isCritical ? 'text-destructive' :
                            isLow ? 'text-warning' : 'text-foreground'
                          }`}>
                            {item.unitsAvailable} units
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              isCritical ? 'bg-destructive' :
                              isLow ? 'bg-warning' : 'bg-success'
                            }`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Transaction Summary</CardTitle>
              <CardDescription>Donation vs usage statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-secondary">
                    {transactions.filter(t => t.type === 'Donation').length}
                  </div>
                  <p className="text-sm text-muted-foreground">Total Donations</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {transactions.filter(t => t.type === 'Usage').length}
                  </div>
                  <p className="text-sm text-muted-foreground">Total Usage</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-warning">
                    {transactions.reduce((acc, t) => acc + t.units, 0)}
                  </div>
                  <p className="text-sm text-muted-foreground">Total Units Handled</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BloodBankDashboard;