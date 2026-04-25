import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { CircleUserRound, GraduationCap, LogOut, Layout, User, ShieldCheck, BookOpen, ArrowRight } from 'lucide-react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import ProtectedRoute from './components/ProtectedRoute';

// Basic dashboard placeholder
// High-Fidelity Dashboard Placeholder
const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  
  return (
    <div className="min-h-screen bg-surface text-on-surface font-sans flex overflow-hidden">
      {/* Institutional Sidebar */}
      <aside className="w-[280px] bg-white border-r border-outline/10 hidden lg:flex flex-col z-50 shadow-[4px_0_12px_rgba(0,0,0,0.02)]">
        <div className="p-gutter h-20 flex items-center gap-3 border-b border-outline/5">
          <div className="w-8 h-8 bg-primary-container rounded flex items-center justify-center">
            <GraduationCap className="text-on-primary" size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight">Entrance Exam Prep</span>
        </div>
        
        <nav className="flex-grow p-4 space-y-2">
          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded bg-primary-container text-on-primary font-medium transition-all">
            <Layout size={20} />
            Dashboard
          </Link>
          <Link to="/profile" className="flex items-center gap-3 px-4 py-3 rounded text-on-surface-variant hover:bg-surface transition-all font-medium">
            <User size={20} />
            My Identity
          </Link>
          {user?.role === 'admin' && (
            <Link to="/admin" className="flex items-center gap-3 px-4 py-3 rounded text-on-surface-variant hover:bg-surface transition-all font-medium">
              <ShieldCheck size={20} />
              Governance
            </Link>
          )}
          {user?.role === 'teacher' && (
            <Link to="/teacher" className="flex items-center gap-3 px-4 py-3 rounded text-on-surface-variant hover:bg-surface transition-all font-medium">
              <BookOpen size={20} />
              Faculty Console
            </Link>
          )}
        </nav>

        <div className="p-4 border-t border-outline/5">
          <button onClick={logout} className="flex items-center gap-3 w-full px-4 py-3 rounded text-error hover:bg-error/5 transition-all font-medium">
            <LogOut size={20} />
            Terminate Session
          </button>
        </div>
      </aside>

      <div className="flex-grow flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-outline/5 px-gutter flex items-center justify-between sticky top-0 z-40">
           <div>
             <h2 className="text-lg font-bold text-on-surface">Institutional Command Center</h2>
             <p className="text-xs text-on-surface-variant uppercase tracking-widest font-black">Expert Mentor Portal</p>
           </div>
           
           <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
               <p className="text-sm font-bold">{user?.firstName || 'Alex'}</p>
               <p className="text-[10px] text-on-surface-variant uppercase font-bold">{user?.role} Access Granted</p>
             </div>
             <Link to="/profile" className="w-10 h-10 rounded-full border border-outline/20 overflow-hidden hover:border-primary-container transition-all">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-surface-variant flex items-center justify-center text-on-surface-variant">
                    <CircleUserRound size={24} />
                  </div>
                )}
             </Link>
           </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-grow p-gutter overflow-y-auto bg-surface/50">
          <div className="max-w-[1280px] mx-auto">
            {/* Welcome Banner */}
            <section className="bg-primary-container rounded-lg p-stack-lg text-on-primary mb-stack-md relative overflow-hidden shadow-lg">
               <div className="relative z-10 max-w-2xl">
                 <h1 className="text-4xl font-bold mb-stack-sm tracking-tight">Welcome back, {user?.firstName || 'Scholar'}!</h1>
                 <p className="text-lg opacity-90 mb-stack-md">You've completed 65% of your Grade 9 curriculum. Keep up the momentum to reach your semester goals.</p>
                 <div className="flex gap-4">
                    <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded border border-white/20">
                      <p className="text-xs opacity-80 uppercase font-black">Current Streak</p>
                      <p className="text-2xl font-bold">15 Days</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded border border-white/20">
                      <p className="text-xs opacity-80 uppercase font-black">Assignments</p>
                      <p className="text-2xl font-bold">04 Due</p>
                    </div>
                 </div>
               </div>
               <div className="absolute top-0 right-0 w-1/3 h-full opacity-20 pointer-events-none">
                  <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800" alt="Students studying" className="h-full w-full object-cover" />
               </div>
            </section>

            {/* Quick Access Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter mb-stack-lg">
               <div className="bg-white p-stack-md rounded-lg border border-outline/10 shadow-sm hover:shadow-md transition-all group">
                  <div className="w-12 h-12 bg-surface-variant rounded flex items-center justify-center text-on-surface-variant mb-6 group-hover:bg-primary-container group-hover:text-on-primary transition-all">
                    <BookOpen size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Curriculum Resource</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed mb-6">Access your digitized study materials, syllabi, and pre-recorded lectures.</p>
                  <Link to="#" className="text-primary-container font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all">
                    Initialize Module <ArrowRight size={16} />
                  </Link>
               </div>
               
               <div className="bg-white p-stack-md rounded-lg border border-outline/10 shadow-sm hover:shadow-md transition-all group">
                  <div className="w-12 h-12 bg-surface-variant rounded flex items-center justify-center text-on-surface-variant mb-6 group-hover:bg-primary-container group-hover:text-on-primary transition-all">
                    <ShieldCheck size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Academic Records</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed mb-6">Review your historical performance data and validated institutional transcripts.</p>
                  <Link to="#" className="text-primary-container font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all">
                    View Records <ArrowRight size={16} />
                  </Link>
               </div>

               <div className="bg-white p-stack-md rounded-lg border border-outline/10 shadow-sm hover:shadow-md transition-all group lg:col-span-1 md:col-span-2 lg:col-span-1">
                  <div className="w-12 h-12 bg-surface-variant rounded flex items-center justify-center text-on-surface-variant mb-6 group-hover:bg-primary-container group-hover:text-on-primary transition-all">
                    <Layout size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Examination Hub</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed mb-6">Prepare for upcoming assessments with practice tests and timed simulations.</p>
                  <Link to="#" className="text-primary-container font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all">
                    Access Simulations <ArrowRight size={16} />
                  </Link>
               </div>
            </div>

            {/* Ready for Midterms? */}
            <div className="bg-white border border-outline/10 rounded-lg p-stack-md flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
               <div className="flex items-center gap-6">
                 <div className="w-16 h-16 bg-primary-container/10 rounded-full flex items-center justify-center text-primary-container shrink-0">
                    <GraduationCap size={32} />
                 </div>
                 <div>
                    <h3 className="text-xl font-bold">Ready for your Midterms?</h3>
                    <p className="text-on-surface-variant">Take a practice test to gauge your readiness and identify focus areas.</p>
                 </div>
               </div>
               <button className="bg-primary-container text-on-primary px-8 py-3 rounded-lg font-bold hover:brightness-110 active:opacity-80 transition-all">
                 Initialize Practice Test
               </button>
            </div>
          </div>
        </main>
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
          <Route
            path="/teacher"
            element={
              <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;