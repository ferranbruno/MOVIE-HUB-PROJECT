import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const ALL_GENRES = ['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Horror', 'Animation', 'Thriller', 'Romance', 'Documentary', 'Adventure'];

export default function AuthPage({ initialMode = 'signin' }) {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('user');
  const [favoriteGenres, setFavoriteGenres] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const auth = useAuth();

  const isSignIn = mode === 'signin';

  function toggleGenre(genre) {
    setFavoriteGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isSignIn) {
        await auth.login(email, password);
      } else {
        await auth.signup({ name, email, password, role, favoriteGenres });
      }
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function switchMode() {
    setMode(isSignIn ? 'signup' : 'signin');
    setError('');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6">
      <div className={`relative w-[900px] overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl shadow-black/40 ${isSignIn ? 'h-[550px]' : 'h-[700px]'}`}>

        {/* LEFT PANEL */}
        <div className="absolute left-0 top-0 flex h-full w-[45%] flex-col items-center justify-center bg-gradient-to-br from-cyan-600 via-indigo-800 to-slate-950 p-8 text-center">
          <div className="mb-2 text-6xl">🎬</div>
          <h1 className="text-3xl font-bold text-white">MovieHub</h1>
          <p className="mt-3 max-w-xs text-sm text-cyan-200/80">
            Your ultimate cinema experience. Book tickets, pick your seats, and enjoy the latest blockbusters in stunning quality.
          </p>
          <div className="mt-8 flex gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-white/30" />
            <div className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            <div className="h-1.5 w-1.5 rounded-full bg-white/30" />
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="absolute right-0 top-0 flex h-full w-[55%] flex-col items-center justify-center px-12">
          <div className="w-full max-w-sm">
            {/* Toggle tabs */}
            <div className="mb-6 flex rounded-lg border border-white/10 bg-slate-950/60 p-1">
              <button
                onClick={() => setMode('signin')}
                className={`flex-1 rounded-md py-2 text-sm font-medium transition ${
                  isSignIn
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setMode('signup')}
                className={`flex-1 rounded-md py-2 text-sm font-medium transition ${
                  !isSignIn
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign Up
              </button>
            </div>



            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {!isSignIn && (
                <div>
                  <label className="block text-sm font-medium text-slate-300">Full name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                    placeholder="Jane Doe"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-300">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300">Password</label>
                <div className="relative mt-1">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-cyan-400 hover:text-cyan-300"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {!isSignIn && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-300">Role</label>
                    <div className="mt-1 flex gap-2">
                      {['user', 'admin'].map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setRole(r)}
                          className={`flex-1 rounded-lg border py-2 text-sm font-medium transition ${
                            role === r
                              ? 'border-cyan-500 bg-cyan-500/10 text-cyan-300'
                              : 'border-white/10 text-slate-400 hover:text-white'
                          }`}
                        >
                          {r === 'user' ? 'Movie Fan' : 'Admin'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300">Favorite Genres</label>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {ALL_GENRES.map((genre) => (
                        <button
                          key={genre}
                          type="button"
                          onClick={() => toggleGenre(genre)}
                          className={`rounded-md px-2.5 py-1 text-[11.5px] font-medium transition ${
                            favoriteGenres.includes(genre)
                              ? 'bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-500'
                              : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {genre}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {isSignIn && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => navigate('/forgot-password')}
                    className="text-xs text-cyan-400 hover:text-cyan-300"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {error && <div className="text-sm text-red-400">{error}</div>}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 py-2.5 text-sm font-semibold text-slate-950 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? 'Please wait…' : isSignIn ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-slate-500">
              {isSignIn ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button onClick={switchMode} className="font-medium text-cyan-400 hover:text-cyan-300">
                {isSignIn ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
