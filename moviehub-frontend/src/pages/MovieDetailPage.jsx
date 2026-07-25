import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMovie } from '../api/movies';
import { getShowtimes } from '../api/showtimes';
import { parseJSON } from '../utils/fetchHelpers';

export default function MovieDetailPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const m = await getMovie(id);
        const s = await getShowtimes(id);
        if (!mounted) return;
        setMovie(m || {});
        setShowtimes(Array.isArray(s) ? s : []);
      } catch (err) {
        // fallback: try direct fetches
        try {
          const res = await fetch(`/api/movies/${id}`);
          const m = await parseJSON(res);
          const res2 = await fetch(`/api/showtimes?movieId=${id}`);
          const s = await parseJSON(res2);
          if (!mounted) return;
          setMovie(m || {});
          setShowtimes(Array.isArray(s) ? s : []);
        } catch (e) {
          // ignore
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          {movie?.poster && <img src={movie.poster} alt={movie.title} className="w-full rounded" />}
        </div>
        <div className="md:col-span-2">
          <h1 className="text-2xl font-bold mb-2">{movie?.title}</h1>
          <p className="text-sm text-gray-600 mb-4">{movie?.description}</p>
          <div className="flex items-center gap-3">
            <Link to={`/booking/${movie?.id || id}`} className="px-4 py-2 bg-indigo-600 text-white rounded">Book now</Link>
          </div>
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Showtimes</h3>
            <ul className="space-y-2">
              {showtimes.map((s) => (
                <li key={s.id} className="flex items-center justify-between border rounded p-2">
                  <div>{new Date(s.startsAt).toLocaleString()} — {s.cinemaName || s.room}</div>
                  <Link to={`/booking/${movie?.id || id}`} className="text-sm text-blue-600">Book</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
