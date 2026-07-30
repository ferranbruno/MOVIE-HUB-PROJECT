from marshmallow import fields
from src.extensions import ma
from src.models import Movie


class MovieSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Movie
        load_instance = True

    id = fields.Integer(dump_only=True)
    title = fields.String(required=True)
    description = fields.String()
    duration = fields.Integer()
    genre_id = fields.Integer()
    rating = fields.Decimal(as_string=True)
    release_date = fields.Date()
    poster_url = fields.String()
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

    genre = fields.Nested("GenreSchema", dump_only=True, exclude=("movies",))
    showtimes = fields.Nested(
        "ShowtimeSchema", many=True, dump_only=True, exclude=("movie",)
    )
    cinemas = fields.Nested(
        "CinemaSchema",
        many=True,
        dump_only=True,
        exclude=("movies", "showtimes"),
    )
