import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function NextShowtime() {
  const [next, setNext] = useState(null);
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    async function fetchNext() {
      try {
        const res = await fetch('/api/showtimes');
        if (!res.ok) return;
        const all = await res.json();
        const now = new Date();
        const upcoming = all
          .filter((s) => new Date(s.start_time) > now)
          .sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
        if (upcoming.length === 0) return;
        const st = upcoming[0];
        const movieRes = await fetch(`/api/movies/${st.movie_id}`);
        const movie = movieRes.ok ? await movieRes.json() : null;
        setNext({ ...st, movieTitle: movie?.title || '' });
      } catch {}
    }
    fetchNext();
  }, []);

  useEffect(() => {
    if (!next) return;
    const id = setInterval(() => {
      const diff = new Date(next.start_time) - new Date();
      if (diff <= 0) { setCountdown('NOW'); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setCountdown(`in ${h}h ${m}m`);
    }, 1000);
    return () => clearInterval(id);
  }, [next]);

  if (!next || !countdown) return null;
  return (
    <Link to={`/booking/${next.id}`} className="hidden items-center gap-1.5 text-[12px] text-cyan-300 hover:text-cyan-200 lg:flex">
      <span className="truncate max-w-[120px]">{next.movieTitle}</span>
      <span className="text-slate-500">—</span>
      <span className="tabular-nums">{countdown}</span>
    </Link>
  );
}

function Clock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="text-[13px] tabular-nums text-slate-400">
      {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </span>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 font-semibold tracking-[0.2em] text-white">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-pink-500 to-cyan-400 text-sm font-bold text-slate-950">
            ▶
          </span>
          <span>MovieHub</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          <a href="#browse" className="transition hover:text-white">Browse movies</a>
          <Link to="/cinemas" className="transition hover:text-white">Now showing</Link>
          <NextShowtime />
          <Clock />
        </nav>
      </div>
    </header>
  );
}

export default Header;
