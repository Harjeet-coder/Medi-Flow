import React from 'react';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Shield } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles, 
  fallback 
}) => {
  const { user, isAuthorized, logout } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-warning rounded-lg">
                <Shield className="h-8 w-8 text-warning-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-warning">Authentication Required</CardTitle>
            <CardDescription>Please log in to access this area</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => window.location.reload()}>
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthorized(allowedRoles)) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-destructive rounded-lg">
                <AlertTriangle className="h-8 w-8 text-destructive-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-destructive">Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access this area
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-sm text-muted-foreground">
              <p>Current role: <span className="font-medium">{user.role}</span></p>
              <p>Required roles: <span className="font-medium">{allowedRoles.join(', ')}</span></p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => window.history.back()}>
                Go Back
              </Button>
              <Button onClick={logout}>
                Switch Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;