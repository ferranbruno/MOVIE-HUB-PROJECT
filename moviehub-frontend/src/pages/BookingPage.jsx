import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, MapPin, Calendar, Clock } from 'lucide-react';

const SEAT_ROWS = ['A', 'B', 'C', 'D', 'E'];
const SEAT_COLS = 8;

export default function BookingPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [assignments] = useState(() => {
    if (typeof window === 'undefined') return {};
    try {
      return JSON.parse(localStorage.getItem('moviehub-assignments') || '{}');
    } catch {
      return {};
    }
  });

  const cinema = (() => {
    if (!id) return null;
    const [movieId, entryIndex] = id.split('-');
    const entries = assignments[movieId] || [];
    const entry = entries[entryIndex];
    if (!entry) return null;

    return {
      id,
      name: entry.cinema,
      logoBg: 'bg-cyan-100 text-cyan-600',
      logo: '🎬',
      movie: entry.title,
      genre: entry.release_date ? `Release ${new Date(entry.release_date).getFullYear()}` : 'Added movie',
      duration: 'Showtime',
      date: 'Now',
      showtimes: [entry.showtime],
      price: entry.price,
      screen: 'Screen 1',
    };
  })();
  const [selected, setSelected] = useState(new Set());
  const [activeShowtime, setActiveShowtime] = useState(cinema?.showtimes?.[0] ?? '');
  const [bookedSeats, setBookedSeats] = useState(() => {
    if (typeof window === 'undefined') return {};
    return JSON.parse(localStorage.getItem('moviehub-booked-seats') || '{}');
  });
  const [confirmation, setConfirmation] = useState('');

  useEffect(() => {
    setActiveShowtime(cinema?.showtimes?.[0] ?? '');
    setSelected(new Set());
  }, [cinema]);

  useEffect(() => {
    localStorage.setItem('moviehub-booked-seats', JSON.stringify(bookedSeats));
  }, [bookedSeats]);

  const currentBooked = cinema ? bookedSeats[cinema.id] || [] : [];

  function toggleSeat(id) {
    if (currentBooked.includes(id)) return;
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const selectedList = Array.from(selected).sort();
  const pricePerSeat = parseFloat(cinema?.price?.replace('$', '') || '0');
  const total = selectedList.length * pricePerSeat;

  function handleBooking() {
    if (selectedList.length === 0) return;
    const nextBooked = Array.from(new Set([...currentBooked, ...selectedList]));
    setBookedSeats((prev) => ({
      ...prev,
      [cinema.id]: nextBooked,
    }));
    setSelected(new Set());
    setConfirmation(`Booked ${selectedList.length} seat(s) for ${cinema.movie}.`);
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
            <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg text-xl ${cinema?.logoBg ?? 'bg-slate-700 text-slate-300'}`}>
              {cinema?.logo ?? '🎬'}
            </div>
            <div>
              <p className="text-[16px] font-semibold text-white">{cinema?.movie ?? 'Cinema not found'}</p>
              <p className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[12px] text-neutral-500">
                <span className="flex items-center gap-1">
                  <MapPin size={11} /> {cinema.name}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={11} /> {cinema.date}
                </span>
                <span>{cinema.screen}</span>
                <span>{cinema.genre}</span>
                <span className="flex items-center gap-1">
                  <Clock size={11} /> {cinema.duration}
                </span>
              </p>
            </div>
          </div>

          {cinema ? (
            <div className="flex flex-wrap gap-2">
              {cinema.showtimes.map((t) => (
              <button
                key={t}
                onClick={() => {
                  setActiveShowtime(t);
                  setSelected(new Set());
                }}
                className={`rounded-md px-3 py-1.5 text-[12px] font-medium transition-colors ${
                  t === activeShowtime
                    ? 'bg-cyan-500 text-slate-950'
                    : 'border border-neutral-700 text-neutral-400 hover:border-neutral-500'
                }`}
              >
                {t}
              </button>
              ))}
            </div>
          ) : null}
        </div>
      </header>

      <div className="px-8 py-8">
        <p className="mb-6 text-[13px] text-neutral-500">Rows: A–E · Columns: 1–{SEAT_COLS}</p>
        {!cinema && (
          <div className="mb-6 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
            No added cinema assignment was found for this booking link.
          </div>
        )}
        {cinema && currentBooked.length > 0 && (
          <div className="mb-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-300">
            {cinema.name} already has booked seats: {currentBooked.join(', ')}
          </div>
        )}
        {cinema && confirmation && (
          <div className="mb-4 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-200">
            {confirmation}
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
                    const isBookedSeat = currentBooked.includes(seatId);
                    return (
                      <button
                        key={seatId}
                        type="button"
                        disabled={isBookedSeat}
                        onClick={() => toggleSeat(seatId)}
                        className={`h-12 w-20 rounded-md text-[12px] font-medium transition-colors ${
                          isBookedSeat
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
                  <span>Showtime</span>
                  <span className="font-semibold text-neutral-200">{activeShowtime}</span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span>Seats selected</span>
                  <span className="font-semibold text-neutral-200">{selectedList.length}</span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span>Price per seat</span>
                  <span className="font-semibold text-neutral-200">{cinema.price}</span>
                </div>
                <div className="flex justify-between border-t border-neutral-800 pt-2 text-[14px]">
                  <span className="font-medium text-neutral-300">Total</span>
                  <span className="font-semibold text-white">${total.toFixed(2)}</span>
                </div>
              </div>
              <button
                type="button"
                  disabled={!cinema || selectedList.length === 0}
                onClick={handleBooking}
                className="mt-4 w-full rounded-md bg-cyan-500 py-2.5 text-[13px] font-medium text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-neutral-800 disabled:text-neutral-600"
              >
                Continue to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
