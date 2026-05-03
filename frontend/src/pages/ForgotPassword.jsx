import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, GraduationCap, ShieldCheck, ArrowRight, ArrowLeft, BookOpen, CheckCircle } from 'lucide-react';
import { requestPasswordReset } from '../services/auth';
import ThemeToggle from '../components/ThemeToggle';

const ForgotPassword = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setError('');
      setMessage('');
      const response = await requestPasswordReset({ email: data.email });
      setMessage(response?.data?.message || response?.message || 'If any account exists for this email, a reset link will be sent.');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not process your request.');
    }
  };

  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col font-sans">
      {/* TopAppBar Shell */}
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 h-16 bg-header-surface/95 backdrop-blur border-b border-outline/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary-container rounded flex items-center justify-center">
             <GraduationCap className="text-on-primary" size={20} />
          </div>
          <h1 className="text-xl font-bold text-on-surface tracking-tight">Entrance Exam Prep</h1>
        </div>
        <ThemeToggle />
      </header>

      <main className="flex-grow flex items-center justify-center pt-24 pb-12 px-6">
        <div className="w-full max-w-lg bg-card rounded-lg border border-outline-variant p-stack-lg shadow-[0px_4px_12px_rgba(0,0,0,0.05)] flex flex-col justify-center">
          <div className="mb-stack-lg">
            <h3 className="text-2xl font-semibold text-on-surface mb-2">Reset Request</h3>
            <p className="text-body-md text-on-surface-variant">Enter your portal email to receive a secure recovery link.</p>
          </div>

          {message && (
            <div className="mb-6 p-4 bg-primary-container/10 text-primary-container rounded-lg text-sm flex items-center gap-3">
              <CheckCircle size={20} />
              {message}
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-lg text-sm flex items-center gap-3">
              <ShieldCheck size={20} />
              {error}
            </div>
          )}

          <form className="space-y-stack-md" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-2" htmlFor="email">Portal Email</label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' } })}
                  className="w-full px-4 py-3 pl-11 rounded-lg border border-outline/20 focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all"
                  placeholder="you@example.com"
                />
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" />
              </div>
              {errors.email && <p className="mt-1 text-xs text-error">{errors.email.message}</p>}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary-container text-on-primary py-3 px-6 rounded-lg font-semibold text-lg hover:brightness-110 active:opacity-80 transition-all duration-200 flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Processing...' : 'Send Recovery Link'}
                {!isSubmitting && <ArrowRight size={20} />}
              </button>
            </div>
          </form>

          <div className="mt-stack-lg text-center">
            <Link to="/login" className="text-sm text-primary-container font-semibold hover:underline flex items-center justify-center gap-2">
              <ArrowLeft size={16} /> Back to Sign In
            </Link>
          </div>
        </div>
      </main>

      <footer className="w-full py-8 px-6 mt-auto flex flex-col md:flex-row justify-between items-center gap-4 bg-surface border-t border-outline/10">
        <div className="flex flex-col items-center md:items-start gap-1">
          <span className="text-sm font-semibold text-on-surface">Entrance Exam Prep</span>
          <p className="text-xs text-on-surface-variant">© 2026 Ethiopian University Entrance Exam Preparation Platform. All rights reserved.</p>
        </div>
        <nav className="flex gap-6">
          <Link to="#" className="text-xs text-on-surface-variant hover:text-primary-container transition-colors">Privacy Policy</Link>
          <Link to="#" className="text-xs text-on-surface-variant hover:text-primary-container transition-colors">Terms of Service</Link>
          <Link to="#" className="text-xs text-on-surface-variant hover:text-primary-container transition-colors">Help Center</Link>
        </nav>
      </footer>
    </div>
  );
};

export default ForgotPassword;
