import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import LoginPage from "@/components/auth/LoginPage";
import Navbar from "@/components/layout/Navbar";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import DashboardSummary from "@/components/dashboard/DashboardSummary";
import PatientDashboard from "@/components/patients/PatientDashboard";
import IllnessDashboard from "@/components/illness/IllnessDashboard";
import BedDashboard from "@/components/beds/BedDashboard";
import BloodBankDashboard from "@/components/blood/BloodBankDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user } = useAuth();

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['Admin', 'Doctor', 'Staff']}>
                <DashboardSummary />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/patients" 
            element={
              <ProtectedRoute allowedRoles={['Admin', 'Doctor', 'Staff']}>
                <PatientDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/illness" 
            element={
              <ProtectedRoute allowedRoles={['Admin', 'Doctor']}>
                <IllnessDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/beds" 
            element={
              <ProtectedRoute allowedRoles={['Admin', 'Staff']}>
                <BedDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/blood-bank" 
            element={
              <ProtectedRoute allowedRoles={['Admin', 'Doctor', 'Staff']}>
                <BloodBankDashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
