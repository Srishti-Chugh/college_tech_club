import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Terminal, Mail, Lock, User, ArrowLeft, Shield, CheckCircle, AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  onAuthStateChanged,
  type User as FirebaseUser,
} from '../firebase';

type AuthMode = 'login' | 'signup' | 'verify-otp';

const IGDTUW_DOMAIN = '@igdtuw.ac.in';

function validateIGDTUWEmail(email: string): string | null {
  if (!email) return 'Email is required';
  if (!email.endsWith(IGDTUW_DOMAIN)) return `Only ${IGDTUW_DOMAIN} emails are allowed`;
  const localPart = email.replace(IGDTUW_DOMAIN, '');
  if (!localPart || localPart.length < 2) return 'Enter a valid IGDTUW email';
  if (!/^[a-zA-Z0-9._-]+$/.test(localPart)) return 'Email contains invalid characters';
  return null;
}

/** Allows redirect after login to same-origin paths only (e.g. /discord). */
function safeInternalPath(from: unknown): string | null {
  if (typeof from !== 'string' || !from.startsWith('/')) return null;
  if (from.startsWith('//')) return null;
  return from;
}

function validatePassword(password: string): string | null {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(password)) return 'Must include an uppercase letter';
  if (!/[0-9]/.test(password)) return 'Must include a number';
  return null;
}

