import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, MapPin, Calendar, Clock } from 'lucide-react';
import { createBooking } from '../api/bookings';

const SEAT_ROWS = ['A', 'B', 'C', 'D', 'E'];
const SEAT_COLS = 8;

export default function BookingPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showtime, setShowtime] = useState(null);
  const [movie, setMovie] = useState(null);
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [confirmation, setConfirmation] = useState('');
  const [nextShowtime, setNextShowtime] = useState(null);
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    async function fetchNext() {
      try {
        const res = await fetch('/api/showtimes');
        if (!res.ok) return;
        const all = await res.json();
        const now = new Date();
        const upcoming = all
          .filter((s) => new Date(s.start_time) > now)
          .sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
        if (upcoming.length === 0) return;
        const st = upcoming[0];
        const movieRes = await fetch(`/api/movies/${st.movie_id}`);
        const m = movieRes.ok ? await movieRes.json() : null;
        setNextShowtime({ ...st, movieTitle: m?.title || '' });
      } catch {}
    }
    fetchNext();
  }, []);

  useEffect(() => {
    if (!nextShowtime) return;
    const id2 = setInterval(() => {
      const diff = new Date(nextShowtime.start_time) - new Date();
      if (diff <= 0) { setCountdown('NOW'); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setCountdown(`${h}h ${m}m`);
    }, 1000);
    return () => clearInterval(id2);
  }, [nextShowtime]);

  useEffect(() => {
    async function load() {
      try {
        const stRes = await fetch(`/api/showtimes/${id}`);
        if (!stRes.ok) throw new Error('Showtime not found');
        const st = await stRes.json();
        setShowtime(st);

        const mRes = await fetch(`/api/movies/${st.movie_id}`);
        if (mRes.ok) {
          setMovie(await mRes.json());
        }

        const seatsRes = await fetch(`/api/showtimes/${id}/seats`);
        if (seatsRes.ok) {
          const seats = await seatsRes.json();
          setOccupiedSeats(Array.isArray(seats) ? seats : []);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const startTime = showtime?.start_time ? new Date(showtime.start_time) : null;
  const cinemaName = showtime?.cinema?.name || showtime?.cinema_name || '';
  const movieTitle = movie?.title || showtime?.movie?.title || '';
  const screen = showtime?.screen || '';
  const price = showtime?.price ? parseFloat(showtime.price) : 0;
  const selectedList = Array.from(selected).sort();
  const total = selectedList.length * price;

  function toggleSeat(seatId) {
    if (occupiedSeats.includes(seatId)) return;
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(seatId) ? next.delete(seatId) : next.add(seatId);
      return next;
    });
  }

  async function handleBooking() {
    if (selectedList.length === 0) return;
    setBookingLoading(true);
    setError(null);
    try {
      await createBooking({ showtimeId: parseInt(id), seats: selectedList });
      setConfirmation(`Booked ${selectedList.length} seat(s) successfully!`);
      setSelected(new Set());
    } catch (err) {
      setError(err.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-neutral-400">
        Loading...
      </div>
    );
  }

  if (error && !showtime) {
    return (
      <div className="min-h-screen bg-slate-950 text-neutral-300 p-8">
        <div className="max-w-3xl mx-auto">
          <button onClick={() => navigate('/cinemas')} className="mb-4 flex items-center gap-1 text-[13px] text-neutral-500 hover:text-neutral-300">
            <ChevronLeft size={15} /> Back to cinemas
          </button>
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-neutral-300">
      <header className="border-b border-neutral-800 px-8 py-4">
        <button
          onClick={() => navigate('/cinemas')}
          className="mb-4 flex items-center gap-1 text-[13px] text-neutral-500 hover:text-neutral-300"
        >
          <ChevronLeft size={15} /> Back to cinemas
        </button>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-cyan-100 text-xl text-cyan-600">
              🎬
            </div>
            <div>
              <p className="text-[16px] font-semibold text-white">{movieTitle}</p>
              <p className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[12px] text-neutral-500">
                <span className="flex items-center gap-1">
                  <MapPin size={11} /> {cinemaName}{screen ? ` (${screen})` : ''}
                </span>
                {startTime && (
                  <>
                    <span className="flex items-center gap-1">
                      <Calendar size={11} /> {startTime.toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} /> {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
        {nextShowtime && countdown && nextShowtime.id !== parseInt(id) && (
          <Link
            to={`/booking/${nextShowtime.id}`}
            className="mx-8 mt-4 flex items-center gap-2 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-3 text-[13px] text-cyan-200 hover:bg-cyan-500/20"
          >
            <span>Next premiere:</span>
            <span className="font-semibold">{nextShowtime.movieTitle}</span>
            <span className="text-slate-500">—</span>
            <span className="tabular-nums font-semibold">in {countdown}</span>
          </Link>
        )}
      </header>

      <div className="px-8 py-8">
        <p className="mb-6 text-[13px] text-neutral-500">Rows: A–E · Columns: 1–{SEAT_COLS}</p>

        {confirmation && (
          <div className="mb-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            {confirmation}
            <button
              onClick={() => navigate('/profile')}
              className="ml-3 underline hover:text-emerald-200"
            >
              View bookings
            </button>
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="flex-1 overflow-x-auto">
            <div className="mb-2 flex gap-3 pl-10">
              {Array.from({ length: SEAT_COLS }).map((_, i) => (
                <div key={i} className="flex w-20 items-center justify-center text-[13px] text-neutral-500">
                  {i + 1}
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              {SEAT_ROWS.map((row) => (
                <div key={row} className="flex items-center gap-3">
                  <div className="w-6 text-[15px] font-semibold text-neutral-300">{row}</div>
                  {Array.from({ length: SEAT_COLS }).map((_, i) => {
                    const seatId = `${row}${i + 1}`;
                    const isSelected = selected.has(seatId);
                    const isBooked = occupiedSeats.includes(seatId);
                    return (
                      <button
                        key={seatId}
                        type="button"
                        disabled={isBooked}
                        onClick={() => toggleSeat(seatId)}
                        className={`h-12 w-20 rounded-md text-[12px] font-medium transition-colors ${
                          isBooked
                            ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                            : isSelected
                            ? 'bg-cyan-500 text-slate-950'
                            : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        {seatId}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="w-full flex-shrink-0 lg:w-72">
            <div className="sticky top-6 rounded-xl border border-neutral-800 bg-slate-900 p-5">
              <h3 className="mb-3 text-[13px] font-semibold text-neutral-200">Selected Seats</h3>
              {selectedList.length === 0 ? (
                <p className="text-[12.5px] text-neutral-500">Click a seat to select it.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {selectedList.map((seat) => (
                    <span key={seat} className="rounded-md bg-cyan-500 px-2.5 py-1 text-[12.5px] font-semibold text-slate-950">
                      {seat}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-4 flex flex-col gap-1.5 border-t border-neutral-800 pt-3 text-[12.5px]">
                <div className="flex justify-between text-neutral-500">
                  <span>Seats selected</span>
                  <span className="font-semibold text-neutral-200">{selectedList.length}</span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span>Price per seat</span>
                  <span className="font-semibold text-neutral-200">${price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-neutral-800 pt-2 text-[14px]">
                  <span className="font-medium text-neutral-300">Total</span>
                  <span className="font-semibold text-white">${total.toFixed(2)}</span>
                </div>
              </div>
              <button
                type="button"
                disabled={selectedList.length === 0 || bookingLoading}
                onClick={handleBooking}
                className="mt-4 w-full rounded-md bg-cyan-500 py-2.5 text-[13px] font-medium text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-neutral-800 disabled:text-neutral-600"
              >
                {bookingLoading ? 'Booking...' : 'Confirm Booking'}
              </button>
              {selectedList.length > 0 && !bookingLoading && (
                <button
                  type="button"
                  onClick={() => setSelected(new Set())}
                  className="mt-2 w-full rounded-md border border-neutral-700 py-2 text-[12px] text-neutral-400 hover:text-neutral-200"
                >
                  Clear selection
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
