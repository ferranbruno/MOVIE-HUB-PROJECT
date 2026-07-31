import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Ticket,
  Star,
  Plus,
  X,
  MapPin,
  Loader2,
  Flame,
} from 'lucide-react';
import Header from '../components/common/header/Header';
import Footer from '../components/common/Footer/Footer';
import useAuth from '../hooks/useAuth';

/* ---------------------------------------------------------
   Data source: movie API
--------------------------------------------------------- */
const TMDB_API_KEY = import.meta.env?.VITE_TMDB_API_KEY;
const isPlaceholderApiKey = TMDB_API_KEY === 'YOUR_TMDB_API_KEY';
const TMDB_BASE = 'https://api.themoviedb.org/3';
const POSTER_BASE = 'https://image.tmdb.org/t/p/w342';

let cinemasCache = null;
async function getCinemas() {
  if (cinemasCache) return cinemasCache;
  try {
    const res = await fetch('/api/cinemas');
    if (res.ok) {
      cinemasCache = await res.json();
      return cinemasCache;
    }
  } catch {}
  return [];
}



/* ---------------------------------------------------------
   Hero
--------------------------------------------------------- */
function Hero({ query, setQuery }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/30 px-6 py-10 sm:px-10">
      <div className="mb-3 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-cyan-200">
        Now booking
      </div>
      <h1 className="max-w-2xl text-4xl font-black tracking-tight text-white sm:text-5xl">
        Discover unforgettable movies and book your seat in seconds.
      </h1>
      <p className="mt-4 max-w-xl text-base text-slate-300">
        Browse the latest showtimes, explore cinemas, and reserve your favorite seat with a smooth booking experience.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-[1.25fr_auto]">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-xl shadow-black/20">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies..."
            className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/cinemas"
            className="rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:opacity-90"
          >
            Browse cinemas
          </Link>
          <Link
            to="/cinemas"
            className="rounded-2xl border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/30"
          >
            View added cinemas
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------
   Add Cinema modal
--------------------------------------------------------- */
function AddCinemaModal({ movie, onClose, onAdd }) {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const authHeaders = token ? { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } : { 'Content-Type': 'application/json' };
  const [cinemas, setCinemas] = useState([]);
  const [cinemaId, setCinemaId] = useState('');
  const [showtime, setShowtime] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCinemas().then((list) => {
      setCinemas(list);
      if (list.length > 0) setCinemaId(String(list[0].id));
    });
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!showtime || !price || !cinemaId) return;

    setLoading(true);
    setError(null);
    try {
      const movieRes = await fetch('/api/movies', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          title: movie.title,
          description: movie.overview || '',
          poster_url: movie.poster_path ? `${POSTER_BASE}${movie.poster_path}` : null,
          release_date: movie.release_date || null,
          rating: movie.vote_average || null,
        }),
      });
      const createdMovie = await movieRes.json();
      if (!movieRes.ok) throw new Error(createdMovie?.message || 'Failed to create movie');

      const now = new Date();
      const [hours, minutes] = showtime.split(':');
      const startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), +hours, +minutes);

      const stRes = await fetch('/api/showtimes', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          movie_id: createdMovie.id,
          cinema_id: parseInt(cinemaId),
          screen: 'Screen 1',
          start_time: startTime.toISOString(),
          price: parseFloat(price).toFixed(2),
        }),
      });
      const createdSt = await stRes.json();
      if (!stRes.ok) throw new Error(createdSt?.message || 'Failed to create showtime');

      navigate(`/booking/${createdSt.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-sm rounded-xl border border-white/10 bg-neutral-900 p-5">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="text-[14px] font-semibold text-white">Add cinema</h3>
            <p className="text-[12px] text-neutral-500">{movie.title}</p>
          </div>
          <button onClick={onClose} className="text-neutral-500 hover:text-neutral-300">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-[11.5px] font-medium text-neutral-500">Cinema</span>
            <select
              value={cinemaId}
              onChange={(e) => setCinemaId(e.target.value)}
              className="rounded-md border border-white/10 bg-neutral-950 px-3 py-2 text-[13px] text-white focus:border-cyan-400 focus:outline-none"
            >
              {cinemas.length === 0 && <option value="">Loading...</option>}
              {cinemas.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-[11.5px] font-medium text-neutral-500">Showtime</span>
            <input
              type="time"
              value={showtime}
              onChange={(e) => setShowtime(e.target.value)}
              className="rounded-md border border-white/10 bg-neutral-950 px-3 py-2 text-[13px] text-white focus:border-cyan-400 focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-[11.5px] font-medium text-neutral-500">Ticket price ($)</span>
            <input
              type="number"
              min="0"
              step="0.5"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="8.00"
              className="rounded-md border border-white/10 bg-neutral-950 px-3 py-2 text-[13px] text-white placeholder:text-neutral-600 focus:border-cyan-400 focus:outline-none"
            />
          </label>

          {error && <div className="text-[12px] text-red-400">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-md bg-gradient-to-r from-cyan-400 to-blue-500 py-2.5 text-[13px] font-medium text-neutral-950 hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Add to movie'}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   Movie card — poster with rating badge overlaid top-right,
   Add cinema action
--------------------------------------------------------- */
function MovieCard({ movie, onOpenAddCinema }) {
  const year = movie.release_date ? movie.release_date.slice(0, 4) : '—';
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-white/10 bg-neutral-900">
      <div className="relative aspect-[2/3] w-full bg-neutral-800">
        {movie.poster_path ? (
          <img
            src={movie.poster_path.startsWith('http') ? movie.poster_path : `${POSTER_BASE}${movie.poster_path}`}
            alt={movie.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-neutral-600">
            No poster
          </div>
        )}
        <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/70 px-2 py-0.5 text-[11px] font-medium text-cyan-300">
          <Star size={10} className="fill-cyan-300 text-cyan-300" />
          {movie.vote_average?.toFixed(1) ?? '—'}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <div>
          <p className="truncate text-[13px] font-semibold text-white">{movie.title}</p>
          <p className="text-[11px] text-neutral-500">{year}</p>
        </div>

        {isAdmin && (
          <button
            onClick={() => onOpenAddCinema(movie)}
            className="mt-auto flex items-center justify-center gap-1 rounded-md border border-white/10 py-1.5 text-[11.5px] font-medium text-neutral-300 hover:border-amber-400/50 hover:text-amber-300"
          >
            <Plus size={13} /> Add cinema
          </button>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   To Be Premiered — fetches real movies, holds cinema assignments
--------------------------------------------------------- */
function NowShowing({ movies, loading, error, query }) {
  const [activeMovie, setActiveMovie] = useState(null);

  function handleAdd() {
    setActiveMovie(null);
  }

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[18px] font-semibold text-white">To Be Premiered</h2>
      </div>

      {loading && (
        <div className="flex items-center gap-2 py-10 text-neutral-400">
          <Loader2 size={16} className="animate-spin" />
          <span className="text-[13px]">Loading movies…</span>
        </div>
      )}

      {error && !loading && (
        <div className="rounded-md border border-cyan-400/30 bg-cyan-400/10 px-4 py-3 text-[13px] text-cyan-100">
          {error}
        </div>
      )}

      {!loading && !error && movies.length === 0 && (
        <div className="rounded-md border border-slate-700 bg-slate-900 px-4 py-6 text-[13px] text-slate-400">
          {query
            ? `No movies found for "${query}". Try a different search.`
            : 'No movies available right now.'}
        </div>
      )}

      {!loading && !error && movies.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onOpenAddCinema={setActiveMovie}
            />
          ))}
        </div>
      )}

      {activeMovie && (
        <AddCinemaModal
          movie={activeMovie}
          onClose={() => setActiveMovie(null)}
          onAdd={handleAdd}
        />
      )}
    </section>
  );
}

/* ---------------------------------------------------------
   Trending — top 3 by rating from whichever loaded, own layout
--------------------------------------------------------- */
function Trending() {
  const [cinemaMovies, setCinemaMovies] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/movies');
        if (!res.ok) return;
        const data = await res.json();
        const now = new Date();
        const withShowtimes = (Array.isArray(data) ? data : [])
          .filter((m) => (m.showtimes || []).some((st) => new Date(st.start_time) > new Date(now.getTime() - 3600000)))
          .sort((a, b) => parseFloat(b.rating || 0) - parseFloat(a.rating || 0))
          .slice(0, 3);
        setCinemaMovies(withShowtimes);
      } catch {}
    }
    load();
  }, []);

  if (cinemaMovies.length === 0) return null;

  return (
    <section>
      <h2 className="mb-4 flex items-center gap-1.5 text-[18px] font-semibold text-white">
        <Flame size={16} className="text-cyan-400" /> Trending this week
      </h2>
      <div className="flex flex-col divide-y divide-white/10 rounded-xl border border-white/10 bg-neutral-900">
        {cinemaMovies.map((m, i) => (
          <Link key={m.id} to={`/booking/${m.showtimes[0]?.id}`} className="flex items-center gap-3 px-4 py-3.5 hover:bg-neutral-800/50">
            <span className="w-5 text-[13px] font-semibold text-cyan-400">{i + 1}</span>
            {m.poster_url && (
              <img
                src={m.poster_url}
                alt={m.title}
                className="h-12 w-8 flex-shrink-0 rounded object-cover"
              />
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-white">{m.title}</p>
              <p className="text-[11px] text-neutral-500">
                {m.release_date ? m.release_date.slice(0, 4) : '—'}
              </p>
            </div>
            <span className="flex items-center gap-1 text-[12px] font-medium text-cyan-300">
              <Star size={11} className="fill-cyan-300 text-cyan-300" />
              {m.rating ? parseFloat(m.rating).toFixed(1) : '—'}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------
   HomePage
--------------------------------------------------------- */
function HomePage() {
  const [movies, setMovies] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const displayMovies = query.trim() ? searchResults ?? [] : movies;

  useEffect(() => {
    async function fetchMovies() {
      setLoading(true);

      if (!TMDB_API_KEY || isPlaceholderApiKey) {
        setError('Movie API key not configured.');
        setMovies([]);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `${TMDB_BASE}/movie/now_playing?api_key=${TMDB_API_KEY}&language=en-US&page=1`
        );
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.status_message || `Failed to load movies (${res.status})`);
        }

        setMovies(data.results ?? []);
        setError(null);
      } catch (err) {
        setError(`Could not load movies. ${err.message}`);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    }

    fetchMovies();
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      if (!TMDB_API_KEY || isPlaceholderApiKey) {
        setError('Movie search is not available.');
        setSearchResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const res = await fetch(
          `${TMDB_BASE}/search/movie?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(
            query
          )}&page=1&include_adult=false`,
          { signal: controller.signal }
        );
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.status_message || `Search failed (${res.status})`);
        }

        setSearchResults(data.results ?? []);
        setError(null);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(`Movie search failed. ${err.message}`);
          setSearchResults([]);
        }
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  return (
    <div className="page-shell">
      <Header />
      <main className="relative min-h-screen bg-neutral-950 text-white">
        <div className="space-y-10 px-4 pb-16 pt-8 sm:px-6 lg:px-8">
          <Hero query={query} setQuery={setQuery} />
          <NowShowing
            movies={displayMovies}
            loading={loading}
            error={error}
            query={query}
          />
          <Trending />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default HomePage;
