import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMovie } from '../api/movies';
import { getShowtimes } from '../api/showtimes';
import { parseJSON } from '../utils/fetchHelpers';
import BookingForm from '../components/booking/BookingForm';

export default function MovieDetailPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);

  function makeSampleMovie(movieId) {
    const titles = {
      '1': { title: 'The Great Adventure', description: 'An epic journey of discovery and friendship.', tagline: 'Experience the adventure of a lifetime' },
      '2': { title: 'Space Odyssey', description: 'A voyage beyond the stars.', tagline: 'To infinity and beyond' },
    };
    const fallback = titles[movieId] || { title: `Movie #${movieId}`, description: 'A captivating film experience.', tagline: 'Now showing' };
    return { id: movieId, poster: null, ...fallback };
  }

  function makeSampleShowtimes(movieId) {
    const now = new Date();
    return [
      { id: `${movieId}-st1`, movieId, startsAt: new Date(now.getTime() + 3600000).toISOString(), cinemaName: 'Cineplex 1', room: 'Main' },
      { id: `${movieId}-st2`, movieId, startsAt: new Date(now.getTime() + 7200000).toISOString(), cinemaName: 'Cineplex 2', room: 'VIP' },
    ];
  }

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
      } catch {
        try {
          const res = await fetch(`/api/movies/${id}`);
          const m = await parseJSON(res);
          const res2 = await fetch(`/api/showtimes?movieId=${id}`);
          const s = await parseJSON(res2);
          if (!mounted) return;
          setMovie(m || {});
          setShowtimes(Array.isArray(s) ? s : []);
        } catch {
          if (!mounted) return;
          setMovie(makeSampleMovie(id));
          setShowtimes(makeSampleShowtimes(id));
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
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div>
          {movie?.poster && <img src={movie.poster} alt={movie.title} className="w-full rounded" />}
        </div>
        <div className="md:col-span-2">
          <h1 className="text-2xl font-bold mb-2">{movie?.title}</h1>
          <p className="text-sm text-gray-600 mb-4">{movie?.description}</p>
          {showtimes.length > 0 && (
            <button
              onClick={() => setShowBooking(!showBooking)}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
            >
              {showBooking ? 'Hide booking' : 'Book now'}
            </button>
          )}
        </div>
      </div>

      {showBooking && showtimes.length > 0 && (
        <div className="border-t pt-6">
          <BookingForm movie={movie} showtimes={showtimes} />
        </div>
      )}
    </div>
  );
}
