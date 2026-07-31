from marshmallow import fields
from src.extensions import ma
from src.models import Showtime
from .fields import AwareDateTime


class ShowtimeSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Showtime
        load_instance = True

    id = fields.Integer(dump_only=True)
    movie_id = fields.Integer(required=True)
    cinema_id = fields.Integer(required=True)
    screen = fields.String()
    start_time = AwareDateTime(required=True)
    end_time = AwareDateTime()
    price = fields.Decimal(as_string=True)
    available_seats = fields.Integer()
    created_at = AwareDateTime(dump_only=True)
    updated_at = AwareDateTime(dump_only=True)

    movie = fields.Nested(
        "MovieSchema",
        dump_only=True,
        exclude=("showtimes", "cinemas"),
    )
    cinema = fields.Nested(
        "CinemaSchema",
        dump_only=True,
        exclude=("showtimes", "movies", "seats"),
    )
    bookings = fields.Nested(
        "BookingSchema",
        many=True,
        dump_only=True,
        exclude=("showtime", "seats"),
    )
