const express = require('express');
// bodyParser not required; use express.json()
const crypto = require('crypto');

const app = express();
app.use(express.json());

const users = new Map(); // email -> { name, email, password, resetToken }

function genToken() {
  return crypto.randomBytes(20).toString('hex');
}

app.post('/api/auth/signup', (req, res) => {
  const { name, email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: 'Missing email or password' });
  if (users.has(email)) return res.status(400).json({ message: 'Email already in use' });
  const user = { name: name || '', email, password };
  users.set(email, user);
  const token = genToken();
  res.json({ token, user: { name: user.name, email: user.email } });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: 'Missing email or password' });
  const user = users.get(email);
  if (!user || user.password !== password) return res.status(401).json({ message: 'Invalid credentials' });
  const token = genToken();
  res.json({ token, user: { name: user.name, email: user.email } });
});

app.post('/api/auth/forgot-password', (req, res) => {
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ message: 'Missing email' });
  const user = users.get(email);
  if (!user) return res.json({ message: 'If an account exists, a reset email was sent.' });
  const resetToken = genToken();
  user.resetToken = resetToken;
  users.set(email, user);
  res.json({ message: 'Reset token generated (development)', resetToken });
});

app.post('/api/auth/reset-password', (req, res) => {
  const { token, password } = req.body || {};
  if (!token || !password) return res.status(400).json({ message: 'Missing token or password' });
  for (const [email, user] of users.entries()) {
    if (user.resetToken === token) {
      user.password = password;
      delete user.resetToken;
      users.set(email, user);
      return res.json({ message: 'Password reset' });
    }
  }
  return res.status(400).json({ message: 'Invalid or expired token' });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Mock auth server listening on http://localhost:${port}`));

// --- Simple movie/showtime mock data for development ---
const movies = [
  {
    id: '1',
    title: 'The Great Adventure',
    description: 'An epic journey of discovery and friendship.',
    poster: '/static/media/great-adventure.jpg',
    tagline: 'Experience the adventure of a lifetime',
  },
  {
    id: '2',
    title: 'Space Odyssey',
    description: 'A voyage beyond the stars.',
    poster: '/static/media/space-odyssey.jpg',
    tagline: 'To infinity and beyond',
  },
];

const showtimes = [
  { id: 'st1', movieId: '1', startsAt: new Date(Date.now() + 1000 * 60 * 60).toISOString(), cinemaName: 'Cineplex 1', room: 'Main' },
  { id: 'st2', movieId: '1', startsAt: new Date(Date.now() + 1000 * 60 * 60 * 3).toISOString(), cinemaName: 'Cineplex 1', room: 'VIP' },
  { id: 'st3', movieId: '2', startsAt: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(), cinemaName: 'Cineplex 2', room: 'Main' },
];

// occupied seats per showtime id
const occupied = {
  st1: ['A1', 'A2', 'B3'],
  st2: ['C4', 'D5'],
  st3: ['A1'],
};

const bookings = [];

app.get('/api/movies/:id', (req, res) => {
  const m = movies.find((x) => x.id === req.params.id);
  if (!m) return res.status(404).json({ message: 'Movie not found' });
  res.json(m);
});

app.get('/api/showtimes', (req, res) => {
  const movieId = req.query.movieId;
  if (movieId) {
    return res.json(showtimes.filter((s) => s.movieId === movieId));
  }
  res.json(showtimes);
});

app.get('/api/showtimes/:id/seats', (req, res) => {
  const id = req.params.id;
  res.json(occupied[id] || []);
});

app.post('/api/bookings', (req, res) => {
  const { movieId, showtimeId, seats, name, email } = req.body || {};
  if (!movieId || !showtimeId || !Array.isArray(seats) || seats.length === 0) {
    return res.status(400).json({ message: 'Missing booking data' });
  }
  // mark seats as occupied
  occupied[showtimeId] = Array.from(new Set([...(occupied[showtimeId] || []), ...seats]));
  const booking = { id: String(bookings.length + 1), movieId, showtimeId, seats, name, email, createdAt: new Date().toISOString() };
  bookings.push(booking);
  res.status(201).json(booking);
});
