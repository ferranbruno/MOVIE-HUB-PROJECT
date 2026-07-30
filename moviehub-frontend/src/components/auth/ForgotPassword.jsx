import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [resetToken, setResetToken] = useState('');
  const navigate = useNavigate();
  const auth = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    setResetToken('');
    setLoading(true);
    try {
      const data = await auth.forgotPassword(email);
      setMessage(data.message || 'If an account exists, a reset email was sent.');
      if (data.resetToken) {
        setResetToken(data.resetToken);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-2xl shadow-black/40">
        <div className="mb-2 text-center text-4xl">🔐</div>
        <h2 className="mb-1 text-center text-2xl font-bold text-white">Reset your password</h2>
        <p className="mb-6 text-center text-sm text-slate-400">Enter your email and we'll send you a reset link.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              placeholder="you@example.com"
            />
          </div>

          {error && <div className="text-sm text-red-400">{error}</div>}
          {message && (
            <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-200">
              {message}
              {resetToken && (
                <div className="mt-2">
                  <p className="mb-1 text-xs text-cyan-300/70">Development mode — use this link:</p>
                  <button
                    type="button"
                    onClick={() => navigate(`/reset-password?token=${resetToken}`)}
                    className="break-all text-xs text-cyan-400 underline hover:text-cyan-300"
                  >
                    {`${window.location.origin}/reset-password?token=${resetToken}`}
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between gap-4">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Sending…' : 'Send reset email'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-sm text-cyan-400 hover:text-cyan-300"
            >
              Back to login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
