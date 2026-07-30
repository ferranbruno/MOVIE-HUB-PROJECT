from marshmallow import fields, post_dump
from src.extensions import ma
from src.models import Booking


class BookingSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Booking
        load_instance = True

    id = fields.Integer(dump_only=True)
    user_id = fields.Integer(required=True)
    showtime_id = fields.Integer(required=True)
    booking_date = fields.DateTime(dump_only=True)
    status = fields.String()
    total_price = fields.Decimal(as_string=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

    user = fields.Nested(
        "UserSchema",
        dump_only=True,
        exclude=("bookings", "password_reset_tokens"),
    )
    showtime = fields.Nested(
        "ShowtimeSchema",
        dump_only=True,
        exclude=("bookings",),
    )
    seats = fields.Nested(
        "SeatSchema",
        many=True,
        dump_only=True,
        exclude=("bookings", "cinema"),
    )

    @post_dump
    def flatten_showtime(self, data, many, **kwargs):
        st = data.pop("showtime", None)
        if st:
            movie = st.pop("movie", {}) or {}
            cinema = st.pop("cinema", {}) or {}
            data["showtime"] = {
                "movie_title": movie.get("title"),
                "cinema_name": cinema.get("name"),
                "start_time": st.get("start_time"),
                "movie_id": st.get("movie_id"),
            }
        seats = data.pop("seats", None) or []
        data["seats_booked"] = len(seats)
        return data
