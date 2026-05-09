import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { 
  Save, User, ArrowLeft, Eye, EyeOff, FlaskConical, Globe, ShieldCheck, Mail, Phone, 
  Calendar, Activity, BadgeCheck, Edit2, Layout, LogOut, BookOpen, CircleUserRound, ArrowRight, Lock,
  RefreshCw, Bot
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import {
  updateProfile as updateProfileRequest,
  changePassword as changePasswordRequest,
  getAiSettings,
} from '../services/auth';
import ThemeToggle from '../components/ThemeToggle';

const Profile = () => {
  const { user, setUser, logout } = useContext(AuthContext);
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [aiSettings, setAiSettings] = useState(null);

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

  useEffect(() => {
    const fetchAiSettings = async () => {
      if (user?.role !== 'student') return;
      try {
        const response = await getAiSettings();
        setAiSettings(response?.data || null);
      } catch (_err) {
        setAiSettings(null);
      }
    };
    fetchAiSettings();
  }, [user]);

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

  const getDashboardLink = () => {
    if (user?.role === 'admin') return '/admin';
    if (user?.role === 'teacher') return '/teacher';
    return '/dashboard';
  };

  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col font-sans">
      <header className="py-6 px-8 max-w-[1000px] mx-auto w-full flex justify-between items-center gap-4 flex-wrap">
        <Link to={getDashboardLink()} className="text-on-surface-variant hover:text-primary-container flex items-center gap-2 font-semibold transition-colors">
          <ArrowLeft size={20} /> Back to Dashboard
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button onClick={logout} className="text-error hover:bg-error/5 px-4 py-2 rounded-lg flex items-center gap-2 font-semibold transition-colors">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center py-6 px-6">
        <div className="w-full max-w-[800px] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Identity Configuration */}
          <div className="bg-card rounded-xl border border-outline-variant p-stack-lg shadow-[0px_8px_24px_rgba(0,0,0,0.08)]">
            <div className="mb-stack-lg flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center gap-6">
              <div>
                <h3 className="text-2xl font-semibold text-on-surface mb-2">Profile Details</h3>
                <p className="text-body-md text-on-surface-variant">Manage your personal information.</p>
              </div>
              
              <div className="relative w-24 h-24 rounded-full border-4 border-primary-container/10 shadow-sm overflow-hidden bg-surface-variant flex items-center justify-center shrink-0 group">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <CircleUserRound size={40} className="text-on-surface-variant" />
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity cursor-pointer backdrop-blur-sm">
                  <Edit2 size={16} className="text-white mb-1" />
                  <span className="text-[10px] text-white font-bold uppercase tracking-widest">Update</span>
                  <input
                    type="file"
                    accept="image/*"
                    {...register('profileImageFile')}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {successMessage && (
              <div className="mb-6 p-4 bg-primary-container/10 text-primary-container rounded-lg text-sm flex items-center gap-3">
                <BadgeCheck size={20} />
                {successMessage}
              </div>
            )}
            {serverError && (
              <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-lg text-sm flex items-center gap-3">
                <ShieldCheck size={20} />
                {serverError}
              </div>
            )}

            <form className="grid grid-cols-1 md:grid-cols-2 gap-x-gutter gap-y-stack-sm" onSubmit={handleSubmit(onSubmit)}>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-on-surface mb-2">First Name</label>
                <div className="relative">
                  <input
                    {...register('firstName', { required: 'Required' })}
                    className="w-full px-4 py-3 pl-11 rounded-lg border border-outline/20 focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all"
                  />
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" />
                </div>
                {errors.firstName && <p className="mt-1 text-xs text-error">{errors.firstName.message}</p>}
              </div>

              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-on-surface mb-2">Last Name</label>
                <input
                  {...register('lastName', { required: 'Required' })}
                  className="w-full px-4 py-3 rounded-lg border border-outline/20 focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all"
                />
                {errors.lastName && <p className="mt-1 text-xs text-error">{errors.lastName.message}</p>}
              </div>

              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-on-surface mb-2">Email (Disabled)</label>
                <div className="relative">
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-4 py-3 pl-11 rounded-lg border border-outline/10 bg-surface-variant/30 text-on-surface-variant/60 cursor-not-allowed italic"
                  />
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-outline/40" />
                </div>
              </div>

              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-on-surface mb-2">Phone Number</label>
                <div className="relative">
                  <input
                    {...register('phoneNumber')}
                    className="w-full px-4 py-3 pl-11 rounded-lg border border-outline/20 focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all"
                  />
                  <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" />
                </div>
              </div>

              <div className="md:col-span-2 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 bg-primary-container text-on-primary py-3 rounded-lg font-semibold text-md hover:brightness-110 active:opacity-80 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                  <Save size={18} />
                </button>
              </div>
            </form>
          </div>

          {/* Password Update Card */}
          <div className="bg-card rounded-xl border border-outline-variant p-stack-lg shadow-[0px_8px_24px_rgba(0,0,0,0.08)]">
            <div className="mb-stack-lg">
              <h3 className="text-2xl font-semibold text-on-surface mb-2">Change Password</h3>
              <p className="text-body-md text-on-surface-variant">Keep your account secure.</p>
            </div>

            {passwordSuccess && (
              <div className="mb-6 p-4 bg-primary-container/10 text-primary-container rounded-lg text-sm flex items-center gap-3">
                <BadgeCheck size={20} />
                {passwordSuccess}
              </div>
            )}
            {passwordError && (
              <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-lg text-sm flex items-center gap-3">
                <ShieldCheck size={20} />
                {passwordError}
              </div>
            )}

            <form className="grid grid-cols-1 md:grid-cols-2 gap-x-gutter gap-y-stack-sm" onSubmit={handlePasswordSubmit(onChangePassword)}>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-on-surface mb-2">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    {...registerPassword('oldPassword', { required: 'Required' })}
                    className="w-full px-4 py-3 pl-11 rounded-lg border border-outline/20 focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all"
                    placeholder="••••••••"
                  />
                  <ShieldCheck size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" />
                  <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface">
                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {passwordFormErrors.oldPassword && <p className="mt-1 text-xs text-error">{passwordFormErrors.oldPassword.message}</p>}
              </div>

              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-on-surface mb-2">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    {...registerPassword('newPassword', { required: 'Required', minLength: { value: 6, message: 'Min 6 chars' } })}
                    className="w-full px-4 py-3 pl-11 rounded-lg border border-outline/20 focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all"
                    placeholder="••••••••"
                  />
                  <ShieldCheck size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" />
                  <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface">
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {passwordFormErrors.newPassword && <p className="mt-1 text-xs text-error">{passwordFormErrors.newPassword.message}</p>}
              </div>

              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-on-surface mb-2">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...registerPassword('confirmPassword', { 
                      required: 'Required', 
                      validate: val => val === newPasswordValue || 'Passwords must match' 
                    })}
                    className="w-full px-4 py-3 pl-11 rounded-lg border border-outline/20 focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all"
                    placeholder="••••••••"
                  />
                  <ShieldCheck size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface">
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {passwordFormErrors.confirmPassword && <p className="mt-1 text-xs text-error">{passwordFormErrors.confirmPassword.message}</p>}
              </div>

              <div className="md:col-span-2 pt-4">
                <button
                  type="submit"
                  disabled={isPasswordSubmitting}
                  className="w-full sm:w-auto px-8 bg-error text-white py-3 rounded-lg font-semibold text-md hover:brightness-110 active:opacity-80 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isPasswordSubmitting ? 'Updating...' : 'Update Password'}
                  <ShieldCheck size={18} />
                </button>
              </div>
            </form>
          </div>

          {/* AI Tutor (Students) — server-managed Gemini key */}
          {user?.role === 'student' && (
            <div className="bg-card rounded-xl border border-outline-variant p-stack-lg shadow-[0px_8px_24px_rgba(0,0,0,0.08)]">
              <div className="mb-stack-lg flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-semibold text-on-surface mb-2">AI Tutor</h3>
                  <p className="text-body-md text-on-surface-variant">
                    The AI tutor uses a shared Google Gemini connection managed by the platform. You do not need to add or store your own API key.
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary-container/5 rounded-xl flex items-center justify-center text-primary-container border border-primary-container/10 shrink-0">
                  <Bot size={24} />
                </div>
              </div>

              <div className="p-4 bg-surface rounded-xl border border-outline/10">
                <p className="text-sm font-semibold text-on-surface">
                  Status:{' '}
                  {aiSettings?.aiTutorEnabled ? (
                    <span className="text-primary-container">Available (platform Gemini)</span>
                  ) : (
                    <span className="text-on-surface-variant">Unavailable — server API key not configured</span>
                  )}
                </p>
                <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                  If AI responses fail, ask your administrator to set <code className="font-mono text-[11px] bg-white px-1 rounded">GEMINI_API_KEY</code> on the backend.
                </p>
              </div>
            </div>
          )}

          {/* Academic Stream (Students Only) */}
          {user?.role === 'student' && (
            <div className="bg-card rounded-xl border border-outline-variant p-stack-lg shadow-[0px_8px_24px_rgba(0,0,0,0.08)]">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                  <h3 className="text-2xl font-semibold text-on-surface mb-2">Academic Stream</h3>
                  <p className="text-body-md text-on-surface-variant mb-1">Your current registered area of focus:</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className={`w-2 h-2 rounded-full ${user?.stream === 'Natural' ? 'bg-primary-container' : 'bg-emerald-500'}`}></div>
                    <span className="text-lg font-bold text-on-surface">{user?.stream || 'Unspecified'} Science</span>
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={() => window.location.href = `mailto:support@entranceexamprep.com?subject=Stream Change Request - ${user?.firstName} ${user?.lastName}`}
                  className="px-6 py-3 bg-card border-2 border-outline-variant rounded-xl text-on-surface font-bold text-sm hover:border-primary-container hover:text-primary-container transition-all flex items-center gap-3 group"
                >
                  <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
                  Request Stream Change
                </button>
              </div>
              
              <div className="mt-8 p-4 bg-surface-variant/30 rounded-lg border border-outline/5">
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  <strong>Note:</strong> Academic streams are locked once registered to ensure curriculum consistency. If you believe your stream was assigned incorrectly, please submit a formal request using the button above.
                </p>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default Profile;
