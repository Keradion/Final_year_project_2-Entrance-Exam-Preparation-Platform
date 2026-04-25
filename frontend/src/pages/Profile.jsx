import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { 
  Save, User, ArrowLeft, Eye, EyeOff, FlaskConical, Globe, ShieldCheck, Mail, Phone, 
  Calendar, Activity, BadgeCheck, Edit2, GraduationCap, Layout, LogOut, BookOpen, CircleUserRound, ArrowRight
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import {
  updateProfile as updateProfileRequest,
  changePassword as changePasswordRequest,
} from '../services/auth';

const Profile = () => {
  const { user, setUser, logout } = useContext(AuthContext);
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
          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded text-on-surface-variant hover:bg-surface transition-all font-medium">
            <Layout size={20} />
            Dashboard
          </Link>
          <Link to="/profile" className="flex items-center gap-3 px-4 py-3 rounded bg-primary-container text-on-primary transition-all font-medium">
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
             <h2 className="text-lg font-bold text-on-surface">Identity Management</h2>
             <p className="text-xs text-on-surface-variant uppercase tracking-widest font-black">Expert Mentor Profile</p>
           </div>
           
           <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
               <p className="text-sm font-bold">{user?.firstName || 'Alex'}</p>
               <p className="text-[10px] text-on-surface-variant uppercase font-bold">{user?.role} Access Granted</p>
             </div>
             <div className="w-10 h-10 rounded-full border border-outline/20 overflow-hidden">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-surface-variant flex items-center justify-center text-on-surface-variant">
                    <CircleUserRound size={24} />
                  </div>
                )}
             </div>
           </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-grow p-gutter overflow-y-auto bg-surface/50">
          <div className="max-w-[1280px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
              {/* LEFT: Identity Badge */}
              <div className="lg:col-span-4 space-y-stack-md">
                <div className="bg-primary-container rounded-lg p-stack-lg text-center relative overflow-hidden shadow-lg text-on-primary">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-[60px] -mr-16 -mt-16"></div>
                  
                  <div className="relative">
                    <div className="w-40 h-40 mx-auto rounded-lg border-4 border-white/10 overflow-hidden mb-8 bg-white/5 flex items-center justify-center p-1 relative group cursor-pointer shadow-xl">
                      {user?.profileImage ? (
                        <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover rounded-md" />
                      ) : (
                        <User className="w-24 h-24 text-white/10" />
                      )}
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                        <Edit2 className="text-white w-10 h-10" />
                      </div>
                    </div>
                    <h3 className="text-3xl font-bold tracking-tight mb-1">{user?.firstName} {user?.lastName}</h3>
                    <p className="text-white/60 text-sm mb-8">{user?.email}</p>
                    
                    <div className="inline-flex items-center px-6 py-2 rounded-lg bg-white/10 text-white text-[11px] font-black uppercase tracking-[0.2em] border border-white/10 mb-10">
                      {user?.role || 'Student'} Access
                    </div>

                    <div className="space-y-4 text-left">
                      <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg border border-white/5">
                        <div className="flex items-center gap-3">
                          <Activity size={14} className="text-white/60" />
                          <span className="text-white/60 text-xs font-bold uppercase tracking-widest">Status</span>
                        </div>
                        <span className="px-3 py-1 rounded bg-white/20 text-[10px] font-black uppercase tracking-widest">Operational</span>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg border border-white/5">
                        <div className="flex items-center gap-3">
                          <Calendar size={14} className="text-white/60" />
                          <span className="text-white/60 text-xs font-bold uppercase tracking-widest">Member Since</span>
                        </div>
                        <span className="text-white font-bold text-xs tracking-tight">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Student Stream Module (Conditional) */}
                {user?.role === 'student' && (
                  <div className="bg-white rounded-lg p-stack-md border border-outline/10 shadow-sm">
                    <label className="block text-[11px] font-black text-on-surface-variant uppercase tracking-widest mb-6">Academic Specialization</label>
                    <div className="flex flex-col gap-4">
                      {['Natural', 'Social'].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => {
                            const payload = new FormData();
                            payload.append('stream', s);
                            updateProfileRequest(payload).then(res => {
                              setUser(res.data || res);
                              setSuccessMessage('Academic stream updated.');
                            });
                          }}
                          className={`group p-6 rounded-lg border transition-all text-left relative overflow-hidden ${user?.stream === s ? 'border-primary-container bg-primary-container/5' : 'border-outline/10 bg-surface/30 hover:border-primary-container'}`}
                        >
                          <div className="relative z-10">
                            <p className="font-bold text-xl leading-none mb-1">{s} Sciences</p>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Program of Study</p>
                          </div>
                          <div className={`absolute right-[-10px] bottom-[-10px] opacity-[0.05] transition-transform group-hover:scale-110 ${user?.stream === s ? 'scale-110 opacity-10 text-primary-container' : 'grayscale'}`}>
                            {s === 'Natural' ? <FlaskConical size={90} /> : <Globe size={90} />}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT: Configuration Terminals */}
              <div className="lg:col-span-8 space-y-stack-md">
                {/* Profile Configuration Terminal */}
                <form className="bg-white rounded-lg border border-outline/10 p-stack-lg shadow-sm" onSubmit={handleSubmit(onSubmit)}>
                  <div className="flex items-center justify-between mb-8 border-b border-outline/5 pb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-on-surface tracking-tight">Identity Configuration</h2>
                      <p className="text-on-surface-variant text-sm">Update your institutional contact points and identification assets.</p>
                    </div>
                    <div className="w-12 h-12 bg-surface-variant rounded-lg flex items-center justify-center text-primary-container">
                       <User size={24} />
                    </div>
                  </div>

                  {successMessage && <div className="mb-6 p-4 bg-primary-container/10 text-primary-container rounded-lg text-sm font-bold flex items-center gap-3 animate-in slide-in-from-top-2"><CheckCircle size={20} />{successMessage}</div>}
                  {serverError && <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-lg text-sm font-bold flex items-center gap-3 animate-in slide-in-from-top-2"><ShieldCheck size={20} />{serverError}</div>}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-on-surface">First Name</label>
                      <input
                        type="text"
                        {...register('firstName', { required: 'First name is required' })}
                        className="w-full bg-surface border border-outline/10 px-4 py-3 rounded-lg text-sm font-bold focus:border-primary-container outline-none transition-all"
                      />
                      {errors.firstName && <p className="text-error text-xs font-bold mt-1">{errors.firstName.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-on-surface">Last Name</label>
                      <input
                        type="text"
                        {...register('lastName', { required: 'Last name is required' })}
                        className="w-full bg-surface border border-outline/10 px-4 py-3 rounded-lg text-sm font-bold focus:border-primary-container outline-none transition-all"
                      />
                      {errors.lastName && <p className="text-error text-xs font-bold mt-1">{errors.lastName.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-on-surface">Email Terminal</label>
                      <div className="relative">
                        <input
                          type="email"
                          value={user?.email || ''}
                          disabled
                          className="w-full bg-surface-variant/50 border border-outline/10 px-4 py-3 pl-11 rounded-lg text-sm font-bold text-on-surface-variant cursor-not-allowed"
                        />
                        <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-on-surface">Phone Connectivity</label>
                      <div className="relative">
                        <input
                          type="text"
                          {...register('phoneNumber')}
                          placeholder="Institutional line (optional)"
                          className="w-full bg-surface border border-outline/10 px-4 py-3 pl-11 rounded-lg text-sm font-bold focus:border-primary-container outline-none transition-all"
                        />
                        <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" />
                      </div>
                    </div>
                  </div>

                  <div className="mb-10">
                    <label className="block text-sm font-bold text-on-surface mb-3">Identification Portrait</label>
                    <div className="group relative bg-surface border-2 border-outline/10 border-dashed rounded-lg p-8 text-center transition-all hover:border-primary-container hover:bg-white">
                      <input
                        type="file"
                        accept="image/*"
                        {...register('profileImageFile')}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                      />
                      <div className="flex flex-col items-center gap-2 text-outline group-hover:text-primary-container transition-colors">
                         <Save size={32} />
                         <span className="font-bold text-sm">Synchronize new portrait asset</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-6 border-t border-outline/5">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-primary-container text-on-primary px-10 py-3 rounded-lg font-bold text-sm uppercase tracking-widest hover:brightness-110 active:opacity-80 transition-all flex items-center gap-2"
                    >
                      {isSubmitting ? 'Synchronizing...' : 'Save Configuration'}
                      <Save size={18} />
                    </button>
                  </div>
                </form>

                {/* Security Protocol Terminal */}
                <form className="bg-white rounded-lg border border-outline/10 p-stack-lg shadow-sm" onSubmit={handlePasswordSubmit(onChangePassword)}>
                  <div className="flex items-center justify-between mb-8 border-b border-outline/5 pb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-on-surface tracking-tight">Security Protocols</h2>
                      <p className="text-on-surface-variant text-sm">Update your high-entropy passcodes to maintain institutional integrity.</p>
                    </div>
                    <div className="w-12 h-12 bg-surface-variant rounded-lg flex items-center justify-center text-primary-container">
                       <ShieldCheck size={24} />
                    </div>
                  </div>

                  {passwordSuccess && <div className="mb-6 p-4 bg-primary-container/10 text-primary-container rounded-lg text-sm font-bold flex items-center gap-3 animate-in slide-in-from-top-2"><CheckCircle size={20} />{passwordSuccess}</div>}
                  {passwordError && <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-lg text-sm font-bold flex items-center gap-3 animate-in slide-in-from-top-2"><ShieldCheck size={20} />{passwordError}</div>}

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-on-surface">Current Passcode</label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          {...registerPassword('oldPassword', { required: 'Current password is required' })}
                          className="w-full bg-surface border border-outline/10 px-4 py-3 pr-12 rounded-lg text-sm font-bold focus:border-primary-container outline-none transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                        >
                          {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {passwordFormErrors.oldPassword && <p className="text-error text-xs font-bold mt-1">{passwordFormErrors.oldPassword.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-on-surface">New Protocol</label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            {...registerPassword('newPassword', { 
                              required: 'New password is required',
                              minLength: { value: 6, message: 'At least 6 characters' }
                            })}
                            className="w-full bg-surface border border-outline/10 px-4 py-3 pr-12 rounded-lg text-sm font-bold focus:border-primary-container outline-none transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                          >
                            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                        {passwordFormErrors.newPassword && <p className="text-error text-xs font-bold mt-1">{passwordFormErrors.newPassword.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-on-surface">Confirm Protocol</label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            {...registerPassword('confirmPassword', { 
                              required: 'Please confirm password',
                              validate: value => value === newPasswordValue || 'Passwords do not match'
                            })}
                            className="w-full bg-surface border border-outline/10 px-4 py-3 pr-12 rounded-lg text-sm font-bold focus:border-primary-container outline-none transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                        {passwordFormErrors.confirmPassword && <p className="text-error text-xs font-bold mt-1">{passwordFormErrors.confirmPassword.message}</p>}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-10 pt-6 border-t border-outline/5">
                    <button
                      type="submit"
                      disabled={isPasswordSubmitting}
                      className="bg-primary-container text-on-primary px-10 py-3 rounded-lg font-bold text-sm uppercase tracking-widest hover:brightness-110 active:opacity-80 transition-all flex items-center gap-2"
                    >
                      {isPasswordSubmitting ? 'Updating...' : 'Update Protocol'}
                      <ShieldCheck size={18} />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
