import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Stethoscope } from 'lucide-react';

// Define the shape of a navigation link
type NavItem = {
  href: string;
  label: string;
  allowedRoles: ('Admin' | 'Doctor' | 'Staff')[];
};

// Define all possible navigation links and which roles can see them
const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', allowedRoles: ['Admin', 'Doctor', 'Staff'] },
  { href: '/patients', label: 'Patients', allowedRoles: ['Admin', 'Doctor', 'Staff'] },
  { href: '/beds', label: 'Beds', allowedRoles: ['Admin', 'Staff'] },
  { href: '/illness', label: 'Illness Trends', allowedRoles: ['Admin', 'Doctor'] },
  { href: '/blood-bank', label: 'Blood Bank', allowedRoles: ['Admin', 'Doctor', 'Staff'] },
];

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login page after logout
  };

  // If there's no user, don't render the navbar (or render a minimal version)
  if (!user) {
    return null;
  }

  // Filter the navigation items based on the current user's role
  const filteredNavItems = navItems.filter(item => 
    item.allowedRoles.includes(user.role)
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Stethoscope className="h-6 w-6 mr-2" />
          <span className="font-bold">MediFlow</span>
        </div>
        <nav className="flex items-center space-x-4 lg:space-x-6">
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-primary ${
                  isActive ? '' : 'text-muted-foreground'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <span className="text-sm text-muted-foreground">Welcome, {user.role}</span>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;