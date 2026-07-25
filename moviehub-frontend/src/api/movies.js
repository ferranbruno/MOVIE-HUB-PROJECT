import { parseJSON } from '../utils/fetchHelpers';

export async function getMovie(id) {
  const res = await fetch(`/api/movies/${id}`);
  if (!res.ok) {
    const body = await parseJSON(res);
    throw new Error(body?.message || `Failed to load movie: ${res.status}`);
  }
  return parseJSON(res);
}

export default { getMovie };
