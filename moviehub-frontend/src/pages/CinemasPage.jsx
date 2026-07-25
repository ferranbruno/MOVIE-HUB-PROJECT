import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clapperboard, MapPin, Clock, Star } from 'lucide-react';

const POSTER_BASE = 'https://image.tmdb.org/t/p/w342';

function getPosterUrl(path) {
  if (!path) return null;
  return path.startsWith('http') ? path : `${POSTER_BASE}${path}`;
}

function InfoModal({ cinema, onClose }) {
  if (!cinema) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/40">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">{cinema.movie}</h2>
            <p className="text-sm text-slate-400">{cinema.name} · {cinema.genre}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-white/10 bg-slate-950 px-3 py-2 text-sm text-slate-300 hover:bg-slate-900"
          >
            Close
          </button>
        </div>
        <div className="space-y-3 text-sm text-slate-300">
          <p><span className="font-semibold text-white">Cinema:</span> {cinema.name}</p>
          <p><span className="font-semibold text-white">Showtime:</span> {cinema.showtimes[0]}</p>
          <p><span className="font-semibold text-white">Price:</span> {cinema.price}</p>
          <p><span className="font-semibold text-white">Rating:</span> {cinema.rating.toFixed(1)}</p>
          <p><span className="font-semibold text-white">Location:</span> {cinema.location}</p>
          <p><span className="font-semibold text-white">When:</span> {cinema.date}</p>
        </div>
      </div>
    </div>
  );
}

function CinemasPage() {
  const [assignments, setAssignments] = useState(() => {
    if (typeof window === 'undefined') return {};
    try {
      return JSON.parse(localStorage.getItem('moviehub-assignments') || '{}');
    } catch {
      return {};
    }
  });
  const [ratings, setRatings] = useState(() => {
    if (typeof window === 'undefined') return {};
    try {
      return JSON.parse(localStorage.getItem('moviehub-ratings') || '{}');
    } catch {
      return {};
    }
  });
  const [infoCinema, setInfoCinema] = useState(null);

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === 'moviehub-assignments') {
        try {
          setAssignments(JSON.parse(event.newValue || '{}'));
        } catch {
          setAssignments({});
        }
      }
      if (event.key === 'moviehub-ratings') {
        try {
          setRatings(JSON.parse(event.newValue || '{}'));
        } catch {
          setRatings({});
        }
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    localStorage.setItem('moviehub-ratings', JSON.stringify(ratings));
  }, [ratings]);

  const addedCinemas = Object.entries(assignments).flatMap(([movieId, entries]) =>
    entries.map((entry, index) => ({
      id: `${movieId}-${index}`,
      name: entry.cinema,
      location: entry.cinema,
      logo: '🎬',
      logoBg: 'bg-cyan-100 text-cyan-600',
      movie: entry.title,
      genre: entry.release_date ? `Release ${new Date(entry.release_date).getFullYear()}` : 'Added movie',
      duration: 'Showtime',
      date: 'Now',
      showtimes: [entry.showtime],
      price: entry.price,
      screen: 'Screen 1',
      rating: entry.vote_average ?? 0,
      posterPath: entry.poster_path,
      posterUrl: getPosterUrl(entry.poster_path),
      isAdded: true,
      info: entry,
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
            <h1 className="mt-2 text-3xl font-semibold text-white">Your added movies</h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-400">
              Movies to watch at your local cinemas.
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
        {addedCinemas.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-10 text-center text-slate-300">
            <p className="text-lg font-semibold text-white">No cinemas added yet</p>
            <p className="mt-2 text-sm text-slate-400">
              Use the homepage search and Add cinema button to save TMDB movies here.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Add a movie
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {addedCinemas.map((cinema) => (
              <div key={cinema.id} className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
                {cinema.posterUrl ? (
                  <img
                    src={cinema.posterUrl}
                    alt={cinema.movie}
                    className="h-56 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-56 items-center justify-center bg-slate-800 text-slate-500">
                    <Clapperboard size={48} />
                  </div>
                )}

                <div className="p-5">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-2xl text-lg ${cinema.logoBg}`}>
                      {cinema.logo}
                    </div>
                    <span className="rounded-full bg-cyan-500 px-3 py-1 text-[11px] font-semibold text-slate-950">
                      {cinema.price}
                    </span>
                  </div>

                  <div className="mb-4">
                    <p className="text-xl font-semibold text-white truncate">{cinema.movie}</p>
                    <p className="mt-1 text-sm text-slate-400 truncate">{cinema.name}</p>
                  </div>

                  <div className="mb-4 flex flex-wrap gap-3 text-[12px] text-slate-400">
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={12} /> {cinema.location}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock size={12} /> {cinema.showtimes[0]}
                    </span>
                  </div>

                  <div className="mb-4 flex items-center justify-between gap-3 text-sm text-slate-400">
                    <span>{cinema.genre}</span>
                    <span className="inline-flex items-center gap-1 text-cyan-300">
                      <Star size={14} /> {ratings[cinema.id] ?? cinema.rating?.toFixed(1) ?? '—'}
                    </span>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Link
                      to={`/booking/${cinema.id}`}
                      className="rounded-2xl bg-cyan-500 px-4 py-3 text-center text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
                    >
                      Book seats
                    </Link>
                    <button
                      type="button"
                      onClick={() => setInfoCinema(cinema)}
                      className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-900"
                    >
                      View info
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <InfoModal cinema={infoCinema} onClose={() => setInfoCinema(null)} />
    </div>
  );
}

export default CinemasPage;
