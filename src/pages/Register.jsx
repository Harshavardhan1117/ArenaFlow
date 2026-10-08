// ============================================================================
// REGISTER / SIGN UP PAGE - ARENAFLOW
// Clean, professional registration with Firebase Google Auth & Email/Password Auth
// ============================================================================

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register({ onSwitchToLogin, onSuccess }) {
  const { register, loginWithGoogle } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [errorCode, setErrorCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Email/Password Registration
  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setErrorCode('');

    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }

    if (!email.trim()) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setError('Please enter a password.');
      return;
    }

    if (password.length < 6) {
      setError('Password is too weak. Use a stronger password (at least 6 characters).');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const result = await register(email, password, name.trim());
    setLoading(false);

    if (result.success) {
      if (onSuccess) onSuccess();
    } else {
      // Log for debugging in browser console
      console.error('Registration failed with code:', result.code, 'message:', result.message);
      setError(result.error || 'Account creation failed. Please try again.');
      setErrorCode(result.code || '');
    }
  }

  // Google Login
  async function handleGoogleLogin() {
    setError('');
    setErrorCode('');
    setGoogleLoading(true);
    const result = await loginWithGoogle();
    setGoogleLoading(false);

    if (result.success) {
      if (onSuccess) onSuccess();
    } else {
      console.error('Google registration failed with code:', result.code);
      setError(result.error || 'Google sign-in failed. Please try again.');
      setErrorCode(result.code || '');
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white border border-slate-200 rounded-xl p-8 sm:p-10 shadow-sm space-y-7">
        
        {/* Brand Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-slate-900 text-white font-extrabold text-base mb-3 shadow-xs">
            A
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            ArenaFlow
          </h1>
          <p className="text-xs font-medium tracking-wide uppercase text-slate-400">
            Tournament Management Platform
          </p>
          <div className="pt-2">
            <h2 className="text-lg font-bold text-slate-800">
              Create an Account
            </h2>
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs leading-relaxed space-y-1">
            <p className="font-semibold">{error}</p>
            {errorCode === 'auth/operation-not-allowed' && (
              <p className="text-[11px] text-red-600 bg-red-100/70 p-2 rounded border border-red-200/80 mt-1">
                Notice: Email/Password provider must be toggled on in Firebase Console under Authentication &gt; Sign-in method.
              </p>
            )}
          </div>
        )}

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5 text-xs">
              Full Name
            </label>
            <input
              type="text"
              required
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="w-full bg-slate-50/50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:border-slate-900 focus:bg-white transition-colors"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1.5 text-xs">
              Email
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              className="w-full bg-slate-50/50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:border-slate-900 focus:bg-white transition-colors"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1.5 text-xs">
              Password
            </label>
            <input
              type="password"
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full bg-slate-50/50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:border-slate-900 focus:bg-white transition-colors"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1.5 text-xs">
              Confirm Password
            </label>
            <input
              type="password"
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat password"
              className="w-full bg-slate-50/50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:border-slate-900 focus:bg-white transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-all duration-150 disabled:opacity-50 cursor-pointer shadow-xs active:scale-[0.99] mt-2"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* OR Divider */}
        <div className="relative text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <span className="relative bg-white px-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
            OR
          </span>
        </div>

        {/* Continue with Google */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading || googleLoading}
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold text-sm transition-all duration-150 disabled:opacity-50 cursor-pointer shadow-2xs"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>{googleLoading ? 'Connecting...' : 'Continue with Google'}</span>
        </button>

        {/* Switch to Login */}
        <div className="pt-2 border-t border-slate-100 text-center text-xs text-slate-500">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-bold text-slate-900 hover:underline cursor-pointer ml-1"
          >
            Log In
          </button>
        </div>

      </div>
    </div>
  );
}
