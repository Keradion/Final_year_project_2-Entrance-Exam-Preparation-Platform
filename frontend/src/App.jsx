import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { CircleUserRound } from 'lucide-react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

// Basic dashboard placeholder
const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  
  return (
    <div className="min-h-screen bg-white text-black">
      <nav className="border-b-2 border-black bg-white px-4 py-3 sm:px-6">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
          <h1 className="text-lg font-black tracking-tight text-black">Dashboard</h1>
          <div className="flex items-center gap-2">
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="inline-flex h-10 items-center justify-center rounded-lg border border-black px-3 text-sm font-semibold text-black transition-colors hover:bg-black hover:text-white"
              >
                Admin
              </Link>
            )}
            <Link
              to="/profile"
              aria-label="Open profile"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-black text-black transition-colors hover:bg-black hover:text-white"
            >
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="Profile"
                  className="h-full w-full rounded-md object-cover"
                />
              ) : (
                <CircleUserRound size={20} />
              )}
            </Link>
            <button
              type="button"
              onClick={logout}
              className="inline-flex h-10 items-center justify-center rounded-lg border border-black px-3 text-sm font-semibold text-black transition-colors hover:bg-black hover:text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="px-4 py-10 sm:px-6">
        <div className="mx-auto w-full max-w-6xl">
          <p className="text-xl font-bold text-black">Welcome {user?.email}</p>
        </div>
      </main>
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
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;