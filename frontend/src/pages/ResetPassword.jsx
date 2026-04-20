import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { LockKeyhole, Eye, EyeOff } from 'lucide-react';
import { resetPassword } from '../services/auth';

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
      <div className="min-h-screen bg-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-lg rounded-2xl border border-[#dadce0] bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-black text-black">Invalid reset link</h2>
          <p className="mt-2 text-sm text-black/80">The reset token is missing or invalid.</p>
          <Link to="/forgot-password" className="mt-4 inline-block font-bold underline decoration-2 underline-offset-4 hover:text-[#1a73e8]">
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-lg overflow-hidden rounded-2xl border border-[#dadce0] bg-white shadow-sm">
        <section className="p-8 lg:p-10">
          <div className="mb-5 inline-flex h-12 w-12 items-center justify-center border-2 border-black">
            <LockKeyhole className="h-5 w-5 text-black" />
          </div>
          <h2 className="text-3xl font-black leading-tight text-black">Reset Password</h2>
          <p className="mt-2 text-sm font-medium text-black/80">
            Enter your new password below.
          </p>

          {message && (
            <div className="mt-5 rounded-lg border border-[#1a73e8]/30 bg-[#edf4ff] p-3 text-sm font-semibold text-[#1a73e8]">
              {message}
            </div>
          )}

          {error && (
            <div className="mt-5 rounded-lg border border-[#d41929]/30 bg-[#feecee] p-3 text-sm font-semibold text-[#d41929]">
              {error}
            </div>
          )}

          <form className="mt-6 space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="mb-1 block text-sm font-bold text-black" htmlFor="newPassword">
                New password
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  {...register('newPassword', {
                    required: 'New password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                      message: 'Password must include uppercase, lowercase, and number',
                    },
                  })}
                  className="block w-full rounded-lg border border-[#dadce0] bg-white px-3 py-3 pr-12 text-[#202124] focus:border-[#1a73e8] focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md border border-[#dadce0] bg-white p-1 text-[#5f6368] hover:border-[#1a73e8] hover:text-[#1a73e8]"
                  aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.newPassword && <p className="mt-1 text-xs font-bold text-[#d41929]">{errors.newPassword.message}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-black" htmlFor="confirmPassword">
                Confirm new password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  {...register('confirmPassword', {
                    required: 'Please confirm your new password',
                    validate: (value) => value === newPassword || 'Passwords do not match',
                  })}
                  className="block w-full rounded-lg border border-[#dadce0] bg-white px-3 py-3 pr-12 text-[#202124] focus:border-[#1a73e8] focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md border border-[#dadce0] bg-white p-1 text-[#5f6368] hover:border-[#1a73e8] hover:text-[#1a73e8]"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-xs font-bold text-[#d41929]">{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 flex w-full items-center justify-center rounded-lg border border-[#1a73e8] bg-[#1a73e8] px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#1765cc] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? 'Resetting...' : 'Reset password'}
            </button>
          </form>

          <p className="mt-5 text-sm font-medium text-black/80">
            Back to{' '}
            <Link to="/login" className="font-bold underline decoration-2 underline-offset-4 hover:text-[#1a73e8]">
              Sign in
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
};

export default ResetPassword;
