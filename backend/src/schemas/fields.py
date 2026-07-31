from datetime import timezone

from marshmallow import fields


class AwareDateTime(fields.DateTime):
    """DateTime field that serializes naive values as UTC with an explicit offset.

    The app stores datetimes in UTC (e.g. from JS ``toISOString()`` or
    ``datetime.now(timezone.utc)``). SQLite does not preserve tzinfo, so values
    come back naive. Treating them as UTC and emitting an offset avoids clients
    misinterpreting them as local time.
    """

    def _serialize(self, value, attr, obj, **kwargs):
        if value is not None and value.tzinfo is None:
            value = value.replace(tzinfo=timezone.utc)
        return super()._serialize(value, attr, obj, **kwargs)
