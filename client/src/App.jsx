import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/public/Home';
import Auth from './pages/public/Auth';
import HouseDetail from './pages/public/HouseDetail';
import DashboardLayout from './pages/admin/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Overview from './pages/admin/Overview';
import PropertyManagement from './pages/admin/PropertyManagement';
import PropertyForm from './pages/admin/PropertyForm';
import LeadManagement from './pages/admin/LeadManagement';
import UserManagement from './pages/admin/UserManagement';
import PublicProperties from './pages/public/PublicProperties';
import SplashScreen from './components/SplashScreen';
import { Toaster } from 'react-hot-toast';

// Layout for public pages
const PublicLayout = () => (
  <>
    <Navbar />
    <main className="flex-1 flex flex-col">
      <Outlet />
    </main>
    <Footer />
  </>
);

function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = React.useCallback(() => {
    setShowSplash(false);
  }, []);

  return (
    <div className="min-h-screen bg-dark-bg text-gray-100 font-sans selection:bg-brand-blue/30 selection:text-white flex flex-col">
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            background: '#1f2937', // dark-surface
            color: '#fff',
            border: '1px solid #374151', // dark-border
          },
          success: {
            iconTheme: {
              primary: '#10b981', // green
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444', // red
              secondary: '#fff',
            },
          },
        }}
      />
      {!showSplash  && (
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/property/:id" element={<HouseDetail />} />
          <Route path="/construction" element={<PublicProperties />} />
          <Route path="/plans" element={<PublicProperties />} />
          <Route path="/sales" element={<PublicProperties />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute adminOnly><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<Overview />} />
          <Route path="properties" element={<PropertyManagement />} />
          <Route path="properties/new" element={<PropertyForm />} />
          <Route path="properties/edit/:id" element={<PropertyForm />} />
          <Route path="leads" element={<LeadManagement />} />
          <Route path="construction" element={<PropertyManagement />} />
          <Route path="plans" element={<PropertyManagement />} />
          <Route path="sales" element={<PropertyManagement />} />
          <Route path="sold" element={<PropertyManagement />} />
          <Route path="users" element={<UserManagement />} />
        </Route>
        {/* Admin login route */}
        <Route path="/admin/login" element={<Auth adminLoginHint={true} />} />
      </Routes>
      )}
    </div>
  );
}

export default App;
