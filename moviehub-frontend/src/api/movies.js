import { parseJSON } from '../utils/fetchHelpers';

export async function getMovie(id) {
  const res = await fetch(`/api/movies/${id}`);
  if (!res.ok) {
    const body = await parseJSON(res);
    throw new Error(body?.message || `Failed to load movie: ${res.status}`);
  }
  const data = await parseJSON(res);
  return normalizeMovie(data);
}

function normalizeMovie(m) {
  if (!m) return m;
  return {
    ...m,
    poster: m.poster || m.poster_url || null,
    tagline: m.tagline || '',
  };
}

export default { getMovie };
