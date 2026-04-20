import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { registerUser } from '../services/auth';
import { AuthContext } from '../context/AuthContext';
import { Eye, EyeOff, UserPlus } from 'lucide-react';

const FIELD_NAME_MAP = {
  firstName: 'First name',
  lastName: 'Last name',
  email: 'Email',
  password: 'Password',
  phoneNumber: 'Phone number',
  role: 'Role',
  profileImage: 'Profile image',
};

const Register = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    setError: setFormError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      role: 'student'
    }
  });

  const onSubmit = async (data) => {
    try {
      setError(null);
      clearErrors();
      const formData = new FormData();
      formData.append('firstName', data.firstName);
      formData.append('lastName', data.lastName);
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('role', data.role || 'student');

      if (data.phoneNumber?.trim()) {
        formData.append('phoneNumber', data.phoneNumber.trim());
      }

      if (data.profileImageFile?.[0]) {
        formData.append('profileImageFile', data.profileImageFile[0]);
      }

      const response = await registerUser(formData);
      // Auto-login upon successful registration
      if (response && response.data && response.data.token) {
        login(response.data.token, response.data.user);
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    } catch (err) {
      const serverErrors = err?.response?.data?.errors;

      if (Array.isArray(serverErrors) && serverErrors.length > 0) {
        const formatted = serverErrors
          .filter((item) => item?.msg)
          .map((item) => {
            const field = item.path || item.param;
            if (!field) return item.msg;
            const label = FIELD_NAME_MAP[field] || field;
            return `${label}: ${item.msg}`;
          });

        serverErrors.forEach((item) => {
          const field = item.path || item.param;
          if (!field || !(field in FIELD_NAME_MAP)) return;
          setFormError(field, { type: 'server', message: item.msg });
        });

        setError(formatted[0] || 'Please correct the highlighted fields and try again.');
        return;
      }

      if (err?.response?.data?.message) {
        setError(err.response.data.message);
        return;
      }

      if (err?.request) {
        setError('Could not reach the server. Please make sure the backend is running and try again.');
        return;
      }

      setError('Registration failed due to an unexpected error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 overflow-hidden rounded-2xl border border-[#dadce0] bg-white shadow-sm lg:grid-cols-2">
        <section className="relative flex flex-col items-center justify-center border-b-2 border-black bg-black p-8 text-center text-white lg:border-b-0 lg:border-r-2 lg:p-10">
          <div className="space-y-6">
            <h1 className="text-4xl font-black leading-tight">
              Create Your Account.
            </h1>
            <p className="mx-auto max-w-sm text-sm leading-6 text-white/90">
              Start preparing smarter with guided quizzes, exercises, and a progress dashboard tailored to your role.
            </p>
          </div>
        </section>

        <section className="bg-white p-8 lg:p-10">
          <div>
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center border-2 border-black">
              <UserPlus className="h-5 w-5 text-black" />
            </div>
            <h2 className="text-3xl font-black leading-tight text-black">Create account</h2>
            <p className="mt-2 text-sm font-medium text-black/80">
              Already have an account?{' '}
              <Link to="/login" className="font-bold underline decoration-2 underline-offset-4 hover:text-[#d41929]">
                Sign in
              </Link>
            </p>
          </div>

          {error && (
            <div className="mt-5 border-2 border-black bg-black p-3">
              <p className="text-sm font-semibold text-white">{error}</p>
            </div>
          )}

          <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-bold text-black" htmlFor="firstName">First Name</label>
                <input
                  id="firstName"
                  type="text"
                  autoComplete="given-name"
                  {...register('firstName', {
                    required: 'First name is required',
                    minLength: { value: 2, message: 'First name must be at least 2 characters' },
                  })}
                  className="block w-full rounded-lg border border-[#dadce0] bg-white px-3 py-3 text-[#202124] placeholder:text-[#5f6368] focus:border-[#1a73e8] focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/20"
                />
                {errors.firstName && <p className="mt-1 text-xs font-bold text-[#d41929]">{errors.firstName.message}</p>}
              </div>
              <div>
                <label className="mb-1 block text-sm font-bold text-black" htmlFor="lastName">Last Name</label>
                <input
                  id="lastName"
                  type="text"
                  autoComplete="family-name"
                  {...register('lastName', {
                    required: 'Last name is required',
                    minLength: { value: 2, message: 'Last name must be at least 2 characters' },
                  })}
                  className="block w-full rounded-lg border border-[#dadce0] bg-white px-3 py-3 text-[#202124] placeholder:text-[#5f6368] focus:border-[#1a73e8] focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/20"
                />
                {errors.lastName && <p className="mt-1 text-xs font-bold text-[#d41929]">{errors.lastName.message}</p>}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-black" htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email address' },
                })}
                className="block w-full rounded-lg border border-[#dadce0] bg-white px-3 py-3 text-[#202124] placeholder:text-[#5f6368] focus:border-[#1a73e8] focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/20"
              />
              {errors.email && <p className="mt-1 text-xs font-bold text-[#d41929]">{errors.email.message}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-black" htmlFor="password">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                      message: 'Password must include uppercase, lowercase, and number',
                    },
                  })}
                  className="block w-full rounded-lg border border-[#dadce0] bg-white px-3 py-3 pr-12 text-[#202124] placeholder:text-[#5f6368] focus:border-[#1a73e8] focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/20"
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

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-bold text-black" htmlFor="role">Role</label>
                <select
                  id="role"
                  {...register('role')}
                  className="block w-full rounded-lg border border-[#dadce0] bg-white px-3 py-3 text-[#202124] focus:border-[#1a73e8] focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/20"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-bold text-black" htmlFor="phoneNumber">Phone (optional)</label>
                <input
                  id="phoneNumber"
                  type="tel"
                  autoComplete="tel"
                  {...register('phoneNumber', {
                    pattern: {
                      value: /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/,
                      message: 'Invalid phone number format',
                    },
                  })}
                  className="block w-full rounded-lg border border-[#dadce0] bg-white px-3 py-3 text-[#202124] placeholder:text-[#5f6368] focus:border-[#1a73e8] focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/20"
                  placeholder="+2519XXXXXXXX"
                />
                {errors.phoneNumber && <p className="mt-1 text-xs font-bold text-[#d41929]">{errors.phoneNumber.message}</p>}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-black" htmlFor="profileImageFile">Profile image (optional)</label>
              <input
                id="profileImageFile"
                type="file"
                accept="image/*"
                {...register('profileImageFile', {
                  validate: (files) => {
                    if (!files || files.length === 0) return true;
                    return files[0].size <= 5 * 1024 * 1024 || 'Image size must be 5MB or less';
                  },
                })}
                className="block w-full rounded-lg border border-[#dadce0] px-3 py-2 text-[#202124] file:mr-4 file:rounded-md file:border-0 file:bg-[#1a73e8] file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-[#1765cc]"
              />
              {errors.profileImageFile && <p className="mt-1 text-xs font-bold text-[#d41929]">{errors.profileImageFile.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 flex w-full items-center justify-center rounded-lg border border-[#1a73e8] bg-[#1a73e8] px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#1765cc] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? 'Signing up...' : 'Sign up'}
            </button>

          </form>
        </section>
      </div>
    </div>
  );
};

export default Register;