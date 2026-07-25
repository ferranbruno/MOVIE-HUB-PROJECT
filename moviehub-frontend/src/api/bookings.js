import { parseJSON } from '../utils/fetchHelpers';

export async function createBooking(payload) {
	const res = await fetch('/api/bookings', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload),
	});
	if (!res.ok) {
		const body = await parseJSON(res);
		const message = body && body.message ? body.message : `Request failed: ${res.status}`;
		throw new Error(message);
	}
	return parseJSON(res);
}

export default { createBooking };
