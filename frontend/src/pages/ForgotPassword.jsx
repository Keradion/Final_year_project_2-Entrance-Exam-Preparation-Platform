import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail } from 'lucide-react';
import { requestPasswordReset } from '../services/auth';

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
    <div className="min-h-screen bg-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-lg overflow-hidden rounded-2xl border border-[#dadce0] bg-white shadow-sm">
        <section className="p-8 lg:p-10">
          <div className="mb-5 inline-flex h-12 w-12 items-center justify-center border-2 border-black">
            <Mail className="h-5 w-5 text-black" />
          </div>
          <h2 className="text-3xl font-black leading-tight text-black">Forgot Password</h2>
          <p className="mt-2 text-sm font-medium text-black/80">
            Enter your email and we will send you a reset link.
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
              <label className="mb-1 block text-sm font-bold text-black" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email address' },
                })}
                className="block w-full rounded-lg border border-[#dadce0] bg-white px-3 py-3 text-[#202124] placeholder:text-[#5f6368] focus:border-[#1a73e8] focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/20"
                placeholder="you@example.com"
              />
              {errors.email && <p className="mt-1 text-xs font-bold text-[#d41929]">{errors.email.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 flex w-full items-center justify-center rounded-lg border border-[#1a73e8] bg-[#1a73e8] px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#1765cc] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? 'Sending...' : 'Send reset link'}
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

export default ForgotPassword;
