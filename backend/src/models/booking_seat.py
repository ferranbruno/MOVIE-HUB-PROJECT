from datetime import datetime, timezone
from src.extensions import db


class BookingSeat(db.Model):
    __tablename__ = "booking_seats"

    id = db.Column(db.Integer, primary_key=True)
    booking_id = db.Column(
        db.Integer, db.ForeignKey("bookings.id"), nullable=False
    )
    seat_id = db.Column(
        db.Integer, db.ForeignKey("seats.id"), nullable=False
    )
    seat_number = db.Column(db.String(10), nullable=True)
    seat_type = db.Column(db.String(20), default="standard")
    price = db.Column(db.Numeric(8, 2), nullable=True)
    created_at = db.Column(
        db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc)
    )
    updated_at = db.Column(
        db.DateTime,
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
