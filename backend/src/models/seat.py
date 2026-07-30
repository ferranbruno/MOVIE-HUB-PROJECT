from src.extensions import db


class Seat(db.Model):
    __tablename__ = "seats"

    id = db.Column(db.Integer, primary_key=True)
    cinema_id = db.Column(
        db.Integer, db.ForeignKey("cinemas.id"), nullable=False
    )
    screen = db.Column(db.String(50), nullable=True)
    seat_number = db.Column(db.String(10), nullable=False)
    row = db.Column(db.String(5), nullable=True)
    type = db.Column(db.String(20), default="standard")
    status = db.Column(db.String(20), default="available")

    booking_seats = db.relationship("BookingSeat", backref="seat", lazy=True)

    bookings = db.relationship(
        "Booking",
        secondary="booking_seats",
        viewonly=True,
        lazy=True,
    )
