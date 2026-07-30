from datetime import datetime, timezone
from src.extensions import db


class Showtime(db.Model):
    __tablename__ = "showtimes"

    id = db.Column(db.Integer, primary_key=True)
    movie_id = db.Column(
        db.Integer, db.ForeignKey("movies.id"), nullable=False
    )
    cinema_id = db.Column(
        db.Integer, db.ForeignKey("cinemas.id"), nullable=False
    )
    screen = db.Column(db.String(50), nullable=True)
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=True)
    price = db.Column(db.Numeric(8, 2), nullable=True)
    available_seats = db.Column(db.Integer, nullable=True)
    created_at = db.Column(
        db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc)
    )
    updated_at = db.Column(
        db.DateTime,
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    bookings = db.relationship("Booking", backref="showtime", lazy=True)
