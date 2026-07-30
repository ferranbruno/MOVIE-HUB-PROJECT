import { parseJSON } from '../utils/fetchHelpers';

export async function getShowtimes(movieId) {
  const res = await fetch(`/api/showtimes?movieId=${movieId}`);
  if (!res.ok) {
    const body = await parseJSON(res);
    throw new Error(body?.message || `Failed to load showtimes: ${res.status}`);
  }
  const data = await parseJSON(res);
  return (Array.isArray(data) ? data : []).map(normalizeShowtime);
}

function normalizeShowtime(s) {
  return {
    id: s.id,
    movieId: s.movie_id ?? s.movieId,
    startsAt: s.startsAt || s.start_time,
    cinemaName: s.cinemaName || s.cinema?.name || '',
    room: s.room || s.screen || '',
    cinema_id: s.cinema_id ?? s.cinemaId,
    price: s.price,
    movieTitle: s.movie?.title || s.movieTitle || '',
  };
}

export async function getOccupiedSeats(showtimeId) {
  // Try endpoints the mock server or real backend might expose
  const candidates = [`/api/showtimes/${showtimeId}/seats`, `/api/showtimes/${showtimeId}/occupied`, `/api/showtimes/${showtimeId}/booked`];
  for (const url of candidates) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const body = await parseJSON(res);
      // Expect an array of seat ids like ['A1','B2']
      if (Array.isArray(body)) return body;
      if (Array.isArray(body?.occupied)) return body.occupied;
      if (Array.isArray(body?.seats)) return body.seats;
    } catch (err) {
      // ignore and try next
    }
  }
  return [];
}

export default { getShowtimes, getOccupiedSeats };
