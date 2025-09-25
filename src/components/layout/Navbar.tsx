import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Stethoscope, 
  LayoutDashboard, 
  Users, 
  Activity, 
  Bed, 
  Droplets, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

const navigationItems = [
  { 
    name: 'Dashboard', 
    path: '/dashboard', 
    icon: LayoutDashboard, 
    roles: ['Admin', 'Doctor', 'Staff'] 
  },
  { 
    name: 'Patients', 
    path: '/patients', 
    icon: Users, 
    roles: ['Admin', 'Doctor', 'Staff'] 
  },
  { 
    name: 'Illness Insights', 
    path: '/illness', 
    icon: Activity, 
    roles: ['Admin', 'Doctor'] 
  },
  { 
    name: 'Bed Management', 
    path: '/beds', 
    icon: Bed, 
    roles: ['Admin', 'Staff'] 
  },
  { 
    name: 'Blood Bank', 
    path: '/blood-bank', 
    icon: Droplets, 
    roles: ['Admin', 'Doctor', 'Staff'] 
  },
];

const Navbar: React.FC = () => {
  const { user, logout, isAuthorized } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const filteredNavItems = navigationItems.filter(item => 
    isAuthorized(item.roles as any)
  );

  return (
    <nav className="bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="p-2 bg-primary rounded-lg mr-3">
                <Stethoscope className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold text-primary">MediFlow</h1>
            </div>
            
            {/* Desktop navigation */}
            <div className="hidden md:ml-8 md:flex md:space-x-4">
              {filteredNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </NavLink>
                );
              })}
            </div>
          </div>

          {/* User info and logout */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Welcome,</span>
              <span className="text-sm font-medium">{user?.username}</span>
              <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                {user?.role}
              </span>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="hidden md:flex"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-card border-t border-border">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </NavLink>
              );
            })}
            
            <div className="border-t border-border pt-3 mt-3">
              <div className="px-3 py-2">
                <div className="text-sm text-muted-foreground">Signed in as:</div>
                <div className="text-sm font-medium">{user?.username} ({user?.role})</div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="mx-3 mt-2"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;