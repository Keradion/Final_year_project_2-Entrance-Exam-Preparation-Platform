import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { registerUser, verifyEmail } from '../services/auth';
import { AuthContext } from '../context/AuthContext';
import { Eye, EyeOff, GraduationCap, ShieldCheck, Mail, Lock, Phone, User, ArrowRight, ArrowLeft, BookOpen, CheckCircle, FlaskConical, Globe } from 'lucide-react';

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
      phoneNumber: ''
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

  const onStreamSelect = (stream) => {
    onSubmit({ ...registrationData, stream });
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
    <div className="bg-background text-on-surface min-h-screen flex flex-col font-sans">
      <main className="flex-grow flex items-center justify-center py-12 px-6">
        {step === 1 ? (
          /* Step 1: Account Information */
          <div className="w-full max-w-[800px] animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Form Panel */}
            <div className="bg-white rounded-xl border border-outline-variant p-stack-lg shadow-[0px_8px_24px_rgba(0,0,0,0.08)]">
              <div className="mb-stack-lg flex justify-between items-end">
                <div>
                  <h3 className="text-2xl font-semibold text-on-surface mb-2">Create Account</h3>
                  <p className="text-body-md text-on-surface-variant">Step 1: Your Details</p>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-black text-primary-container uppercase tracking-widest">Progress</p>
                  <div className="flex gap-1 mt-1">
                    <div className="w-8 h-1.5 rounded-full bg-primary-container"></div>
                    <div className="w-8 h-1.5 rounded-full bg-slate-100"></div>
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
          <div className="w-full max-w-[900px]">
            {/* ... contents of step 2 ... */}
            <div className="text-center mb-12">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-container/10 text-primary-container rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
                  Step 02: Stream Selection
               </div>
               <h2 className="text-4xl font-bold text-on-surface mb-3">Select Your Academic Stream</h2>
               <p className="text-on-surface-variant">Choose your primary area of focus for customized learning paths.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Natural Science */}
              <button 
                onClick={() => onStreamSelect('Natural')}
                className="group p-stack-lg bg-white border-2 border-outline-variant rounded-xl text-left hover:border-primary-container hover:shadow-xl transition-all relative overflow-hidden"
              >
                <div className="w-14 h-14 bg-primary-container/10 rounded-lg flex items-center justify-center text-primary-container mb-6 group-hover:bg-primary-container group-hover:text-white transition-colors">
                  <FlaskConical size={32} />
                </div>
                <h3 className="text-2xl font-bold text-on-surface mb-2">Natural Science</h3>
                <p className="text-on-surface-variant mb-6">Mathematics, Physics, Biology, and Chemistry. Focused on logical reasoning and experimental discovery.</p>
                <div className="flex items-center gap-2 text-primary-container font-semibold text-sm">
                  Select Stream <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Social Science */}
              <button 
                onClick={() => onStreamSelect('Social')}
                className="group p-stack-lg bg-white border-2 border-outline-variant rounded-xl text-left hover:border-primary-container hover:shadow-xl transition-all relative overflow-hidden"
              >
                <div className="w-14 h-14 bg-primary-container/10 rounded-lg flex items-center justify-center text-primary-container mb-6 group-hover:bg-primary-container group-hover:text-white transition-colors">
                  <Globe size={32} />
                </div>
                <h3 className="text-2xl font-bold text-on-surface mb-2">Social Science</h3>
                <p className="text-on-surface-variant mb-6">Economics, Business Mathematics, and Geography. Focused on human behavior and societal structures.</p>
                <div className="flex items-center gap-2 text-primary-container font-semibold text-sm">
                  Select Stream <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>

            <div className="mt-12 text-center">
              <button onClick={() => setStep(1)} className="text-on-surface-variant hover:text-on-surface font-semibold flex items-center gap-2 mx-auto transition-colors">
                <ArrowLeft size={18} /> Back to Account Details
              </button>
            </div>
          </div>
        ) : (
          /* Step 3: Verification */
          <div className="w-full max-w-[500px] animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-2xl border border-outline-variant p-stack-lg shadow-xl text-center">
              <div className="w-20 h-20 bg-primary-container/10 rounded-full flex items-center justify-center text-primary-container mx-auto mb-8">
                <ShieldCheck size={40} />
              </div>
              <h2 className="text-3xl font-bold text-on-surface mb-3">Verify Your Identity</h2>
              <p className="text-on-surface-variant mb-8">
                We've sent a 6-digit verification code to <span className="font-bold text-on-surface">{verificationEmail}</span>. Please enter it below to activate your account.
              </p>

              {error && (
                <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-lg text-sm flex items-center gap-3 text-left">
                  <ShieldCheck size={20} />
                  {error}
                </div>
              )}

              <div className="flex justify-between gap-2 mb-8">
                {verificationCode.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-${index}`}
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
                          document.getElementById(`code-${index + 1}`).focus();
                        }
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
                        document.getElementById(`code-${index - 1}`).focus();
                      }
                    }}
                    className="w-12 h-14 text-center text-2xl font-bold border-2 border-outline-variant rounded-lg focus:border-primary-container outline-none transition-all"
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
                      login(response.data.token, response.data.user);
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