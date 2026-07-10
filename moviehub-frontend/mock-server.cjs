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
