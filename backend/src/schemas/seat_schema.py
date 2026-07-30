from marshmallow import fields
from src.extensions import ma
from src.models import Seat


class SeatSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Seat
        load_instance = True
        include_relationships = False

    id = fields.Integer(dump_only=True)
    cinema_id = fields.Integer(required=True)
    screen = fields.String()
    seat_number = fields.String(required=True)
    row = fields.String()
    type = fields.String()
    status = fields.String()

    cinema = fields.Nested(
        "CinemaSchema", dump_only=True, exclude=("seats", "showtimes", "movies")
    )
    bookings = fields.Nested(
        "BookingSchema",
        many=True,
        dump_only=True,
        exclude=("seats",),
    )
