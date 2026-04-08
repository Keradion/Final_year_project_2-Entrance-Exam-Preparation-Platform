import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';

// Basic dashboard placeholder
const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  
  return (
    <div className="min-h-screen bg-white text-black p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 border-2 border-black">
        <h1 className="text-3xl font-extrabold text-black mb-4">Welcome back!</h1>
        <p className="text-black mb-8 font-bold">
          Logged in as: <span className="font-extrabold text-[#d41929]">{user?.firstName} {user?.lastName}</span> ({user?.role})
        </p>
        <p className="text-black font-semibold text-sm mb-4">Email: {user?.email}</p>
        <button 
          onClick={logout}
          className="bg-[#d41929] hover:bg-black text-white font-bold py-3 px-6 border-2 border-black transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;