import json
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.extensions import db
from src.models import User

users_bp = Blueprint("users", __name__)


@users_bp.route("/loyalty-points", methods=["GET"])
@jwt_required()
def get_loyalty_points():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404
    return jsonify({"loyalty_points": user.loyalty_points or 0}), 200


@users_bp.route("/profile", methods=["PUT"])
@jwt_required()
def update_profile():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    data = request.get_json()
    if not data:
        return jsonify({"message": "Request body is required"}), 400

    if "name" in data:
        user.name = data["name"]
    if "favoriteGenres" in data:
        user.favorite_genres = json.dumps(data["favoriteGenres"])
    if "role" in data:
        user.role = data["role"]

    db.session.commit()
    from src.schemas import UserSchema
    return jsonify(UserSchema().dump(user)), 200
