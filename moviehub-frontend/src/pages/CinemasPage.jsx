import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clapperboard, MapPin, Clock, Star, Loader2 } from 'lucide-react';

const POSTER_BASE = 'https://image.tmdb.org/t/p/w342';

function getPosterUrl(path) {
  if (!path) return null;
  return path.startsWith('http') ? path : `${POSTER_BASE}${path}`;
}

function CinemasPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/movies');
        if (!res.ok) throw new Error('Failed to load movies');
        const data = await res.json();
        setMovies(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const now = new Date();
  const items = movies.flatMap((m) =>
    (m.showtimes || []).filter((st) => new Date(st.start_time) > now).map((st) => ({
      id: st.id,
      movieId: m.id,
      title: m.title,
      posterUrl: getPosterUrl(m.poster_url),
      cinemaName: st.cinema?.name || '',
      screen: st.screen || '',
      startTime: st.start_time,
      price: st.price ? `$${parseFloat(st.price).toFixed(2)}` : '—',
      rating: m.rating,
      description: m.description,
    }))
  );

  return (
    <div className="relative min-h-screen bg-slate-950 text-white">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <img
          src="https://images.unsplash.com/photo-1770844102881-f8823e9f3c83?fm=jpg&q=80&w=2400&auto=format&fit=crop"
          alt=""
          className="h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/95 to-slate-950" />
      </div>

      <header className="border-b border-white/10 bg-slate-950/90 px-6 py-4 backdrop-blur-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Cinemas</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Now showing</h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-400">
              Browse movies and book your seats.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/"
              className="rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Browse TMDB movies
            </Link>
          </div>
        </div>
      </header>

      <main className="px-6 py-8 lg:px-8">
        {loading && (
          <div className="flex items-center gap-2 py-10 text-slate-400">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-[13px]">Loading movies…</span>
          </div>
        )}

        {error && (
          <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-8 text-center text-red-300">
            <p className="text-[13px]">{error}</p>
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-10 text-center text-slate-300">
            <p className="text-lg font-semibold text-white">No showtimes available</p>
            <p className="mt-2 text-sm text-slate-400">
              Use the homepage to search TMDB movies and add them with a cinema and showtime.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Add a movie
            </Link>
          </div>
        )}

        {!loading && !error && items.length > 0 && (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {items.map((item) => (
              <div key={item.id} className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
                {item.posterUrl ? (
                  <img
                    src={item.posterUrl}
                    alt={item.title}
                    className="h-56 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-56 items-center justify-center bg-slate-800 text-slate-500">
                    <Clapperboard size={48} />
                  </div>
                )}

                <div className="p-5">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-100 text-lg text-cyan-600">
                      🎬
                    </div>
                    <span className="rounded-full bg-cyan-500 px-3 py-1 text-[11px] font-semibold text-slate-950">
                      {item.price}
                    </span>
                  </div>

                  <div className="mb-4">
                    <p className="text-xl font-semibold text-white truncate">{item.title}</p>
                    <p className="mt-1 text-sm text-slate-400 truncate">{item.cinemaName}{item.screen ? ` (${item.screen})` : ''}</p>
                  </div>

                  <div className="mb-4 flex flex-wrap gap-3 text-[12px] text-slate-400">
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={12} /> {item.cinemaName || '—'}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock size={12} /> {item.startTime ? new Date(item.startTime).toLocaleString() : '—'}
                    </span>
                  </div>

                  <div className="mb-4 flex items-center justify-between gap-3 text-sm text-slate-400">
                    <span>{item.screen || 'Standard'}</span>
                    {item.rating && (
                      <span className="inline-flex items-center gap-1 text-cyan-300">
                        <Star size={14} /> {parseFloat(item.rating).toFixed(1)}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-3">
                    <Link
                      to={`/booking/${item.id}`}
                      className="rounded-2xl bg-cyan-500 px-4 py-3 text-center text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
                    >
                      Book seats
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default CinemasPage;