const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [branch, setBranch] = useState('');
  const [year, setYear] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationChecking, setVerificationChecking] = useState(false);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const postAuthPath =
    safeInternalPath((location.state as { from?: string } | null)?.from) ?? '/';
  const checkIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user?.emailVerified) {
        if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
        navigate(postAuthPath);
      }
    });
    return () => {
      unsub();
      if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
    };
  }, [navigate, postAuthPath]);

  const startVerificationPolling = () => {
    if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
    checkIntervalRef.current = setInterval(async () => {
      if (auth.currentUser) {
        await auth.currentUser.reload();
        if (auth.currentUser.emailVerified) {
          clearInterval(checkIntervalRef.current!);
          navigate(postAuthPath);
        }
      }
    }, 3000);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const emailErr = validateIGDTUWEmail(email);
    if (emailErr) { setError(emailErr); return; }

    const passErr = validatePassword(password);
    if (passErr) { setError(passErr); return; }

    if (password !== confirmPassword) { setError('Passwords do not match'); return; }
    if (!name.trim()) { setError('Full name is required'); return; }
    if (!branch) { setError('Please select your branch'); return; }
    if (!year) { setError('Please select your year'); return; }

    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(cred.user);
      setVerificationSent(true);
      setMode('verify-otp');
      startVerificationPolling();
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Try logging in.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address.');
      } else {
        setError(err.message || 'Signup failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) { setError('Email is required'); return; }
    if (!password) { setError('Password is required'); return; }

    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      if (!cred.user.emailVerified) {
        setError('Please verify your email first. Check your inbox.');
        setMode('verify-otp');
        setVerificationSent(true);
        startVerificationPolling();
      } else {
        navigate(postAuthPath);
      }
    } catch (err: any) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many attempts. Please try again later.');
      } else {
        setError(err.message || 'Login failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!auth.currentUser) return;
    setVerificationChecking(true);
    try {
      await sendEmailVerification(auth.currentUser);
      setError('');
    } catch {
      setError('Could not resend. Wait a minute and try again.');
    } finally {
      setVerificationChecking(false);
    }
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setError('');
  };

  // ─── Verification screen ───
  if (mode === 'verify-otp') {
    return (
      <section className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
              <Mail size={28} className="text-indigo-400" />
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tight mb-3">Check Your Inbox</h2>
            <p className="text-gray-500 font-mono text-sm leading-relaxed">
              We sent a verification link to<br />
              <span className="text-indigo-400 font-semibold">{email}</span>
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-gray-950 p-6 space-y-4">
            <div className="flex items-start gap-3 text-sm">
              <CheckCircle size={18} className="text-green-400 mt-0.5 shrink-0" />
              <p className="text-gray-400">Click the link in your email to verify your account.</p>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <Shield size={18} className="text-yellow-400 mt-0.5 shrink-0" />
              <p className="text-gray-400">
                This ensures your <span className="text-white font-medium">IGDTUW email is real</span> — 
                fake emails like "abc@igdtuw.ac.in" won't receive the link.
              </p>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <Terminal size={18} className="text-blue-400 mt-0.5 shrink-0" />
              <p className="text-gray-400">This page will automatically redirect once verified.</p>
            </div>
          </div>

          {error && (
            <div className="mt-4 flex items-center gap-2 text-red-400 text-sm font-mono bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="mt-6 flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 text-gray-500 text-xs font-mono">
              <Loader2 size={14} className="animate-spin text-indigo-400" />
              <span>waiting for verification...</span>
            </div>

            <button
              onClick={handleResendVerification}
              disabled={verificationChecking}
              className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-indigo-400 transition-colors disabled:opacity-50"
            >
              {verificationChecking ? 'Sending...' : 'Resend verification email'}
            </button>

            <button
              onClick={() => switchMode('login')}
              className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors mt-2"
            >
              <ArrowLeft size={12} />
              Back to login
            </button>
          </div>
        </div>
      </section>
    );
  }

  // ─── Login / Signup form ───
  const isLogin = mode === 'login';

  return (
    <section className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-20">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-5 py-2 mb-6">
            <Terminal size={14} className="text-green-400" />
            <span className="text-xs font-mono tracking-wider text-gray-400">
              // {isLogin ? 'login' : 'register'}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-2">
            {isLogin ? 'Welcome Back' : 'Join the Lab'}
          </h1>
          <p className="text-gray-500 font-mono text-sm">
            {isLogin
              ? 'Sign in with your IGDTUW credentials'
              : 'Register with your IGDTUW email'}
          </p>
        </div>

        {/* Form card */}
        <div className="rounded-xl border border-white/10 bg-gray-950 overflow-hidden">
          {/* Tab switcher */}
          <div className="flex border-b border-white/10">
            <button
              onClick={() => switchMode('login')}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${
                isLogin
                  ? 'text-white bg-white/5 border-b-2 border-indigo-500'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => switchMode('signup')}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${
                !isLogin
                  ? 'text-white bg-white/5 border-b-2 border-indigo-500'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form
            onSubmit={isLogin ? handleLogin : handleSignup}
            className="p-6 space-y-4"
          >
            {/* Name — signup only */}
            {!isLogin && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm font-mono text-white placeholder-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                College Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.toLowerCase())}
                  placeholder="yourname@igdtuw.ac.in"
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm font-mono text-white placeholder-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
              {!isLogin && (
                <p className="mt-1.5 text-[11px] text-gray-600 font-mono">
                  Only @igdtuw.ac.in emails accepted
                </p>
              )}
            </div>

            {/* Branch & Year — signup only */}
            {!isLogin && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                    Branch
                  </label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-3 text-sm font-mono text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-gray-900">Select</option>
                    <option value="CSE" className="bg-gray-900">CSE</option>
                    <option value="CSAI" className="bg-gray-900">CS-AI</option>
                    <option value="IT" className="bg-gray-900">IT</option>
                    <option value="ECE" className="bg-gray-900">ECE</option>
                    <option value="MAE" className="bg-gray-900">MAE</option>
                    <option value="DMAM" className="bg-gray-900">DMAM</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                    Year
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-3 text-sm font-mono text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-gray-900">Select</option>
                    <option value="1" className="bg-gray-900">1st Year</option>
                    <option value="2" className="bg-gray-900">2nd Year</option>
                    <option value="3" className="bg-gray-900">3rd Year</option>
                    <option value="4" className="bg-gray-900">4th Year</option>
                  </select>
                </div>
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isLogin ? 'Enter your password' : 'Min 8 chars, 1 uppercase, 1 number'}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-12 py-3 text-sm font-mono text-white placeholder-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password — signup only */}
            {!isLogin && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm font-mono text-white placeholder-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm font-mono bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black font-bold uppercase tracking-widest text-sm py-3 rounded-lg hover:bg-indigo-500 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {isLogin ? '$ login --now' : '$ register --now'}
            </button>

            {/* Security badge */}
            {!isLogin && (
              <div className="flex items-center justify-center gap-2 text-[11px] text-gray-600 font-mono pt-1">
                <Shield size={12} />
                <span>Verified via email — only real IGDTUW IDs work</span>
              </div>
            )}
          </form>
        </div>

        {/* Back link */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={12} />
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AuthPage;
