import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SeatSelector from './SeatSelector';
import NowMovieCard from './NowMovieCard';
import { createBooking } from '../../api/bookings';
import { getOccupiedSeats } from '../../api/showtimes';

export default function BookingForm({ movie = {}, showtimes = [] }) {
	const navigate = useNavigate();
	const now = new Date();
	const upcomingShowtimes = showtimes.filter(s => new Date(s.startsAt) > now);
	const [showtimeId, setShowtimeId] = useState(upcomingShowtimes[0]?.id || '');
	const [selectedSeats, setSelectedSeats] = useState([]);
	const [occupiedSeats, setOccupiedSeats] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	function handleToggleSeat(seat) {
		setSelectedSeats((prev) =>
			prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
		);
	}

	// Load occupied seats when showtime changes
	React.useEffect(() => {
		let mounted = true;
		async function load() {
			setOccupiedSeats([]);
			if (!showtimeId) return;
			try {
				const occ = await getOccupiedSeats(showtimeId);
				if (!mounted) return;
				setOccupiedSeats(Array.isArray(occ) ? occ : []);
			} catch (err) {
				// ignore, leave occupied empty
			}
		}
		load();
		return () => { mounted = false; };
	}, [showtimeId]);

	// update initial selected showtime when showtimes prop changes
	React.useEffect(() => {
		if (upcomingShowtimes && upcomingShowtimes.length && !showtimeId) {
			setShowtimeId(upcomingShowtimes[0].id);
		}
	}, [upcomingShowtimes, showtimeId]);

	async function handleSubmit(e) {
		e.preventDefault();
		setError(null);
		if (!showtimeId || selectedSeats.length === 0) {
			setError('Please select a showtime and at least one seat');
			return;
		}

		setLoading(true);
		try {
			await createBooking({ movieId: movie.id, showtimeId, seats: selectedSeats });
			setSelectedSeats([]);
			setLoading(false);
			navigate('/profile');
		} catch (err) {
			setError(err.message || 'Booking failed — please try again.');
			setLoading(false);
		}
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div>
				<label className="block text-sm font-medium">Showtime</label>
				<select
					value={showtimeId}
					onChange={(e) => setShowtimeId(e.target.value)}
					className="mt-1 block w-full border rounded p-2"
				>
					<option value="">Select a showtime</option>
					{upcomingShowtimes.length === 0 && <option disabled>No upcoming showtimes</option>}
					{Object.entries(
						upcomingShowtimes.reduce((acc, s) => {
							const key = s.cinemaName || 'Other';
							if (!acc[key]) acc[key] = [];
							acc[key].push(s);
							return acc;
						}, {})
					).map(([cinema, sts]) => (
						<optgroup key={cinema} label={cinema}>
							{sts.map((s) => (
								<option key={s.id} value={s.id}>
									{s.room ? `${s.room} — ` : ''}{new Date(s.startsAt).toLocaleString()} — ${s.price || '—'}
								</option>
							))}
						</optgroup>
					))}
				</select>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div className="md:col-span-2">
					<label className="block text-sm font-medium">Seats</label>
					<SeatSelector selectedSeats={selectedSeats} onToggleSeat={handleToggleSeat} occupied={occupiedSeats} />
				</div>
				<div className="md:col-span-1">
					<NowMovieCard movie={movie} showtime={showtimes.find((s) => s.id === showtimeId)} selectedSeats={selectedSeats} />
				</div>
			</div>

			{error && <div className="text-red-600">{error}</div>}

			<div>
				<button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
					{loading ? 'Booking...' : 'Confirm Booking'}
				</button>
			</div>
		</form>
	);
}
