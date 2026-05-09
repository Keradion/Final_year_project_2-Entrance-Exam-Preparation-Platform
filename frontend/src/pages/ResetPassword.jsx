import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { LockKeyhole, Eye, EyeOff, GraduationCap, ShieldCheck, ArrowRight, CheckCircle } from 'lucide-react';
import { resetPassword } from '../services/auth';
import ThemeToggle from '../components/ThemeToggle';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const token = searchParams.get('token') || '';

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const newPassword = watch('newPassword');

  const onSubmit = async (data) => {
    try {
      setError('');
      setMessage('');
      await resetPassword({
        resetToken: token,
        newPassword: data.newPassword,
      });
      setMessage('Password has been reset. Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      const serverErrors = err.response?.data?.errors;
      if (Array.isArray(serverErrors) && serverErrors.length > 0) {
        setError(serverErrors[0].msg);
      } else {
        setError(err.response?.data?.message || 'Could not reset password.');
      }
    }
  };

  if (!token) {
    return (
      <div className="bg-background text-on-surface min-h-screen flex flex-col font-sans overflow-x-hidden">
        <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between gap-2 px-4 sm:px-6 h-14 sm:h-16 bg-header-surface/95 backdrop-blur border-b border-outline/10 min-w-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="w-8 h-8 bg-primary-container rounded flex items-center justify-center shrink-0">
               <GraduationCap className="text-on-primary" size={20} />
            </div>
            <h1 className="text-base sm:text-xl font-bold text-on-surface tracking-tight truncate min-w-0">Entrance Exam Prep</h1>
          </div>
          <ThemeToggle />
        </header>
        <main className="flex-grow flex items-center justify-center pt-20 px-4 sm:px-6 w-full min-w-0 pb-10">
          <div className="mx-auto w-full max-w-lg rounded-lg border border-outline/20 bg-card p-stack-lg shadow-sm">
            <h2 className="text-2xl font-bold text-on-surface mb-2">Invalid Link</h2>
            <p className="text-on-surface-variant mb-6">The recovery token is missing or has expired.</p>
            <Link to="/forgot-password" className="text-primary-container font-semibold hover:underline">
              Request a new recovery link
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col font-sans overflow-x-hidden">
      {/* TopAppBar Shell */}
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between gap-2 px-4 sm:px-6 h-14 sm:h-16 bg-header-surface/95 backdrop-blur border-b border-outline/10 min-w-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className="w-8 h-8 bg-primary-container rounded flex items-center justify-center shrink-0">
             <GraduationCap className="text-on-primary" size={20} />
          </div>
          <h1 className="text-base sm:text-xl font-bold text-on-surface tracking-tight truncate min-w-0">Entrance Exam Prep</h1>
        </div>
        <ThemeToggle />
      </header>

      <main className="flex-grow flex items-center justify-center pt-20 sm:pt-24 pb-8 sm:pb-12 px-4 sm:px-6 w-full min-w-0">
        <div className="w-full max-w-lg bg-card rounded-lg border border-outline-variant p-stack-lg shadow-[0px_4px_12px_rgba(0,0,0,0.05)] flex flex-col justify-center">
          <div className="mb-stack-lg">
            <h3 className="text-2xl font-semibold text-on-surface mb-2">Reset Password</h3>
            <p className="text-body-md text-on-surface-variant">Define your new secure portal password.</p>
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
              <label className="block text-sm font-medium text-on-surface mb-2" htmlFor="newPassword">New Password</label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  {...register('newPassword', {
                    required: 'New password is required',
                    minLength: { value: 6, message: 'Minimum 6 characters' },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                      message: 'Must include uppercase, lowercase, and number',
                    },
                  })}
                  className="w-full px-4 py-3 pl-11 pr-11 rounded-lg border border-outline/20 focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all"
                  placeholder="••••••••"
                />
                <LockKeyhole size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.newPassword && <p className="mt-1 text-xs text-error">{errors.newPassword.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface mb-2" htmlFor="confirmPassword">Confirm Password</label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword', {
                    required: 'Please confirm password',
                    validate: (value) => value === newPassword || 'Passwords do not match',
                  })}
                  className="w-full px-4 py-3 pl-11 pr-11 rounded-lg border border-outline/20 focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all"
                  placeholder="••••••••"
                />
                <LockKeyhole size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-xs text-error">{errors.confirmPassword.message}</p>}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary-container text-on-primary py-3 px-6 rounded-lg font-semibold text-lg hover:brightness-110 active:opacity-80 transition-all duration-200 flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Updating...' : 'Update Password'}
                {!isSubmitting && <ArrowRight size={20} />}
              </button>
            </div>
          </form>

          <div className="mt-stack-lg text-center">
            <Link to="/login" className="text-sm text-primary-container font-semibold hover:underline flex items-center justify-center gap-2">
               Back to Sign In
            </Link>
          </div>
        </div>
      </main>

      <footer className="w-full py-6 sm:py-8 px-4 sm:px-6 mt-auto flex flex-col md:flex-row justify-between items-center gap-4 bg-surface border-t border-outline/10 min-w-0">
        <div className="flex flex-col items-center md:items-start gap-1 text-center md:text-left max-w-full">
          <span className="text-sm font-semibold text-on-surface">Entrance Exam Prep</span>
          <p className="text-xs text-on-surface-variant">© 2026 Ethiopian University Entrance Exam Preparation Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default ResetPassword;
