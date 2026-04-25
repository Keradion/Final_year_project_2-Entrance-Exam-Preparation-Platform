import React, { useState, useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { loginUser } from '../services/auth';
import { AuthContext } from '../context/AuthContext';
import { Eye, EyeOff, GraduationCap, ShieldCheck, Mail, Lock, ArrowRight, BookOpen, CheckCircle } from 'lucide-react';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);
  const successMessage = location.state?.message;
  const [showPassword, setShowPassword] = useState(false);
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      setError(null);
      const response = await loginUser(data);
      if (response && response.data && response.data.token) {
        login(response.data.token, response.data.user);
        navigate('/dashboard'); 
      } else {
        setError('Login failed parsing response.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col font-sans">
      <main className="flex-grow flex items-center justify-center py-12 px-6">
        {/* Asymmetric Bento Layout for Login */}
        <div className="w-full max-w-[1000px] grid grid-cols-1 lg:grid-cols-12 gap-gutter items-stretch">
          
          {/* Branding/Visual Section */}
          <div className="lg:col-span-7 hidden lg:flex flex-col justify-between p-stack-lg bg-primary-container rounded-lg text-on-primary relative overflow-hidden min-h-[560px]">
            <div className="relative z-10">
              <h2 className="text-5xl font-bold mb-stack-md leading-tight">Ethiopia Entrance Exam Preparation</h2>
              <p className="text-lg opacity-90 max-w-md">Your comprehensive platform for mastering subjects, practicing past exams, and tracking your progress toward success.</p>
            </div>
            
            {/* Decorative Graphic */}
            <div className="relative z-10 grid grid-cols-2 gap-4 mt-8">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded border border-white/20">
                <BookOpen className="text-white mb-2" size={32} />
                <p className="font-medium text-sm">1,200+ Courses</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded border border-white/20">
                <CheckCircle className="text-white mb-2" size={32} />
                <p className="font-medium text-sm">Accredited Content</p>
              </div>
            </div>

            {/* Abstract background pattern */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
              <img 
                className="w-full h-full object-cover" 
                alt="Modern library architecture" 
                src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=1000" 
              />
              <div className="absolute inset-0 bg-gradient-to-br from-primary-container via-primary-container/80 to-transparent"></div>
            </div>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-5 bg-white rounded-lg border border-outline-variant p-stack-lg shadow-[0px_4px_12px_rgba(0,0,0,0.05)] flex flex-col justify-center">
            <div className="mb-stack-lg">
              <h3 className="text-2xl font-semibold text-on-surface mb-2">Sign In</h3>
              <p className="text-body-md text-on-surface-variant">Access your dashboard.</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-lg text-sm flex items-center gap-3">
                <ShieldCheck size={20} />
                {error}
              </div>
            )}

            {successMessage && !error && (
              <div className="mb-6 p-4 bg-primary-container/10 text-primary-container rounded-lg text-sm flex items-center gap-3">
                <CheckCircle size={20} />
                {successMessage}
              </div>
            )}


            {/* Manual Form */}
            <form className="space-y-stack-md" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-2" htmlFor="email">Email</label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    {...register('email', { required: 'Email is required' })}
                    className="w-full px-4 py-3 pl-11 rounded-lg border border-outline/20 focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all"
                    placeholder="you@example.com"
                  />
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" />
                </div>
                {errors.email && <p className="mt-1 text-xs text-error">{errors.email.message}</p>}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-on-surface" htmlFor="password">Password</label>
                  <Link to="/forgot-password" size="sm" className="text-xs text-primary-container hover:underline">Forgot Password?</Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', { required: 'Password is required' })}
                    className="w-full px-4 py-3 pl-11 rounded-lg border border-outline/20 focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all"
                    placeholder="••••••••"
                  />
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-error">{errors.password.message}</p>}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary-container text-on-primary py-3 px-6 rounded-lg font-semibold text-lg hover:brightness-110 active:opacity-80 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? 'Authenticating...' : 'Log In'}
                  {!isSubmitting && <ArrowRight size={20} />}
                </button>
              </div>
            </form>

            <div className="mt-stack-lg text-center">
              <p className="text-sm text-on-surface-variant">
                Don't have an account? 
                <Link to="/register" className="text-primary-container font-semibold hover:underline ml-1">Sign Up</Link>
              </p>
            </div>
          </div>
        </div>
      </main>


    </div>
  );
};

export default Login;