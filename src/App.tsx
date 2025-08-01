import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import Header from './components/Header';
import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage';
import CarsPage from './components/CarsPage';
import ReservePage from './components/ReservePage';
import ProfilePage from './components/ProfilePage';
import AdminPage from './components/AdminPage';
import { TranslationProvider } from './contexts/TranslationContext';

// Inner component that waits for auth to load before rendering app content
const AppContent: React.FC = () => {
  const { isLoading, error } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedCarId, setSelectedCarId] = useState<string | undefined>();

  const handleReserve = (carId: string) => {
    setSelectedCarId(carId);
    setCurrentPage('reserve-from-car');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onPageChange={setCurrentPage} />;
      case 'about':
        return <AboutPage />;
      case 'cars':
        return <CarsPage onReserve={handleReserve} />;
      case 'reserve':
        return <ReservePage selectedCarId={''} />;
      case 'reserve-from-car':
        return <ReservePage selectedCarId={selectedCarId} />;
      case 'profile':
        return <ProfilePage />;
      case 'admin':
        return <AdminPage />;
      default:
        return <HomePage onPageChange={setCurrentPage} />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage={currentPage} onPageChange={setCurrentPage} />
      <main>{renderPage()}</main>
    </div>
  );
};

function App() {
  return (
    <ToastProvider>
      <TranslationProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </TranslationProvider>
    </ToastProvider>
  );
}

export default App;
