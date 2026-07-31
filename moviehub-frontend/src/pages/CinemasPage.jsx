import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clapperboard, MapPin, Clock, Star, Loader2, Trash2, Play, X } from 'lucide-react';
import useAuth from '../hooks/useAuth';

const POSTER_BASE = 'https://image.tmdb.org/t/p/w342';

function getPosterUrl(path) {
  if (!path) return null;
  return path.startsWith('http') ? path : `${POSTER_BASE}${path}`;
}

function formatPrice(price) {
  return price ? `KSh ${parseFloat(price).toFixed(2)}` : '—';
}

function CinemasPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [previewKey, setPreviewKey] = useState(null);
  const [previewTitle, setPreviewTitle] = useState('');

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

  async function handleDelete(showtimeId, e) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Delete this showtime?')) return;
    setDeletingId(showtimeId);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/showtimes/${showtimeId}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error('Failed to delete');
      setMovies((prev) =>
        prev
          .map((m) => ({
            ...m,
            showtimes: (m.showtimes || []).filter((st) => st.id !== showtimeId),
          }))
          .filter((m) => (m.showtimes || []).length > 0)
      );
    } catch (err) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  const now = new Date();
  const threshold = now.getTime() - 3600000;

  const byCinema = new Map();
  for (const m of movies) {
    for (const st of m.showtimes || []) {
      if (!st.cinema || new Date(st.start_time) <= new Date(threshold)) continue;
      const cin = st.cinema;
      if (!byCinema.has(cin.id)) byCinema.set(cin.id, { cinema: cin, showtimes: [] });
      byCinema.get(cin.id).showtimes.push({
        id: st.id,
        movieId: m.id,
        title: m.title,
        description: m.description,
        trailerKey: m.trailer_key,
        posterUrl: getPosterUrl(m.poster_url),
        rating: m.rating,
        screen: st.screen || '',
        startTime: st.start_time,
        price: formatPrice(st.price),
      });
    }
  }

  const cinemas = Array.from(byCinema.values())
    .map((g) => ({ ...g, showtimes: g.showtimes.sort((a, b) => new Date(a.startTime) - new Date(b.startTime)) }))
    .sort((a, b) => a.cinema.name.localeCompare(b.cinema.name));

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
              Browse movies
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

        {!loading && !error && cinemas.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-10 text-center text-slate-300">
            <p className="text-lg font-semibold text-white">No showtimes available</p>
            <p className="mt-2 text-sm text-slate-400">
              Use the homepage to search movies and add them with a cinema and showtime.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Add a movie
            </Link>
          </div>
        )}

        {!loading && !error && cinemas.length > 0 && (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {cinemas.map(({ cinema, showtimes }) => (
              <div key={cinema.id} className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
                {showtimes[0]?.posterUrl ? (
                  <img
                    src={showtimes[0].posterUrl}
                    alt={cinema.name}
                    className="h-56 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-56 items-center justify-center bg-slate-800 text-slate-500">
                    <Clapperboard size={48} />
                  </div>
                )}

                <div className="p-5">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="flex items-center gap-1.5 text-lg font-semibold text-white">
                        <MapPin size={16} className="shrink-0 text-cyan-400" />
                        <span className="truncate">{cinema.name}</span>
                      </p>
                      <p className="mt-1 text-[12px] text-slate-400">
                        {[cinema.address, cinema.city].filter(Boolean).join(', ') || '—'}
                      </p>
                    </div>
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-100 text-lg text-cyan-600">
                      🎬
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    {showtimes.map((st) => (
                      <div key={st.id} className="rounded-2xl border border-white/10 bg-slate-800/50 p-3.5">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <p className="min-w-0 flex-1 truncate text-[14px] font-semibold text-white">
                            {st.title}
                          </p>
                          {st.rating && (
                            <span className="flex shrink-0 items-center gap-1 text-[12px] text-cyan-300">
                              <Star size={13} /> {parseFloat(st.rating).toFixed(1)}
                            </span>
                          )}
                        </div>
                        {st.description && (
                          <p className="mb-3 line-clamp-3 text-[12px] leading-relaxed text-slate-400">
                            {st.description}
                          </p>
                        )}
                        <p className="mb-3 flex items-center gap-1.5 text-[12px] text-slate-400">
                          <Clock size={12} className="shrink-0" />
                          {new Date(st.startTime).toLocaleString()}
                          {st.screen ? ` · ${st.screen}` : ''}
                        </p>
                        <div className="flex gap-2">
                          <span className="flex items-center rounded-xl bg-cyan-500/10 px-3 py-2.5 text-[12.5px] font-semibold text-cyan-300">
                            {st.price}
                          </span>
                          <Link
                            to={`/booking/${st.id}`}
                            className="flex-1 rounded-xl bg-cyan-500 px-3 py-2.5 text-center text-[12.5px] font-semibold text-slate-950 transition hover:bg-cyan-400"
                          >
                            Book seats
                          </Link>
                          {st.trailerKey && (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                setPreviewKey(st.trailerKey);
                                setPreviewTitle(st.title);
                              }}
                              className="flex items-center justify-center rounded-xl border border-white/15 px-3 text-[12px] font-medium text-slate-200 transition hover:border-cyan-400/50 hover:text-cyan-300"
                              title="Watch trailer"
                            >
                              <Play size={14} className="fill-current" />
                            </button>
                          )}
                          {isAdmin && (
                            <button
                              onClick={(e) => handleDelete(st.id, e)}
                              disabled={deletingId === st.id}
                              className="flex items-center justify-center rounded-xl border border-red-500/30 px-3 text-[12px] font-medium text-red-300 transition hover:bg-red-500/10 disabled:opacity-50"
                              title="Delete showtime"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {previewKey && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4"
          onClick={() => setPreviewKey(null)}
        >
          <div
            className="w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-slate-900 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="truncate text-[15px] font-semibold text-white">{previewTitle} — Trailer</p>
              <button
                onClick={() => setPreviewKey(null)}
                className="text-slate-400 transition hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${previewKey}?autoplay=1`}
                title="Movie trailer"
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CinemasPage;
