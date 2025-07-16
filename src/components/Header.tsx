import React, { useState } from 'react';
import { Car, User, LogIn, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';

interface HeaderProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onPageChange }) => {
  const { user, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleAuthClick = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const menuItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'cars', label: 'Cars' },
    { id: 'reserve', label: 'Reserve' },
  ];

  if (user?.isAdmin) {
    menuItems.push({ id: 'admin', label: 'Admin Panel' });
  }

  if (user && !user.isAdmin) {
    menuItems.push({ id: 'profile', label: 'My Reservations' });
  }

  return (
    <>
      <header className="bg-black text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onPageChange('home')}>
              <img src="/image.png" alt="888Rent" className="h-10 w-10" />
              <div className="text-xl font-bold">
                <span className="text-red-500">888</span>Rent
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === item.id
                      ? 'bg-red-500 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-300">
                    Welcome, {user.fullName}
                  </span>
                  <button
                    onClick={logout}
                    className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleAuthClick('login')}
                    className="flex items-center space-x-1 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Login</span>
                  </button>
                  <button
                    onClick={() => handleAuthClick('register')}
                    className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    <User className="h-4 w-4" />
                    <span>Sign Up</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-300 hover:text-white"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-700">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onPageChange(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors ${
                      currentPage === item.id
                        ? 'bg-red-500 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
                
                {/* Mobile Auth Buttons */}
                <div className="pt-4 border-t border-gray-700">
                  {user ? (
                    <div className="space-y-2">
                      <div className="px-3 py-2 text-sm text-gray-300">
                        Welcome, {user.fullName}
                      </div>
                      <button
                        onClick={() => {
                          logout();
                          setMobileMenuOpen(false);
                        }}
                        className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors w-full"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          handleAuthClick('login');
                          setMobileMenuOpen(false);
                        }}
                        className="flex items-center space-x-1 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-md text-sm font-medium transition-colors w-full"
                      >
                        <LogIn className="h-4 w-4" />
                        <span>Login</span>
                      </button>
                      <button
                        onClick={() => {
                          handleAuthClick('register');
                          setMobileMenuOpen(false);
                        }}
                        className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors w-full"
                      >
                        <User className="h-4 w-4" />
                        <span>Sign Up</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {showAuthModal && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuthModal(false)}
          onSwitchMode={(mode) => setAuthMode(mode)}
        />
      )}
    </>
  );
};

export default Header;