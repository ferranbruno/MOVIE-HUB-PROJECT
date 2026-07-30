import { parseJSON } from '../utils/fetchHelpers';

export async function createBooking(payload) {
	const token = localStorage.getItem('token');
	const headers = { 'Content-Type': 'application/json' };
	if (token) headers['Authorization'] = `Bearer ${token}`;

	const body = {
		showtimeId: payload.showtimeId,
		seatIds: payload.seats,
	};

	const res = await fetch('/api/bookings', {
		method: 'POST',
		headers,
		body: JSON.stringify(body),
	});
	if (!res.ok) {
		const body = await parseJSON(res);
		const message = body && body.message ? body.message : `Request failed: ${res.status}`;
		throw new Error(message);
	}
	return parseJSON(res);
}

export async function getMyBookings() {
	const token = localStorage.getItem('token');
	if (!token) return [];
	const res = await fetch('/api/bookings/me', {
		headers: { Authorization: `Bearer ${token}` },
	});
	if (!res.ok) return [];
	return parseJSON(res);
}

export default { createBooking, getMyBookings };
