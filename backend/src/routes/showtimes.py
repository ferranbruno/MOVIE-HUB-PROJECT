from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from src.models import Showtime, BookingSeat, Booking, Seat, Cinema
from src.schemas import ShowtimeSchema
from src.extensions import db
from src.decorators import admin_required

showtimes_bp = Blueprint("showtimes", __name__)


def ensure_cinema_seats(cinema_id, screen="Screen 1"):
    existing = Seat.query.filter_by(cinema_id=cinema_id).count()
    if existing > 0:
        return
    cinema = Cinema.query.get(cinema_id)
    if not cinema:
        return
    import string
    rows = list(string.ascii_uppercase[:5])
    for row_letter in rows:
        for col in range(1, 9):
            seat = Seat(
                cinema_id=cinema_id,
                screen=screen,
                seat_number=f"{row_letter}{col}",
                row=row_letter,
                type="standard",
            )
            db.session.add(seat)
    db.session.commit()


@showtimes_bp.route("", methods=["POST"])
@jwt_required()
@admin_required
def create_showtime():
    data = request.get_json()
    if not data:
        return jsonify({"message": "Request body is required"}), 400

    movie_id = data.get("movie_id")
    cinema_id = data.get("cinema_id")
    start_time = data.get("start_time")
    price = data.get("price")

    if not all([movie_id, cinema_id, start_time, price]):
        return jsonify({"message": "movie_id, cinema_id, start_time, and price are required"}), 400

    from datetime import datetime
    try:
        start_dt = datetime.fromisoformat(start_time) if isinstance(start_time, str) else start_time
    except (ValueError, TypeError):
        return jsonify({"message": "Invalid start_time format"}), 400

    ensure_cinema_seats(cinema_id, screen=data.get("screen", "Screen 1"))

    showtime = Showtime(
        movie_id=movie_id,
        cinema_id=cinema_id,
        screen=data.get("screen", "Screen 1"),
        start_time=start_dt,
        price=price,
    )
    db.session.add(showtime)
    db.session.commit()

    schema = ShowtimeSchema()
    return jsonify(schema.dump(showtime)), 201


@showtimes_bp.route("", methods=["GET"])
def get_showtimes():
    query = Showtime.query
    movie_id = request.args.get("movieId")
    if movie_id:
        query = query.filter_by(movie_id=int(movie_id))
    cinema_id = request.args.get("cinemaId")
    if cinema_id:
        query = query.filter_by(cinema_id=int(cinema_id))

    showtimes = query.all()
    schema = ShowtimeSchema(many=True)
    return jsonify(schema.dump(showtimes)), 200


@showtimes_bp.route("/<int:showtime_id>", methods=["GET"])
def get_showtime(showtime_id):
    showtime = Showtime.query.get(showtime_id)
    if not showtime:
        return jsonify({"message": "Showtime not found"}), 404
    schema = ShowtimeSchema()
    return jsonify(schema.dump(showtime)), 200


@showtimes_bp.route("/<int:showtime_id>/seats", methods=["GET"])
def get_occupied_seats(showtime_id):
    showtime = Showtime.query.get(showtime_id)
    if not showtime:
        return jsonify({"message": "Showtime not found"}), 404

    seat_numbers = (
        db.session.query(Seat.seat_number)
        .join(BookingSeat, BookingSeat.seat_id == Seat.id)
        .join(Booking, BookingSeat.booking_id == Booking.id)
        .filter(
            Booking.showtime_id == showtime_id,
            Booking.status == "confirmed",
        )
        .all()
    )
    return jsonify([sn for (sn,) in seat_numbers]), 200


@showtimes_bp.route("/<int:showtime_id>/occupied", methods=["GET"])
def get_occupied_fallback(showtime_id):
    return get_occupied_seats(showtime_id)


@showtimes_bp.route("/<int:showtime_id>/booked", methods=["GET"])
def get_booked_fallback(showtime_id):
    return get_occupied_seats(showtime_id)


@showtimes_bp.route("/<int:showtime_id>", methods=["DELETE"])
@jwt_required()
@admin_required
def delete_showtime(showtime_id):
    showtime = Showtime.query.get(showtime_id)
    if not showtime:
        return jsonify({"message": "Showtime not found"}), 404

    Booking.query.filter_by(showtime_id=showtime_id).delete()
    db.session.delete(showtime)
    db.session.commit()
    return jsonify({"message": "Showtime deleted"}), 200
