import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Save, User, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import {
  updateProfile as updateProfileRequest,
  changePassword as changePasswordRequest,
} from '../services/auth';

const getStatusBadgeClass = (status) => {
  if (status === 'active') {
    return 'border-[#0f9d58] bg-[#e8f5ee] text-[#0f9d58]';
  }

  return 'border-[#d41929] bg-[#feecee] text-[#d41929]';
};

const getRoleBadgeClass = (role) => {
  if (role === 'admin') {
    return 'border-[#7c3aed] bg-[#f4efff] text-[#7c3aed]';
  }

  if (role === 'teacher') {
    return 'border-[#1a73e8] bg-[#edf4ff] text-[#1a73e8]';
  }

  return 'border-[#2563eb] bg-[#eff6ff] text-[#2563eb]';
};

const formatStatus = (status) => {
  if (!status) return 'Active';
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const formatRole = (role) => {
  if (!role) return 'Student';
  return role.charAt(0).toUpperCase() + role.slice(1);
};

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phoneNumber: user?.phoneNumber || '',
      profileImageFile: undefined,
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    watch,
    reset: resetPasswordForm,
    formState: { errors: passwordFormErrors, isSubmitting: isPasswordSubmitting },
  } = useForm({
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const newPasswordValue = watch('newPassword');

  useEffect(() => {
    reset({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phoneNumber: user?.phoneNumber || '',
      profileImageFile: undefined,
    });
  }, [user, reset]);

  const onSubmit = async (formValues) => {
    try {
      setServerError('');
      setSuccessMessage('');

      const payload = new FormData();
      payload.append('firstName', formValues.firstName?.trim() || '');
      payload.append('lastName', formValues.lastName?.trim() || '');

      if (formValues.phoneNumber?.trim()) {
        payload.append('phoneNumber', formValues.phoneNumber.trim());
      }

      if (formValues.profileImageFile?.[0]) {
        payload.append('profileImageFile', formValues.profileImageFile[0]);
      }

      const response = await updateProfileRequest(payload);
      const updatedUser = response?.data || response;
      setUser(updatedUser);
      setSuccessMessage('Profile updated successfully.');
    } catch (error) {
      const validationError = error.response?.data?.errors?.[0]?.msg;
      setServerError(validationError || error.response?.data?.message || 'Failed to update profile.');
    }
  };

  const onChangePassword = async (formValues) => {
    try {
      setPasswordError('');
      setPasswordSuccess('');

      const response = await changePasswordRequest({
        oldPassword: formValues.oldPassword,
        newPassword: formValues.newPassword,
      });

      setPasswordSuccess(response?.message || 'Password updated successfully.');
      resetPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      const validationError = error.response?.data?.errors?.[0]?.msg;
      setPasswordError(validationError || error.response?.data?.message || 'Failed to change password.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <div className="rounded-2xl border border-[#e3e6ea] bg-white p-6 shadow-sm">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#5f6368] hover:text-[#202124]"
          >
            <ArrowLeft size={14} />
            Back to dashboard
          </Link>

          <div className="mt-4 flex items-center gap-4">
            <div className="inline-flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-[#dfe2e6] bg-[#f0f2f5]">
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-7 w-7 text-[#5f6368]" />
              )}
            </div>

            <div>
              <h1 className="text-2xl font-extrabold leading-tight text-[#202124]">
                {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-sm font-medium text-[#5f6368]">{user?.email}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <p
                  className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${getRoleBadgeClass(user?.role)}`}
                >
                  {formatRole(user?.role)}
                </p>
                <p
                  className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${getStatusBadgeClass(user?.status)}`}
                >
                  {formatStatus(user?.status)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <form className="space-y-5 rounded-2xl border border-[#e3e6ea] bg-white p-6 shadow-sm" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <h2 className="text-lg font-bold text-[#202124]">Profile Details</h2>
            <p className="mt-1 text-sm text-[#5f6368]">Update your personal information and profile image.</p>
          </div>

          {successMessage && (
            <div className="rounded-lg border border-[#1a73e8]/30 bg-[#edf4ff] px-4 py-3 text-sm font-semibold text-[#1a73e8]">
              {successMessage}
            </div>
          )}

          {serverError && (
            <div className="rounded-lg border border-[#d41929]/30 bg-[#feecee] px-4 py-3 text-sm font-semibold text-[#d41929]">
              {serverError}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-semibold text-[#202124]" htmlFor="firstName">
                First name
              </label>
              <input
                id="firstName"
                type="text"
                {...register('firstName', {
                  required: 'First name is required',
                  minLength: { value: 2, message: 'First name must be at least 2 characters' },
                })}
                className="block w-full rounded-lg border border-[#d6dbe1] bg-white px-3 py-2.5 text-[#202124] placeholder:text-[#7a8088] focus:border-[#1a73e8] focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/10"
              />
              {errors.firstName && <p className="mt-1 text-xs font-bold text-[#d41929]">{errors.firstName.message}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-[#202124]" htmlFor="lastName">
                Last name
              </label>
              <input
                id="lastName"
                type="text"
                {...register('lastName', {
                  required: 'Last name is required',
                  minLength: { value: 2, message: 'Last name must be at least 2 characters' },
                })}
                className="block w-full rounded-lg border border-[#d6dbe1] bg-white px-3 py-2.5 text-[#202124] placeholder:text-[#7a8088] focus:border-[#1a73e8] focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/10"
              />
              {errors.lastName && <p className="mt-1 text-xs font-bold text-[#d41929]">{errors.lastName.message}</p>}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-[#202124]" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={user?.email || ''}
              disabled
              className="block w-full cursor-not-allowed rounded-lg border border-[#e1e4e8] bg-[#f7f8fa] px-3 py-2.5 text-[#6f7680]"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-[#202124]" htmlFor="phoneNumber">
              Phone number
            </label>
            <input
              id="phoneNumber"
              type="text"
              placeholder="Optional"
              {...register('phoneNumber', {
                pattern: {
                  value: /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
                  message: 'Please provide a valid phone number',
                },
              })}
              className="block w-full rounded-lg border border-[#d6dbe1] bg-white px-3 py-2.5 text-[#202124] placeholder:text-[#7a8088] focus:border-[#1a73e8] focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/10"
            />
            {errors.phoneNumber && <p className="mt-1 text-xs font-bold text-[#d41929]">{errors.phoneNumber.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-[#202124]" htmlFor="profileImageFile">
              Profile image file
            </label>
            <input
              id="profileImageFile"
              type="file"
              accept="image/*"
              {...register('profileImageFile', {
                validate: (files) => {
                  if (!files || files.length === 0) return true;
                  const file = files[0];
                  if (!file.type.startsWith('image/')) {
                    return 'Only image files are allowed';
                  }
                  return file.size <= 5 * 1024 * 1024 || 'Image size must be 5MB or less';
                },
              })}
              className="block w-full rounded-lg border border-[#d6dbe1] px-3 py-2 text-[#202124] file:mr-4 file:rounded-md file:border-0 file:bg-[#1a73e8] file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-[#1765cc]"
            />
            {errors.profileImageFile && <p className="mt-1 text-xs font-bold text-[#d41929]">{errors.profileImageFile.message}</p>}
            {user?.profileImage && (
              <div className="mt-3 rounded-xl border border-[#e4e7eb] bg-[#fafbfc] p-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#5f6368]">Current image</p>
                <img
                  src={user.profileImage}
                  alt="Current profile"
                  className="h-20 w-20 rounded-lg border border-[#d6dbe1] object-cover"
                />
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#1a73e8] bg-[#1a73e8] px-4 py-2.5 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#1765cc] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Save size={16} />
              {isSubmitting ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>

        <div className="rounded-2xl border border-[#e3e6ea] bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-[#202124]">Change Password</h2>
          <p className="mt-1 text-sm text-[#5f6368]">
            Use a strong password with uppercase, lowercase, and a number.
          </p>

          <form className="mt-4 space-y-4" onSubmit={handlePasswordSubmit(onChangePassword)}>
            {passwordError && (
              <div className="rounded-lg border border-[#d41929]/30 bg-[#feecee] px-4 py-3 text-sm font-semibold text-[#d41929]">
                {passwordError}
              </div>
            )}

            {passwordSuccess && (
              <div className="rounded-lg border border-[#1a73e8]/30 bg-[#edf4ff] px-4 py-3 text-sm font-semibold text-[#1a73e8]">
                {passwordSuccess}
              </div>
            )}

            <div>
              <label className="mb-1 block text-sm font-semibold text-[#202124]" htmlFor="oldPassword">
                Current password
              </label>
              <div className="relative">
                <input
                  id="oldPassword"
                  type={showCurrentPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  {...registerPassword('oldPassword', {
                    required: 'Current password is required',
                  })}
                  className="block w-full rounded-lg border border-[#d6dbe1] bg-white px-3 py-2.5 pr-12 text-[#202124] focus:border-[#1a73e8] focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md border border-[#d6dbe1] bg-white p-1 text-[#5f6368] hover:border-[#1a73e8] hover:text-[#1a73e8]"
                  aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
                >
                  {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {passwordFormErrors.oldPassword && (
                <p className="mt-1 text-xs font-bold text-[#d41929]">{passwordFormErrors.oldPassword.message}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-[#202124]" htmlFor="newPassword">
                New password
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  {...registerPassword('newPassword', {
                    required: 'New password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                      message: 'Password must contain uppercase, lowercase, and number',
                    },
                  })}
                  className="block w-full rounded-lg border border-[#d6dbe1] bg-white px-3 py-2.5 pr-12 text-[#202124] focus:border-[#1a73e8] focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md border border-[#d6dbe1] bg-white p-1 text-[#5f6368] hover:border-[#1a73e8] hover:text-[#1a73e8]"
                  aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {passwordFormErrors.newPassword && (
                <p className="mt-1 text-xs font-bold text-[#d41929]">{passwordFormErrors.newPassword.message}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-[#202124]" htmlFor="confirmPassword">
                Confirm new password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  {...registerPassword('confirmPassword', {
                    required: 'Please confirm your new password',
                    validate: (value) => value === newPasswordValue || 'Passwords do not match',
                  })}
                  className="block w-full rounded-lg border border-[#d6dbe1] bg-white px-3 py-2.5 pr-12 text-[#202124] focus:border-[#1a73e8] focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md border border-[#d6dbe1] bg-white p-1 text-[#5f6368] hover:border-[#1a73e8] hover:text-[#1a73e8]"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {passwordFormErrors.confirmPassword && (
                <p className="mt-1 text-xs font-bold text-[#d41929]">{passwordFormErrors.confirmPassword.message}</p>
              )}
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={isPasswordSubmitting}
                className="inline-flex items-center justify-center rounded-lg border border-black bg-black px-4 py-2.5 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#202124] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isPasswordSubmitting ? 'Updating password...' : 'Update password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
