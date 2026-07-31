from datetime import datetime, timezone
from src.extensions import db


class Movie(db.Model):
    __tablename__ = "movies"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    duration = db.Column(db.Integer, nullable=True)
    genre_id = db.Column(
        db.Integer, db.ForeignKey("genres.id"), nullable=True
    )
    rating = db.Column(db.Numeric(3, 1), nullable=True)
    release_date = db.Column(db.Date, nullable=True)
    poster_url = db.Column(db.String(500), nullable=True)
    trailer_key = db.Column(db.String(50), nullable=True)
    created_at = db.Column(
        db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc)
    )
    updated_at = db.Column(
        db.DateTime,
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    showtimes = db.relationship("Showtime", backref="movie", lazy=True)

    cinemas = db.relationship(
        "Cinema",
        secondary="showtimes",
        viewonly=True,
        lazy=True,
    )
