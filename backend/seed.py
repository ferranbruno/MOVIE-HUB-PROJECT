from datetime import datetime, timedelta, timezone

from src import create_app
from src.extensions import db
from src.models import Genre, Movie, Cinema, Seat, Showtime, User

app = create_app()

with app.app_context():
    if Cinema.query.count() > 0 or Movie.query.count() > 0:
        print("Database already has data — skipping seed.")
        raise SystemExit

    db.create_all()

    # ── Genres ──
    genres = [
        Genre(name="Action"),
        Genre(name="Comedy"),
        Genre(name="Drama"),
        Genre(name="Sci-Fi"),
        Genre(name="Horror"),
        Genre(name="Animation"),
        Genre(name="Documentary"),
    ]
    db.session.add_all(genres)
    db.session.flush()

    genre_map = {g.name: g.id for g in genres}

    # ── Movies (one distinct movie per cinema) ──
    movies = [
        Movie(
            title="The Odyssey",
            description="Odysseus, the legendary King of Ithaca, embarks on a long and perilous journey home following the Trojan War. Throughout his voyage, he is forced to confront the whims of gods, mythological monsters, and trials that stretch both his cunning and his humanity to the breaking point.",
            duration=131,
            genre_id=genre_map["Drama"],
            rating=7.9,
            release_date=datetime(2026, 7, 15),
            poster_url="https://image.tmdb.org/t/p/w342/5rhTDKUhPYvpdQIijFIs5VoWsON.jpg",
            trailer_key="AyIZ9tiiN8I",
        ),
        Movie(
            title="Moana",
            description="Moana sets sail on an adventurous journey to save her people and discover her true identity, guided by the demigod Maui.",
            duration=107,
            genre_id=genre_map["Animation"],
            rating=7.5,
            release_date=datetime(2026, 6, 12),
            poster_url="https://image.tmdb.org/t/p/w342/4JeejGugONWpJkpnvUbLQcLmJA4.jpg",
            trailer_key="EEz5xbzYPKI",
        ),
        Movie(
            title="Spider-Man: Brand New Day",
            description="Fighting crime full-time as Spider-Man in a world that doesn't remember him—and the pressure of seeing his old friends move on without him—sparks a change in Peter Parker he may not have the power to control. But that transformation might also be the only thing that can stop a shocking new threat to the city and those he loves.",
            duration=130,
            genre_id=genre_map["Action"],
            rating=8.0,
            release_date=datetime(2026, 7, 28),
            poster_url="https://image.tmdb.org/t/p/w342/iPOn6DinuVyLY17YM9mKuPofV08.jpg",
            trailer_key="P3uI5sLosKU",
        ),
        Movie(
            title="Superman",
            description="Clark Kent must decide whether to use his incredible powers for good or retreat into the shadows, as a new threat rises over Metropolis.",
            duration=120,
            genre_id=genre_map["Action"],
            rating=6.9,
            release_date=datetime(2026, 7, 3),
            poster_url="https://image.tmdb.org/t/p/w342/zntDh5cHv9bwGTdzBRiUiXfdb9j.jpg",
            trailer_key="MikgqM0LXr4",
        ),
        Movie(
            title="Deep Water",
            description="A group of international passengers on a flight from Los Angeles to Shanghai is forced to make an emergency landing in shark-infested waters. The terrified group is forced to work together and overcome their differences if they hope to escape their sinking plane and the frenzy of sharks drawn to the wreckage.",
            duration=105,
            genre_id=genre_map["Horror"],
            rating=7.2,
            release_date=datetime(2026, 4, 30),
            poster_url="https://image.tmdb.org/t/p/w342/kjcuS7xaRyqRjVaVcH4t0qHshuX.jpg",
            trailer_key="f0ptq0Lzdh8",
        ),
        Movie(
            title="The Death of Robin Hood",
            description="Grappling with his past after a life of crime and murder, Robin Hood finds himself gravely injured after a battle he thought would be his last. In the hands of a mysterious woman, he is offered a chance at salvation.",
            duration=120,
            genre_id=genre_map["Drama"],
            rating=6.6,
            release_date=datetime(2026, 6, 18),
            poster_url="https://image.tmdb.org/t/p/w342/13MmRwmG5NmaMfU8qNrtgGXisiD.jpg",
            trailer_key="tlSDDuWxO_0",
        ),
    ]
    db.session.add_all(movies)
    db.session.flush()

    # ── Cinemas (each shows exactly one movie) ──
    cinemas = [
        Cinema(
            name="Nyali Cinemax",
            address="Nyali Road",
            city="Mombasa",
            state="Mombasa",
            phone="+254 41 000 0000",
        ),
        Cinema(
            name="Prestige Cinemas",
            address="Prestige Plaza, Ngong Road",
            city="Nairobi",
            state="Nairobi",
            phone="+254 20 000 0000",
        ),
        Cinema(
            name="Anga Sky Cinemas",
            address="Sky City Mall, Langata Road",
            city="Nairobi",
            state="Nairobi",
            phone="+254 20 000 0000",
        ),
        Cinema(
            name="Century Cinemax",
            address="The Junction Mall, Ngong Road",
            city="Nairobi",
            state="Nairobi",
            phone="+254 20 000 0000",
        ),
        Cinema(
            name="Silverbird Cinemas",
            address="Galleria Mall, Langata Road",
            city="Nairobi",
            state="Nairobi",
            phone="+254 20 000 0000",
        ),
        Cinema(
            name="Fox Cineplex",
            address="Carnival Center, Mombasa Road",
            city="Nairobi",
            state="Nairobi",
            phone="+254 20 000 0000",
        ),
    ]
    db.session.add_all(cinemas)
    db.session.flush()

    # ── Seats (40 per cinema, Screen 1) ──
    rows = "ABCDE"
    for cinema in cinemas:
        for row_letter in rows:
            for num in range(1, 9):
                seat = Seat(
                    cinema_id=cinema.id,
                    screen="Screen 1",
                    seat_number=f"{row_letter}{num}",
                    row=row_letter,
                    type="standard",
                    status="available",
                )
                db.session.add(seat)
    db.session.flush()

    # ── Showtimes (one movie per cinema, matinee + evening) ──
    today = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    schedule = [
        (0, [12, 18]),  # Nyali Cinemax        -> The Odyssey
        (1, [13, 19]),  # Prestige Cinemas     -> Moana
        (2, [12, 18]),  # Anga Sky Cinemas     -> Spider-Man
        (3, [14, 20]),  # Century Cinemax      -> Superman
        (4, [11, 17]),  # Silverbird Cinemas   -> Deep Water
        (5, [13, 19]),  # Fox Cineplex         -> The Death of Robin Hood
    ]
    for cinema_idx, hours in schedule:
        movie = movies[cinema_idx]
        cinema = cinemas[cinema_idx]
        for hour in hours:
            start = today + timedelta(days=1) + timedelta(hours=hour)
            end = start + timedelta(minutes=(movie.duration or 120))
            db.session.add(
                Showtime(
                    movie_id=movie.id,
                    cinema_id=cinema.id,
                    screen="Screen 1",
                    start_time=start,
                    end_time=end,
                    price=1200 if hour < 16 else 1500,
                    available_seats=40,
                )
            )

    # ── Demo User ──
    demo = User(name="Demo User", email="demo@example.com")
    demo.set_password("password123")
    db.session.add(demo)

    db.session.commit()

    print("Database seeded successfully!")
    print(f"  Genres:    {Genre.query.count()}")
    print(f"  Movies:    {Movie.query.count()}")
    print(f"  Cinemas:   {Cinema.query.count()}")
    print(f"  Seats:     {Seat.query.count()}")
    print(f"  Showtimes: {Showtime.query.count()}")
    print(f"  Users:     {User.query.count()}")
    print()
    print("Demo login:  demo@example.com / password123")
