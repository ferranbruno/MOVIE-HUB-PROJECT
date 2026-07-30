from marshmallow import fields
from src.extensions import ma
from src.models import BookingSeat


class BookingSeatSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = BookingSeat
        load_instance = True

    id = fields.Integer(dump_only=True)
    booking_id = fields.Integer(required=True)
    seat_id = fields.Integer(required=True)
    seat_number = fields.String()
    seat_type = fields.String()
    price = fields.Decimal(as_string=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

    booking = fields.Nested(
        "BookingSchema",
        dump_only=True,
        exclude=("seats",),
    )
    seat = fields.Nested(
        "SeatSchema",
        dump_only=True,
        exclude=("bookings",),
    )
