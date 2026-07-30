from datetime import datetime, timezone
from src.extensions import db


class Booking(db.Model):
    __tablename__ = "bookings"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer, db.ForeignKey("users.id"), nullable=True
    )
    showtime_id = db.Column(
        db.Integer, db.ForeignKey("showtimes.id"), nullable=False
    )
    booking_date = db.Column(
        db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc)
    )
    status = db.Column(db.String(20), default="confirmed")
    total_price = db.Column(db.Numeric(10, 2), nullable=True)
    created_at = db.Column(
        db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc)
    )
    updated_at = db.Column(
        db.DateTime,
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    booking_seats = db.relationship("BookingSeat", backref="booking", lazy=True)

    seats = db.relationship(
        "Seat",
        secondary="booking_seats",
        viewonly=True,
        lazy=True,
    )
