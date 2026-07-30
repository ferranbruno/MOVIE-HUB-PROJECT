from marshmallow import fields
from src.extensions import ma
from src.models import Cinema


class CinemaSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Cinema
        load_instance = True

    id = fields.Integer(dump_only=True)
    name = fields.String(required=True)
    address = fields.String()
    city = fields.String()
    state = fields.String()
    phone = fields.String()
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

    seats = fields.Nested(
        "SeatSchema", many=True, dump_only=True, exclude=("cinema",)
    )
    showtimes = fields.Nested(
        "ShowtimeSchema", many=True, dump_only=True, exclude=("cinema", "movie")
    )
    movies = fields.Nested(
        "MovieSchema",
        many=True,
        dump_only=True,
        exclude=("cinemas", "showtimes"),
    )
