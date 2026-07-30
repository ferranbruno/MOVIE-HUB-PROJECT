from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from src.models import User


def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            user_id = int(get_jwt_identity())
        except (TypeError, ValueError):
            return jsonify({"message": "Authentication required"}), 401
        user = User.query.get(user_id)
        if not user or user.role != "admin":
            return jsonify({"message": "Admin access required"}), 403
        return f(*args, **kwargs)
    return decorated_function
