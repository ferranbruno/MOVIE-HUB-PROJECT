import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User as UserIcon,
  Mail,
  LogOut,
  Ticket,
  MapPin,
  Clock,
  Calendar,
  Loader2,
  XCircle,
  Settings,
  Gift,
  CreditCard,
  ArrowUpRight,
  Star,
  Pencil,
  X,
} from 'lucide-react';
import useAuth from '../hooks/useAuth';

function EditProfileModal({ user, onClose, onSave }) {
  const [name, setName] = useState(user?.full_name || user?.name || '');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    await onSave(name);
    setSaving(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[15px] font-semibold text-white">Edit Profile</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={16} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-[12px] font-medium text-slate-400">Name</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-[13px] text-white focus:border-cyan-400 focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[12px] font-medium text-slate-400">Email</span>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="rounded-lg border border-white/10 bg-slate-800/50 px-3 py-2 text-[13px] text-slate-500"
            />
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-white/10 px-4 py-2 text-[13px] font-medium text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-lg bg-cyan-500 px-4 py-2 text-[13px] font-medium text-slate-950 hover:bg-cyan-400 disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const isCancelled = status === 'cancelled';
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
        isCancelled
          ? 'bg-red-500/15 text-red-300'
          : 'bg-cyan-500/15 text-cyan-300'
      }`}
    >
      {isCancelled ? 'Cancelled' : 'Confirmed'}
    </span>
  );
}

function BookingRow({ booking, onCancel, cancelling }) {
  const st = booking.showtime;
  const start = st?.start_time ? new Date(st.start_time) : null;

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-900/80 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="truncate text-[15px] font-semibold text-white">
          {st?.movie_title ?? 'Movie'}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-slate-400">
          <span className="flex items-center gap-1">
            <MapPin size={12} /> {st?.cinema_name ?? '—'}
          </span>
          {start && (
            <>
              <span className="flex items-center gap-1">
                <Calendar size={12} /> {start.toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} />{' '}
                {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </>
          )}
          <span>{booking.seats_booked} seat{booking.seats_booked !== 1 ? 's' : ''}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <StatusBadge status={booking.status} />
        {booking.status !== 'cancelled' && (
          <button
            onClick={() => onCancel(booking.id)}
            disabled={cancelling}
            className="flex items-center gap-1 rounded-full border border-white/10 px-3 py-1.5 text-[12px] font-medium text-slate-300 hover:border-red-400/50 hover:text-red-300 disabled:opacity-50"
          >
            <XCircle size={13} /> Cancel
          </button>
        )}
      </div>
    </div>
  );
}

function ProfileCard({ user, onEdit, onSettings, upcomingBooking, loyaltyPoints }) {
  const userName = user?.full_name || user?.name || 'Your name';
  const userEmail = user?.email || '';
  const userRole = user?.role || 'customer';

  return (
    <div className="overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/80 shadow-xl">
      <div
        className="relative h-28 w-full"
        style={{
          background:
            'linear-gradient(115deg, #f6a94a 0%, #f4826b 22%, #e2609e 42%, #9b6fd6 62%, #4f8fe0 82%, #3fc6e8 100%)',
        }}
      >
        <button
          onClick={onEdit}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-neutral-700 hover:bg-white"
          aria-label="Edit profile photo"
        >
          <Pencil size={14} />
        </button>
        <div className="absolute -bottom-10 left-6 h-20 w-20 overflow-hidden rounded-full border-4 border-slate-800">
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cyan-400 to-blue-500 text-2xl font-semibold text-white">
            {userName.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      <div className="px-6 pb-6 pt-14">
        <div className="mb-3 text-right">
          <p className="text-[11px] text-slate-400">Current role</p>
          <p className="text-[13px] font-medium text-white">
            {userRole === 'admin' ? 'Admin' : 'Movie fan'}
          </p>
        </div>

        <h2 className="text-lg font-semibold text-white">{userName}</h2>
        <p className="text-[13px] text-slate-400">
          {userRole === 'admin' ? 'Cinema administrator' : 'Frequent moviegoer'}
        </p>
        <p className="mt-1 flex items-center gap-1 text-[12.5px] text-slate-500">
          <Mail size={12} /> {userEmail}
        </p>

        <div className="mt-4 flex gap-2">
          <button
            onClick={onEdit}
            className="rounded-full bg-cyan-500 px-4 py-2 text-[12.5px] font-medium text-slate-950 hover:bg-cyan-400"
          >
            Edit Profile
          </button>
          <button
            onClick={onSettings}
            className="flex items-center gap-1.5 rounded-full border border-white/10 px-4 py-2 text-[12.5px] font-medium text-slate-300 hover:bg-slate-800"
          >
            <Settings size={13} /> Settings
          </button>
        </div>

        <div className="mt-5">
          <p className="mb-2 flex items-center gap-1 text-[11.5px] font-medium text-slate-400">
            Favorite genres <Star size={11} />
          </p>
          <div className="flex flex-wrap gap-1.5">
            {(user?.favorite_genres?.length ? user.favorite_genres : ['Action', 'Sci-Fi', 'Drama', 'Thriller', 'Documentary']).map((g) => (
              <span
                key={g}
                className="rounded-md bg-slate-800 px-2.5 py-1 text-[11.5px] font-medium text-slate-300"
              >
                {g}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-2">
          <Link
            to={upcomingBooking ? `/booking/${upcomingBooking.showtime?.movie_id || ''}` : '/cinemas'}
            className="rounded-xl border border-white/10 bg-slate-900 p-3 hover:border-cyan-500/50"
          >
            <div className="mb-2 flex items-start justify-between">
              <Ticket size={15} className="text-slate-400" />
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500 text-white">
                <ArrowUpRight size={12} />
              </span>
            </div>
            <p className="text-[11.5px] font-semibold text-white">Upcoming booking</p>
            <p className="mt-0.5 text-[11px] leading-snug text-slate-400">
              {upcomingBooking
                ? `${upcomingBooking.showtime?.movie_title || 'Movie'} · ${upcomingBooking.showtime ? new Date(upcomingBooking.showtime.start_time).toLocaleDateString() : ''}`
                : 'No upcoming bookings'}
            </p>
          </Link>

          <div className="rounded-xl border border-white/10 bg-slate-900 p-3">
            <div className="mb-2 flex items-start justify-between">
              <Gift size={15} className="text-slate-400" />
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500 text-white">
                <ArrowUpRight size={12} />
              </span>
            </div>
            <p className="text-[11.5px] font-semibold text-white">Loyalty points</p>
            <p className="mt-0.5 text-[11px] leading-snug text-slate-400">
              {loyaltyPoints} pts available
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-slate-900 p-3">
            <div className="mb-2 flex items-start justify-between">
              <CreditCard size={15} className="text-slate-400" />
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500 text-white">
                <ArrowUpRight size={12} />
              </span>
            </div>
            <p className="text-[11.5px] font-semibold text-white">Update payment</p>
            <p className="mt-0.5 text-[11px] leading-snug text-slate-400">
              Keep your card details current.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const { token, user, logout, isAuthenticated, setUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [localBookings, setLocalBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
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
        const movie = movieRes.ok ? await movieRes.json() : null;
        setNextShowtime({ ...st, movieTitle: movie?.title || '' });
      } catch {}
    }
    fetchNext();
  }, []);

  useEffect(() => {
    if (!nextShowtime) return;
    const id = setInterval(() => {
      const diff = new Date(nextShowtime.start_time) - new Date();
      if (diff <= 0) { setCountdown('NOW'); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setCountdown(`${h}h ${m}m`);
    }, 1000);
    return () => clearInterval(id);
  }, [nextShowtime]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('moviehub-local-bookings');
      setLocalBookings(raw ? JSON.parse(raw) : []);
    } catch {
      setLocalBookings([]);
    }
  }, []);

  useEffect(() => {
    if (!token) {
      setError('You need to log in to view your profile.');
      setLoading(false);
      return;
    }

    async function fetchPoints() {
      try {
        const res = await fetch('/api/users/loyalty-points', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setLoyaltyPoints(data.loyalty_points ?? 0);
        }
      } catch {}
    }
    fetchPoints();

    async function fetchBookings() {
      try {
        setLoading(true);
        const res = await fetch('/api/bookings/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401) throw new Error('Your session expired — please log in again.');
        if (!res.ok) throw new Error('Could not load your bookings.');
        const data = await res.json();
        setBookings(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, [token]);

  async function handleEditProfile(newName) {
    if (setUser) {
      setUser({ ...user, full_name: newName, name: newName });
    }
    localStorage.setItem('moviehub-user', JSON.stringify({ ...user, full_name: newName, name: newName }));
  }

  async function handleCancel(bookingId) {
    setCancellingId(bookingId);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Could not cancel that booking.');
      const updated = await res.json();
      setBookings((prev) => prev.map((b) => (b.id === bookingId ? updated : b)));
    } catch (err) {
      setError(err.message);
    } finally {
      setCancellingId(null);
    }
  }

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const upcoming = bookings.filter((b) => b.status !== 'cancelled');
  const cancelled = bookings.filter((b) => b.status === 'cancelled');
  const nextBooking = upcoming.length > 0 ? upcoming[0] : null;

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
        <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-slate-900/80 p-8 text-center">
          <UserIcon size={32} className="mx-auto mb-3 text-slate-500" />
          <p className="mb-1 text-[15px] font-semibold text-white">You're not logged in</p>
          <p className="mb-5 text-[13px] text-slate-400">
            Log in to view your profile and booking history.
          </p>
          <Link
            to="/login"
            className="inline-flex rounded-full bg-cyan-500 px-5 py-2.5 text-[13px] font-semibold text-slate-950 hover:bg-cyan-400"
          >
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-950/90 px-6 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Account</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">My Profile</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 self-start rounded-full border border-white/10 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-800 lg:self-auto"
          >
            <LogOut size={15} /> Log out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8 lg:px-8">
        {nextShowtime && countdown && (
          <Link
            to={`/booking/${nextShowtime.id}`}
            className="mb-6 flex items-center gap-2 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-3 text-[13px] text-cyan-200 hover:bg-cyan-500/20"
          >
            <span>Next premiere:</span>
            <span className="font-semibold">{nextShowtime.movieTitle}</span>
            <span className="text-slate-500">—</span>
            <span className="tabular-nums font-semibold">in {countdown}</span>
          </Link>
        )}
        {error && !loading && (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-[13px] text-red-300">
            {error}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ProfileCard
              user={user}
              onEdit={() => setShowEditModal(true)}
              onSettings={() => {}}
              upcomingBooking={nextBooking}
              loyaltyPoints={loyaltyPoints}
            />
          </div>

          <div>
            <div className="mb-6 flex items-center gap-3">
              <h2 className="text-[16px] font-semibold text-white">
                Booking history
              </h2>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            {loading && (
              <div className="flex items-center gap-2 py-10 text-slate-400">
                <Loader2 size={16} className="animate-spin" />
                <span className="text-[13px]">Loading your bookings…</span>
              </div>
            )}

            {!loading && (
              <>
                {upcoming.length === 0 ? (
                  <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-8 text-center text-slate-400">
                    <p className="text-[13px]">No active bookings yet.</p>
                    <Link
                      to="/cinemas"
                      className="mt-4 inline-flex rounded-full bg-cyan-500 px-4 py-2 text-[12.5px] font-semibold text-slate-950 hover:bg-cyan-400"
                    >
                      Browse cinemas
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {upcoming.map((b) => (
                      <BookingRow
                        key={b.id}
                        booking={b}
                        onCancel={handleCancel}
                        cancelling={cancellingId === b.id}
                      />
                    ))}
                  </div>
                )}

                {cancelled.length > 0 && (
                  <div className="mt-8">
                    <h3 className="mb-3 text-[14px] font-semibold text-slate-400">
                      Cancelled
                    </h3>
                    <div className="flex flex-col gap-3 opacity-60">
                      {cancelled.map((b) => (
                        <BookingRow key={b.id} booking={b} onCancel={() => {}} cancelling={false} />
                      ))}
                    </div>
                  </div>
                )}

                {localBookings.length > 0 && (
                  <div className="mt-8">
                    <h3 className="mb-3 text-[14px] font-semibold text-cyan-400">
                      Cinema bookings
                    </h3>
                    <div className="flex flex-col gap-3">
                      {localBookings.map((b) => (
                        <div key={b.id} className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-900/80 p-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="min-w-0">
                            <p className="truncate text-[15px] font-semibold text-white">{b.movie}</p>
                            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-slate-400">
                              <span className="flex items-center gap-1">
                                <MapPin size={12} /> {b.cinema}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar size={12} /> {new Date(b.date).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock size={12} /> {b.showtime}
                              </span>
                              <span>{b.seats.length} seat{b.seats.length !== 1 ? 's' : ''}: {b.seats.join(', ')}</span>
                            </div>
                          </div>
                          <span className="rounded-full bg-cyan-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-cyan-300">Offline</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {showEditModal && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEditModal(false)}
          onSave={handleEditProfile}
        />
      )}
    </div>
  );
}
