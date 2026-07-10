import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const auth = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await auth.signup({ name, email, password });
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white">
      <div className="bg-slate-900/60 backdrop-blur rounded-lg p-8 w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Create an account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="flex">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="ml-2 px-2 py-2 text-sm text-indigo-200"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          {error && <div className="text-red-400 text-sm">{error}</div>}
          <div className="flex items-center justify-between">
            <button type="submit" disabled={loading} className="bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded font-semibold">
              {loading ? 'Creating…' : 'Sign up'}
            </button>
            <button type="button" onClick={() => navigate('/login')} className="text-sm text-indigo-200 underline">Already have an account?</button>
          </div>
        </form>
      </div>
    </div>
  );
}
