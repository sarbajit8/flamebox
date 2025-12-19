import React, { useState, useEffect } from 'react';
import { 
  User,
  Users,
  LogOut,
  Menu,
  Bell,
  ChevronDown,
  Building,
  Shield,
  BarChart3,
  FileText,
  HelpCircle,
  Calendar,
  Settings,
  X
} from 'lucide-react';

// Header Component
const Topbar = ({ 
  currentSection, 
  onSectionChange, 
  user = { name: "User", role: "Guest", email: "example@email.com" } 
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { id: 'schedule', label: 'Schedule Management', icon: Calendar },
    { id: 'accesscontrole', label:'Access Controle', icon: Users },
    { id: 'leads', label: 'Lead Tracking', icon: BarChart3 },
    { id: 'employees', label: 'Employee Access', icon: Shield },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'profile', label: 'Profile Settings', icon: User }
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-menu')) {
        setIsProfileOpen(false);
      }
      if (!event.target.closest('.mobile-menu')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu when section changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [currentSection]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            {/* Left side - Logo and Navigation */}
            <div className="flex items-center">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-red-700 rounded-lg flex items-center justify-center">
                  <Building className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-bold text-xl hidden xs:block">GymManager</span>
                <span className="text-white font-bold text-xl xs:hidden">GM</span>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-1 ml-8">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onSectionChange(item.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        currentSection === item.id
                          ? 'bg-red-600 text-white'
                          : 'text-gray-300 hover:text-white hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="whitespace-nowrap">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

           
          </div>
        </div>

        {/* Mobile Navigation Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm mt-16">
            <div className="bg-gray-800 border-t border-gray-700 max-h-[calc(100vh-4rem)] overflow-y-auto mobile-menu">
              <nav className="px-4 py-4 space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onSectionChange(item.id)}
                      className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl text-base font-medium transition-colors ${
                        currentSection === item.id
                          ? 'bg-red-600 text-white shadow-lg'
                          : 'text-gray-300 hover:text-white hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span className="text-left">{item.label}</span>
                    </button>
                  );
                })}
                
            
              </nav>
              
              {/* User info in mobile menu */}
             
            </div>
          </div>
        )}
      </header>

      {/* Custom CSS for extra small screens */}
      <style jsx>{`
        @media (max-width: 475px) {
          .xs\\:hidden { display: none; }
          .xs\\:block { display: block; }
          .xs\\:flex { display: flex; }
        }
      `}</style>
    </>
  );
};

export default Topbar;