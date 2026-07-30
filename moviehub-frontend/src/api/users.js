import { parseJSON } from '../utils/fetchHelpers';

export async function getLoyaltyPoints() {
  const token = localStorage.getItem('token');
  if (!token) return 0;
  const res = await fetch('/api/users/loyalty-points', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return 0;
  const data = await parseJSON(res);
  return data.loyalty_points ?? 0;
}

export default { getLoyaltyPoints };
