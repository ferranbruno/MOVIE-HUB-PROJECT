import { parseJSON } from '../utils/fetchHelpers';

export async function getShowtimes(movieId) {
  const res = await fetch(`/api/showtimes?movieId=${movieId}`);
  if (!res.ok) {
    const body = await parseJSON(res);
    throw new Error(body?.message || `Failed to load showtimes: ${res.status}`);
  }
  return parseJSON(res);
}

export async function getOccupiedSeats(showtimeId) {
  // Try a few common endpoints the mock server might expose
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
