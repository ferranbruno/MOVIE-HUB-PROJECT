from datetime import datetime, timedelta, timezone
from src import create_app
from src.extensions import db
from src.models import Genre, Movie, Cinema, Seat, Showtime, User

app = create_app()

with app.app_context():
    db.drop_all()
    db.create_all()

    # ── Genres ──
    genres = [
        Genre(name="Action"),
        Genre(name="Comedy"),
        Genre(name="Drama"),
        Genre(name="Sci-Fi"),
        Genre(name="Horror"),
        Genre(name="Animation"),
    ]
    db.session.add_all(genres)
    db.session.flush()

    genre_map = {g.name: g.id for g in genres}

    # ── Movies ──
    movies = [
        Movie(
            title="Inception",
            description="A thief who steals corporate secrets through dream-sharing technology is given the task of planting an idea into a CEO's mind.",
            duration=148,
            genre_id=genre_map["Sci-Fi"],
            rating=8.8,
            release_date=datetime(2010, 7, 16),
            poster_url="https://image.tmdb.org/t/p/w342/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
        ),
        Movie(
            title="The Dark Knight",
            description="When the menace known as the Joker wreaks havoc on Gotham, Batman must accept one of the greatest tests.",
            duration=152,
            genre_id=genre_map["Action"],
            rating=9.0,
            release_date=datetime(2008, 7, 18),
            poster_url="https://image.tmdb.org/t/p/w342/qJ2tW6WMUDux911Ba1sT0v3TkLH.jpg",
        ),
        Movie(
            title="Toy Story 4",
            description="When a new toy called Forky joins Woody and the gang, a road trip reveals how big the world can be.",
            duration=100,
            genre_id=genre_map["Animation"],
            rating=7.8,
            release_date=datetime(2019, 6, 21),
            poster_url="https://image.tmdb.org/t/p/w342/w9kR8qRmQ5B5U9lBxQ9zSfVq0oH.jpg",
        ),
        Movie(
            title="Parasite",
            description="Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
            duration=132,
            genre_id=genre_map["Drama"],
            rating=8.5,
            release_date=datetime(2019, 5, 30),
            poster_url="https://image.tmdb.org/t/p/w342/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
        ),
        Movie(
            title="Get Out",
            description="A young African-American visits his white girlfriend's parents for the weekend, where his simmering uneasiness about their reception eventually reaches a boiling point.",
            duration=104,
            genre_id=genre_map["Horror"],
            rating=7.7,
            release_date=datetime(2017, 2, 24),
            poster_url="https://image.tmdb.org/t/p/w342/1SwAV1T6V3wC2U7Tz3r6K0mPp9F.jpg",
        ),
        Movie(
            title="Superbad",
            description="Two co-dependent high school seniors are forced to deal with separation anxiety after their plan to stage a booze-soaked party goes awry.",
            duration=113,
            genre_id=genre_map["Comedy"],
            rating=7.6,
            release_date=datetime(2007, 8, 17),
            poster_url="https://image.tmdb.org/t/p/w342/8vYccWvR8kYUnMkCnMq7PsQmONH.jpg",
        ),
    ]
    db.session.add_all(movies)
    db.session.flush()

    # ── Cinemas ──
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

    # ── Seats ──
    screens = ["Screen 1", "Screen 2", "Screen 3"]
    rows = "ABCDEF"
    seats_per_row = 8

    for cinema in cinemas:
        for screen in screens:
            for row_letter in rows:
                for num in range(1, seats_per_row + 1):
                    seat = Seat(
                        cinema_id=cinema.id,
                        screen=screen,
                        seat_number=f"{row_letter}{num}",
                        row=row_letter,
                        type="standard",
                        status="available",
                    )
                    db.session.add(seat)
    db.session.flush()

    # ── Showtimes ──
    today = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    base_times = [10, 13, 16, 19, 22]

    for movie in movies:
        for cinema in cinemas:
            for hour in base_times:
                start = today + timedelta(days=1) + timedelta(hours=hour)
                end = start + timedelta(minutes=movie.duration)
                showtime = Showtime(
                    movie_id=movie.id,
                    cinema_id=cinema.id,
                    screen="Screen 1" if hour < 16 else "Screen 2",
                    start_time=start,
                    end_time=end,
                    price=1200 if hour < 16 else 1500,
                    available_seats=48,
                )
                db.session.add(showtime)

    # ── Demo User ──
    demo = User(name="Demo User", email="demo@example.com")
    demo.set_password("password123")
    db.session.add(demo)

    db.session.commit()

    print("Database seeded successfully!")
    print(f"  Genres:   {Genre.query.count()}")
    print(f"  Movies:   {Movie.query.count()}")
    print(f"  Cinemas:  {Cinema.query.count()}")
    print(f"  Seats:    {Seat.query.count()}")
    print(f"  Showtimes:{Showtime.query.count()}")
    print(f"  Users:    {User.query.count()}")
    print()
    print("Demo login:  demo@example.com / password123")
