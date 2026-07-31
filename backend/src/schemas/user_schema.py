from marshmallow import fields
from src.extensions import ma
from src.models import User
from .fields import AwareDateTime


class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True
        exclude = ("password_hash",)

    id = fields.Integer(dump_only=True)
    name = fields.String(required=True)
    email = fields.Email(required=True)
    role = fields.String(dump_only=True)
    loyalty_points = fields.Integer(dump_only=True)
    favorite_genres = fields.Method("get_favorite_genres", dump_only=True)

    def get_favorite_genres(self, obj):
        import json
        if not obj.favorite_genres:
            return []
        try:
            return json.loads(obj.favorite_genres)
        except (json.JSONDecodeError, TypeError):
            return []

    created_at = AwareDateTime(dump_only=True)
    updated_at = AwareDateTime(dump_only=True)
    bookings = fields.Nested(
        "BookingSchema", many=True, dump_only=True, exclude=("user",)
    )
    password_reset_tokens = fields.Nested(
        "PasswordResetTokenSchema",
        many=True,
        dump_only=True,
    )


class PasswordResetTokenSchema(ma.Schema):
    id = fields.Integer(dump_only=True)
    token = fields.String(dump_only=True)
    expires_at = AwareDateTime(dump_only=True)
    created_at = AwareDateTime(dump_only=True)


class UserRegisterSchema(ma.Schema):
    name = fields.String(required=True)
    email = fields.Email(required=True)
    password = fields.String(required=True, load_only=True)
    role = fields.String(load_default="user")
    favorite_genres = fields.List(fields.String(), load_default=[], data_key="favoriteGenres")


class UserLoginSchema(ma.Schema):
    email = fields.Email(required=True)
    password = fields.String(required=True)
