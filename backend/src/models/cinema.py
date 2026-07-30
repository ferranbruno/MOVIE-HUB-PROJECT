from datetime import datetime, timezone
from src.extensions import db


class Cinema(db.Model):
    __tablename__ = "cinemas"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    address = db.Column(db.String(300), nullable=True)
    city = db.Column(db.String(100), nullable=True)
    state = db.Column(db.String(100), nullable=True)
    phone = db.Column(db.String(20), nullable=True)
    created_at = db.Column(
        db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc)
    )
    updated_at = db.Column(
        db.DateTime,
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    seats = db.relationship("Seat", backref="cinema", lazy=True)
    showtimes = db.relationship("Showtime", backref="cinema", lazy=True)

    movies = db.relationship(
        "Movie",
        secondary="showtimes",
        viewonly=True,
        lazy=True,
    )
