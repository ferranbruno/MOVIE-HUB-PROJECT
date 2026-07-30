from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from src.extensions import db
from src.models import Cinema, Showtime, Booking, BookingSeat, Seat
from src.schemas import CinemaSchema
from src.decorators import admin_required

cinemas_bp = Blueprint("cinemas", __name__)


@cinemas_bp.route("", methods=["GET"])
def get_cinemas():
    cinemas = Cinema.query.all()
    schema = CinemaSchema(many=True)
    return jsonify(schema.dump(cinemas)), 200


@cinemas_bp.route("", methods=["POST"])
@jwt_required()
@admin_required
def create_cinema():
    data = request.get_json()
    if not data or not data.get("name"):
        return jsonify({"message": "Name is required"}), 400

    existing = Cinema.query.filter_by(name=data["name"]).first()
    if existing:
        schema = CinemaSchema()
        return jsonify(schema.dump(existing)), 200

    cinema = Cinema(name=data["name"])
    db.session.add(cinema)
    db.session.commit()

    schema = CinemaSchema()
    return jsonify(schema.dump(cinema)), 201


@cinemas_bp.route("/<int:cinema_id>", methods=["DELETE"])
@jwt_required()
@admin_required
def delete_cinema(cinema_id):
    cinema = Cinema.query.get(cinema_id)
    if not cinema:
        return jsonify({"message": "Cinema not found"}), 404

    showtimes = Showtime.query.filter_by(cinema_id=cinema_id).all()
    for st in showtimes:
        bookings = Booking.query.filter_by(showtime_id=st.id).all()
        for b in bookings:
            BookingSeat.query.filter_by(booking_id=b.id).delete()
            db.session.delete(b)
        db.session.delete(st)
    Seat.query.filter_by(cinema_id=cinema_id).delete()
    db.session.delete(cinema)
    db.session.commit()
    return jsonify({"message": "Cinema deleted"}), 200
