import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { loginUser } from '../services/auth';
import { AuthContext } from '../context/AuthContext';
import { Eye, EyeOff, LogIn } from 'lucide-react';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      setError(null);
      const response = await loginUser(data);
      if (response && response.data && response.data.token) {
        login(response.data.token, response.data.user);
        navigate('/dashboard'); // or redirect based on location state
      } else {
        setError('Login failed parsing response.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-2xl border border-[#dadce0] bg-white shadow-sm lg:grid-cols-2">
        <section className="relative flex flex-col items-center justify-center border-b-2 border-black bg-black p-8 text-center text-white lg:border-b-0 lg:border-r-2 lg:p-10">
          <div className="space-y-6">
            <h1 className="text-4xl font-black leading-tight">
              Welcome Back.
            </h1>
            <p className="mx-auto max-w-sm text-sm leading-6 text-white/90">
              Sign in to continue your learning streak, track practice performance, and access your personalized dashboard.
            </p>
          </div>
        </section>

        <section className="bg-white p-8 lg:p-10">
          <div>
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center border-2 border-black">
              <LogIn className="h-5 w-5 text-black" />
            </div>
            <h2 className="text-3xl font-black leading-tight text-black">Sign in</h2>
            <p className="mt-2 text-sm font-medium text-black/80">
              New here?{' '}
              <Link to="/register" className="font-bold underline decoration-2 underline-offset-4 hover:text-[#1a73e8]">
                Sign up
              </Link>
            </p>
          </div>

          {error && (
            <div className="mt-5 border-2 border-black bg-black p-3">
              <p className="text-sm font-semibold text-white">{error}</p>
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
                {...register('email', { required: 'Email is required' })}
                className="block w-full rounded-lg border border-[#dadce0] bg-white px-3 py-3 text-[#202124] placeholder:text-[#5f6368] focus:border-[#1a73e8] focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/20"
                placeholder="you@example.com"
              />
              {errors.email && <p className="mt-1 text-xs font-bold text-[#d41929]">{errors.email.message}</p>}
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="block text-sm font-bold text-black" htmlFor="password">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-bold underline decoration-2 underline-offset-4 hover:text-[#1a73e8]"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  {...register('password', { required: 'Password is required' })}
                  className="block w-full rounded-lg border border-[#dadce0] bg-white px-3 py-3 pr-12 text-[#202124] placeholder:text-[#5f6368] focus:border-[#1a73e8] focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/20"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md border border-[#dadce0] bg-white p-1 text-[#5f6368] hover:border-[#1a73e8] hover:text-[#1a73e8]"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs font-bold text-[#d41929]">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 flex w-full items-center justify-center rounded-lg border border-[#1a73e8] bg-[#1a73e8] px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#1765cc] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>

          </form>
        </section>
      </div>
    </div>
  );
};

export default Login;