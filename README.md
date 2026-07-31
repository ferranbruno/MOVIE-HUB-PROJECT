# Movie Hub

A full-stack cinema booking application built with **React (Vite)** on the frontend and **Flask** on the backend. Users can browse movies, view showtimes, book seats, and earn loyalty points. Admins can add movies, manage showtimes, and moderate content.

---

## Features

### User Features
- Browse TMDB movies and add them to cinemas (admin only)
- View upcoming showtimes grouped by cinema
- Interactive seat selection with real-time availability
- Book and cancel reservations
- Earn **20 loyalty points** per seat booked
- View booking history and profile (favorite genres, role)
- Password reset flow

### Admin Features
- Create movies, showtimes, and cinemas
- Delete showtimes from the cinemas page
- Role-based access control (`admin_required` decorator)

---

## Tech Stack

| Layer   | Technology                          |
| ------- | ----------------------------------- |
| Frontend | React 19, Vite, Tailwind CSS, React Router |
| Backend  | Python 3, Flask, SQLAlchemy, Flask-JWT-Extended |
| Database | SQLite (development)                |
| Auth     | JWT (JSON Web Tokens)               |

---

## Project Structure

```
moviehub-frontend/         React SPA
  src/
    api/                   API client helpers
    components/            Reusable UI (Header, BookingForm, etc.)
    context/               Auth context (AuthContext)
    pages/                 Route-level page components
    routes/                Route config + PrivateRoute guard
    hooks/                 Custom hooks (useAuth)

backend/                   Flask REST API
  src/
    models/                SQLAlchemy models (User, Movie, Showtime, etc.)
    routes/                Blueprint route files (auth, movies, showtimes, etc.)
    schemas/               Marshmallow serializers
    decorators.py          admin_required decorator
  run.py                   Entry point
  seed.py                  Database seeder
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- pip

### 1. Clone & Install Frontend

```bash
cd moviehub-frontend
npm install
```

### 2. Set up Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 3. Configure Environment

Create `backend/.env`:

```
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret
DATABASE_URL=sqlite:///moviehub.db
```

Create `moviehub-frontend/.env`:

```
VITE_TMDB_API_KEY=your_tmdb_api_key
```

### 4. Seed the Database

```bash
cd backend
source venv/bin/activate
python seed.py
```

### 5. Run

Terminal 1 — Backend (port 4000):

```bash
cd backend
source venv/bin/activate
python run.py
```

Terminal 2 — Frontend (port 3000):

```bash
cd moviehub-frontend
npm run dev
```

Open **http://localhost:3000**.

> The Vite dev server proxies `/api/*` requests to `http://localhost:4000`.

---

## API Endpoints

| Method | Endpoint                          | Auth     | Role    | Description             |
| ------ | --------------------------------- | -------- | ------- | ----------------------- |
| POST   | `/api/auth/signup`                | —        | —       | Register a new user     |
| POST   | `/api/auth/login`                 | —        | —       | Log in                  |
| POST   | `/api/auth/forgot-password`       | —        | —       | Request password reset  |
| POST   | `/api/auth/reset-password`        | —        | —       | Reset password          |
| GET    | `/api/movies`                     | —        | —       | List all movies         |
| GET    | `/api/movies/:id`                 | —        | —       | Get movie details       |
| POST   | `/api/movies`                     | JWT      | Admin   | Create a movie          |
| PUT    | `/api/movies/:id`                 | JWT      | Admin   | Update a movie          |
| DELETE | `/api/movies/:id`                 | JWT      | Admin   | Delete a movie          |
| GET    | `/api/cinemas`                    | —        | —       | List all cinemas        |
| POST   | `/api/cinemas`                    | JWT      | Admin   | Create a cinema         |
| DELETE | `/api/cinemas/:id`                | JWT      | Admin   | Delete a cinema         |
| GET    | `/api/showtimes`                  | —        | —       | List all showtimes      |
| GET    | `/api/showtimes/:id`              | —        | —       | Get showtime details    |
| POST   | `/api/showtimes`                  | JWT      | Admin   | Create a showtime       |
| DELETE | `/api/showtimes/:id`              | JWT      | Admin   | Delete a showtime       |
| GET    | `/api/showtimes/:id/seats`        | —        | —       | Get occupied seat numbers |
| POST   | `/api/bookings`                   | JWT      | —       | Create a booking        |
| GET    | `/api/bookings/me`                | JWT      | —       | Get current user's bookings |
| DELETE | `/api/bookings/:id`               | JWT      | —       | Cancel a booking        |
| GET    | `/api/users/loyalty-points`       | JWT      | —       | Get loyalty points      |
| PUT    | `/api/users/profile`              | JWT      | —       | Update profile          |

---

## Database Models

| Model             | Table               | Columns (excl. PK) | Relationships                          |
| ----------------- | ------------------- | ------------------ | -------------------------------------- |
| User              | users               | 8                  | bookings, password_reset_tokens        |
| PasswordResetToken| password_reset_tokens| 5                  | (belongs to User)                      |
| Genre             | genres              | 4                  | movies                                 |
| Movie             | movies              | 9                  | showtimes, cinemas (M:M via showtimes) |
| Cinema            | cinemas             | 7                  | seats, showtimes, movies (M:M via showtimes) |
| Seat              | seats               | 6                  | booking_seats, bookings (M:M via booking_seats) |
| Showtime          | showtimes           | 9                  | bookings                               |
| Booking           | bookings            | 7                  | booking_seats, seats (M:M via booking_seats) |
| BookingSeat       | booking_seats       | 7                  | (join table)                           |

---

## Requirements Checklist

### Frontend
- [x] Built with React
- [x] 8+ routes (11 total)
- [x] 5+ protected routes
- [x] Password reset flow
- [x] Single HTML file (SPA, no full-page redirects)
- [x] Professional UI (dark theme, consistent styling)

### Backend
- [x] 8+ endpoints (2 per HTTP method)
- [x] 5+ auth-protected endpoints
- [x] JSON data format
- [x] JWT authentication

### Database
- [x] 4+ models (9 total)
- [x] 4+ columns per model (minimum 4 excluding PK)
- [x] 2+ one-to-many relationships
- [x] 1+ many-to-many relationship

### Repository
- [x] MIT License
- [x] Detailed README

---

## License

[MIT](LICENSE)
