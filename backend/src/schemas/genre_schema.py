from marshmallow import fields
from src.extensions import ma
from src.models import Genre


class GenreSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Genre
        load_instance = True

    id = fields.Integer(dump_only=True)
    name = fields.String(required=True)
    movies = fields.Nested(
        "MovieSchema", many=True, dump_only=True, exclude=("genre",)
    )
