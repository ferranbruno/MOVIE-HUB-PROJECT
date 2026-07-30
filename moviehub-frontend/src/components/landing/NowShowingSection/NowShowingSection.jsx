import React, { useEffect, useState } from 'react';
import { getShowtimes } from '../../../api/showtimes';
import { getMovie } from '../../../api/movies';

function NowShowingSection() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const showtimes = await getShowtimes();
        // group by movieId and pick the earliest upcoming showtime per movie
        const byMovie = {};
        showtimes.forEach((s) => {
          if (!byMovie[s.movieId] || new Date(s.startsAt) < new Date(byMovie[s.movieId].startsAt)) {
            byMovie[s.movieId] = s;
          }
        });

        const movieIds = Object.keys(byMovie);
        const results = [];
        for (const id of movieIds) {
          try {
            const movie = await getMovie(id);
            results.push({ movie, showtime: byMovie[id] });
          } catch (err) {
            // ignore missing movie
          }
        }
        if (!mounted) return;
        setItems(results);
      } catch (err) {
        // fallback: leave items empty
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <section id="now-showing" className="px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">To Be Premiered</h2>
          <a href="#" className="text-sm font-medium text-cyan-300">View all</a>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {loading && <div className="text-gray-300">Loading...</div>}
          {!loading && items.length === 0 && <div className="text-gray-400">No showings available</div>}
          {!loading && items.map(({ movie, showtime }) => (
            <article key={movie.id} className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-xl shadow-black/20">
              <img src={movie.poster || `https://picsum.photos/400/300?random=${movie.id}`} alt={movie.title} className="h-44 w-full object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white">{movie.title}</h3>
                <p className="mt-1 text-sm text-slate-300">{movie.tagline || movie.description}</p>
                {showtime && (
                  <span className="mt-3 inline-block rounded-full bg-cyan-400/10 px-3 py-1 text-sm text-cyan-200">{new Date(showtime.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default NowShowingSection;
