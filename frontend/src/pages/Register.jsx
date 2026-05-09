import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { registerUser, verifyEmail } from '../services/auth';
import { AuthContext } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';
import { Eye, EyeOff, ShieldCheck, Mail, Lock, Phone, User, ArrowRight, ArrowLeft, BookOpen, CheckCircle, FlaskConical, Globe } from 'lucide-react';

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
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    setError: setFormError,
    clearErrors,
    trigger,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      role: 'student',
      firstName: '',
      lastName: '',
      email: '',
      confirmEmail: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      stream: ''
    }
  });

  const [step, setStep] = useState(1);
  const [registrationData, setRegistrationData] = useState(null);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);

  const password = watch('password');
  const email = watch('email');

  const onBasicInfoSubmit = async (data) => {
    const isValid = await trigger(['firstName', 'lastName', 'email', 'confirmEmail', 'password', 'confirmPassword', 'phoneNumber']);
    if (isValid) {
      setRegistrationData(data);
      setStep(2);
    }
  };

  const onAcademicSubmit = (data) => {
    onSubmit({ ...registrationData, ...data });
  };

  const onSubmit = async (data) => {
    try {
      setError(null);
      clearErrors();
      const formData = new FormData();
      formData.append('firstName', data.firstName);
      formData.append('lastName', data.lastName);
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('role', 'student');
      if (data.stream) formData.append('stream', data.stream);

      if (data.phoneNumber?.trim()) {
        formData.append('phoneNumber', data.phoneNumber.trim());
      }

      if (data.profileImageFile?.[0]) {
        formData.append('profileImageFile', data.profileImageFile[0]);
      }

      const response = await registerUser(formData);
      setVerificationEmail(data.email);
      setStep(3);
    } catch (err) {
      const serverErrors = err?.response?.data?.errors;
      if (Array.isArray(serverErrors) && serverErrors.length > 0) {
        serverErrors.forEach((item) => {
          const field = item.path || item.param;
          if (!field || !(field in FIELD_NAME_MAP)) return;
          setFormError(field, { type: 'server', message: item.msg });
        });
        setError(serverErrors[0]?.msg || 'Validation failed.');
        setStep(1);
        return;
      }
      setError(err?.response?.data?.message || 'Registration failed.');
      setStep(1);
    }
  };

  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col font-sans overflow-x-hidden">
      <main className="flex-grow flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 w-full min-w-0 max-w-[100vw] overflow-x-hidden box-border">
        {step === 1 ? (
          /* Step 1: Account Information */
          <div className="w-full max-w-[800px] animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Form Panel */}
            <div className="bg-card rounded-xl border border-outline-variant p-4 sm:p-stack-lg shadow-[0px_8px_24px_rgba(0,0,0,0.08)] min-w-0">
              <div className="mb-stack-lg flex justify-between items-end">
                <div>
                  <h3 className="text-2xl font-semibold text-on-surface mb-2">Create Account</h3>
                  <p className="text-body-md text-on-surface-variant">Step 1: Your Details</p>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-black text-primary-container uppercase tracking-widest">Progress</p>
                  <div className="flex gap-1 mt-1">
                    <div className="w-8 h-1.5 rounded-full bg-primary-container"></div>
                    <div className="w-8 h-1.5 rounded-full bg-outline/20"></div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-lg text-sm flex items-center gap-3">
                  <ShieldCheck size={20} />
                  {error}
                </div>
              )}

              <form className="grid grid-cols-1 md:grid-cols-2 gap-x-gutter gap-y-stack-sm" onSubmit={handleSubmit(onBasicInfoSubmit)}>
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-on-surface mb-2" htmlFor="firstName">First Name</label>
                  <div className="relative">
                    <input
                      id="firstName"
                      {...register('firstName', { required: 'Required' })}
                      className="w-full px-4 py-3 pl-11 rounded-lg border border-outline/20 focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all"
                      placeholder="John"
                    />
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" />
                  </div>
                  {errors.firstName && <p className="mt-1 text-xs text-error">{errors.firstName.message}</p>}
                </div>

                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-on-surface mb-2" htmlFor="lastName">Last Name</label>
                  <input
                    id="lastName"
                    {...register('lastName', { required: 'Required' })}
                    className="w-full px-4 py-3 rounded-lg border border-outline/20 focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all"
                    placeholder="Doe"
                  />
                  {errors.lastName && <p className="mt-1 text-xs text-error">{errors.lastName.message}</p>}
                </div>

                <div className="md:col-span-1">
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

                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-on-surface mb-2" htmlFor="confirmEmail">Confirm Email</label>
                  <input
                    id="confirmEmail"
                    type="email"
                    {...register('confirmEmail', { 
                      required: 'Required',
                      validate: val => val === email || 'Emails must match'
                    })}
                    className="w-full px-4 py-3 rounded-lg border border-outline/20 focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all"
                    placeholder="you@example.com"
                  />
                  {errors.confirmEmail && <p className="mt-1 text-xs text-error">{errors.confirmEmail.message}</p>}
                </div>

                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-on-surface mb-2" htmlFor="password">Password</label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      {...register('password', { required: 'Password required', minLength: { value: 6, message: 'Min 6 chars' } })}
                      className="w-full px-4 py-3 pl-11 rounded-lg border border-outline/20 focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all"
                      placeholder="••••••••"
                    />
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-outline">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-xs text-error">{errors.password.message}</p>}
                </div>

                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-on-surface mb-2" htmlFor="confirmPassword">Confirm Password</label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      {...register('confirmPassword', { 
                        required: 'Required',
                        validate: val => val === password || 'Passwords must match'
                      })}
                      className="w-full px-4 py-3 pl-11 rounded-lg border border-outline/20 focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all"
                      placeholder="••••••••"
                    />
                    <ShieldCheck size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-outline">
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="mt-1 text-xs text-error">{errors.confirmPassword.message}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-on-surface mb-2" htmlFor="phoneNumber">Phone Number</label>
                  <div className="relative">
                    <input
                      id="phoneNumber"
                      {...register('phoneNumber', { required: 'Required' })}
                      className="w-full px-4 py-3 pl-11 rounded-lg border border-outline/20 focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all"
                      placeholder="+251 9XX XXX XXXX"
                    />
                    <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" />
                  </div>
                  {errors.phoneNumber && <p className="mt-1 text-xs text-error">{errors.phoneNumber.message}</p>}
                </div>

                <div className="md:col-span-2 pt-4">
                  <button
                    type="submit"
                    className="w-full bg-primary-container text-on-primary py-4 px-6 rounded-lg font-semibold text-lg hover:brightness-110 transition-all flex items-center justify-center gap-2"
                  >
                    Continue to Stream Selection
                    <ArrowRight size={20} />
                  </button>
                </div>
              </form>

              <div className="mt-stack-lg text-center">
                <p className="text-sm text-on-surface-variant">
                  Already registered? 
                  <Link to="/login" className="text-primary-container font-semibold hover:underline ml-1">Sign In</Link>
                </p>
              </div>
            </div>
          </div>
        ) : step === 2 ? (
          /* Step 2: Stream Selection ... (kept existing code) */
          <div className="w-full min-w-0 max-w-[900px] animate-in fade-in slide-in-from-bottom-4 duration-500 px-0">
            <div className="text-center mb-8 sm:mb-12 px-1">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-container/10 text-primary-container rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
                  Step 02: Stream Selection
               </div>
               <h2 className="text-2xl sm:text-4xl font-bold text-on-surface mb-3">Select your stream</h2>
            </div>

            <div className="bg-card rounded-2xl border border-outline-variant p-5 sm:p-10 shadow-xl mb-8 sm:mb-12 w-full min-w-0">
               <div className="max-w-xl mx-auto min-w-0">
                  <div className="space-y-6">
                     <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 bg-primary-container/10 rounded-lg flex items-center justify-center text-primary-container">
                           <BookOpen size={20} />
                        </div>
                        <h4 className="text-lg font-bold">Academic Stream</h4>
                     </div>
                     <div className="space-y-4">
                        {['Natural', 'Social'].map(s => (
                           <label key={s} className="relative group cursor-pointer block">
                              <input 
                                 type="radio" 
                                 name="stream" 
                                 value={s} 
                                 className="peer hidden" 
                                 {...register('stream', { required: 'Please select a stream' })} 
                              />
                              <div className="p-4 border-2 border-outline-variant rounded-xl flex items-center justify-between font-bold text-on-surface peer-checked:border-primary-container peer-checked:bg-primary-container/5 peer-checked:text-primary-container transition-all group-hover:border-outline">
                                 <div className="flex items-center gap-4">
                                    {s === 'Natural' ? <FlaskConical size={20} /> : <Globe size={20} />}
                                    <span>{s} Sciences</span>
                                 </div>
                                 <CheckCircle size={20} className="opacity-0 peer-checked:opacity-100 transition-opacity" />
                              </div>
                           </label>
                        ))}
                        {errors.stream && <p className="text-xs text-error font-medium">{errors.stream.message}</p>}
                     </div>
                  </div>
               </div>

               <div className="mt-8 sm:mt-12 pt-6 sm:pt-10 border-t border-outline/10 flex flex-col-reverse gap-4 sm:flex-row sm:justify-between sm:items-center">
                  <button type="button" onClick={() => setStep(1)} className="text-on-surface-variant hover:text-on-surface font-semibold flex items-center justify-center sm:justify-start gap-2 transition-colors py-2">
                     <ArrowLeft size={18} /> Back
                  </button>
                  <button 
                     type="button"
                     onClick={handleSubmit(onAcademicSubmit)}
                     className="w-full sm:w-auto justify-center bg-primary-container text-on-primary px-6 sm:px-12 py-4 rounded-xl font-bold text-base sm:text-lg hover:brightness-110 active:scale-95 transition-all flex items-center gap-3 shadow-lg shadow-primary-container/20"
                  >
                     Complete Registration
                     <ArrowRight size={20} />
                  </button>
               </div>
            </div>
          </div>
        ) : (
          /* Step 3: Verification */
          <div className="w-full min-w-0 mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 px-1 max-w-md">
            <div className="bg-card rounded-2xl border border-outline-variant p-3 sm:p-stack-lg shadow-xl text-center min-w-0 overflow-hidden">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary-container/10 rounded-full flex items-center justify-center text-primary-container mx-auto mb-6 sm:mb-8">
                <ShieldCheck className="w-9 h-9 sm:w-10 sm:h-10" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-on-surface mb-3 px-1">Verify Your Identity</h2>
              <p className="text-on-surface-variant mb-6 sm:mb-8 text-sm sm:text-base px-1 break-words">
                We've sent a 6-digit verification code to{' '}
                <span className="font-bold text-on-surface break-all">{verificationEmail}</span>. Please enter it below to activate your account.
              </p>

              {error && (
                <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-lg text-sm flex items-center gap-3 text-left">
                  <ShieldCheck size={20} />
                  {error}
                </div>
              )}

              <div className="grid grid-cols-6 gap-1 sm:gap-2 w-full max-w-[16.5rem] sm:max-w-xs mx-auto mb-6 sm:mb-8 px-0.5">
                {verificationCode.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-${index}`}
                    inputMode="numeric"
                    autoComplete={index === 0 ? 'one-time-code' : 'off'}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^\d?$/.test(val)) {
                        const newCode = [...verificationCode];
                        newCode[index] = val;
                        setVerificationCode(newCode);
                        if (val && index < 5) {
                          document.getElementById(`code-${index + 1}`)?.focus();
                        }
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
                        document.getElementById(`code-${index - 1}`)?.focus();
                      }
                    }}
                    className="min-w-0 w-full h-10 sm:h-14 text-center text-base sm:text-2xl font-bold border-2 border-outline-variant rounded-md sm:rounded-lg focus:border-primary-container outline-none transition-all tabular-nums"
                  />
                ))}
              </div>

              <button
                disabled={isVerifying || verificationCode.some(d => !d)}
                onClick={async () => {
                  try {
                    setIsVerifying(true);
                    setError(null);
                    const code = verificationCode.join('');
                    const response = await verifyEmail({ email: verificationEmail, code });
                    
                    if (response && response.data && response.data.token) {
                      const { user, token } = response.data;
                      login(token, user);
                      navigate('/dashboard');
                    } else {
                      navigate('/login', { state: { message: 'Registration completed. Please sign in.' } });
                    }
                  } catch (err) {
                    setError(err.response?.data?.message || 'Verification failed. Please check the code.');
                  } finally {
                    setIsVerifying(false);
                  }
                }}
                className="w-full bg-primary-container text-on-primary py-4 rounded-lg font-bold text-lg hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all mb-6"
              >
                {isVerifying ? 'Verifying...' : 'Validate Code'}
              </button>

              <button 
                onClick={() => setStep(1)}
                className="text-sm font-semibold text-primary-container hover:underline"
              >
                Back to Registration
              </button>
            </div>
          </div>
        )}

      </main>


    </div>
  );
};

export default Register;