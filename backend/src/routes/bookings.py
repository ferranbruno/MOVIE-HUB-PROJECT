from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.extensions import db
from src.models import Booking, BookingSeat, Showtime, Seat, User
from src.schemas import BookingSchema
from marshmallow import ValidationError

bookings_bp = Blueprint("bookings", __name__)


@bookings_bp.route("", methods=["POST"])
@jwt_required()
def create_booking():
    data = request.get_json()
    if not data:
        return jsonify({"message": "Request body is required"}), 400

    user_id = int(get_jwt_identity())

    showtime_id = data.get("showtimeId")
    seat_ids = data.get("seatIds") or data.get("seats")

    if not all([showtime_id, seat_ids]):
        return jsonify(
            {"message": "showtimeId and seatIds are required"}
        ), 400

    showtime = Showtime.query.get(showtime_id)
    if not showtime:
        return jsonify({"message": "Showtime not found"}), 404

    booking = Booking(
        user_id=user_id,
        showtime_id=showtime_id,
        status="confirmed",
        total_price=showtime.price * len(seat_ids) if showtime.price else None,
    )
    db.session.add(booking)
    db.session.flush()

    for seat_ref in seat_ids:
        seat = None
        if isinstance(seat_ref, int) or seat_ref.isdigit():
            seat = Seat.query.get(int(seat_ref))
        else:
            seat = Seat.query.filter_by(
                cinema_id=showtime.cinema_id, seat_number=seat_ref
            ).first()
        if not seat:
            db.session.rollback()
            return jsonify({"message": f"Seat {seat_ref} not found"}), 404
        booking_seat = BookingSeat(
            booking_id=booking.id,
            seat_id=seat.id,
            seat_number=seat.seat_number,
            seat_type=seat.type,
            price=showtime.price if showtime.price else None,
        )
        db.session.add(booking_seat)

    db.session.commit()

    if user_id:
        user = User.query.get(user_id)
        if user:
            points_earned = len(seat_ids) * 20
            user.loyalty_points = (user.loyalty_points or 0) + points_earned
            db.session.commit()

    schema = BookingSchema()
    return jsonify(schema.dump(booking)), 201


@bookings_bp.route("/me", methods=["GET"])
@jwt_required()
def get_my_bookings():
    user_id = int(get_jwt_identity())
    bookings = (
        Booking.query.filter_by(user_id=user_id)
        .order_by(Booking.created_at.desc())
        .all()
    )
    schema = BookingSchema(many=True)
    return jsonify(schema.dump(bookings)), 200


@bookings_bp.route("/<int:booking_id>", methods=["DELETE"])
@jwt_required()
def cancel_booking(booking_id):
    user_id = int(get_jwt_identity())
    booking = Booking.query.filter_by(
        id=booking_id, user_id=user_id
    ).first()
    if not booking:
        return jsonify({"message": "Booking not found"}), 404

    booking.status = "cancelled"
    db.session.commit()

    schema = BookingSchema()
    return jsonify(schema.dump(booking)), 200
