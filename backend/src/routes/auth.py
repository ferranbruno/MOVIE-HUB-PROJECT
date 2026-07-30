import json
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, decode_token
from src.extensions import db
from src.models import User
from src.schemas import UserRegisterSchema, UserLoginSchema, UserSchema
from marshmallow import ValidationError

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/signup", methods=["POST"])
def signup():
    schema = UserRegisterSchema()
    try:
        data = schema.load(request.get_json())
    except ValidationError as err:
        return jsonify({"message": err.messages}), 400

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"message": "Email already registered"}), 409

    user = User(
        name=data["name"],
        email=data["email"],
        role=data.get("role", "user"),
        favorite_genres=json.dumps(data.get("favorite_genres") or []),
    )
    user.set_password(data["password"])
    db.session.add(user)
    db.session.commit()

    token = create_access_token(identity=str(user.id))
    user_data = UserSchema().dump(user)
    return jsonify({"token": token, "user": user_data}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    schema = UserLoginSchema()
    try:
        data = schema.load(request.get_json())
    except ValidationError as err:
        return jsonify({"message": err.messages}), 400

    user = User.query.filter_by(email=data["email"]).first()
    if not user or not user.check_password(data["password"]):
        return jsonify({"message": "Invalid email or password"}), 401

    token = create_access_token(identity=str(user.id))
    user_data = UserSchema().dump(user)
    return jsonify({"token": token, "user": user_data}), 200


@auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    data = request.get_json()
    if not data or not data.get("email"):
        return jsonify({"message": "Email is required"}), 400

    user = User.query.filter_by(email=data["email"]).first()
    if not user:
        return jsonify({"message": "If that email exists, a reset link has been sent"}), 200

    reset_token = create_access_token(
        identity=str(user.id), additional_claims={"type": "reset"}
    )
    return jsonify({"message": "Reset link sent", "resetToken": reset_token}), 200


@auth_bp.route("/reset-password", methods=["POST"])
def reset_password():
    data = request.get_json()
    if not data or not data.get("token") or not data.get("password"):
        return jsonify({"message": "Token and password are required"}), 400

    try:
        decoded = decode_token(data["token"])
        user = User.query.get(int(decoded["sub"]))
        if not user:
            return jsonify({"message": "Invalid token"}), 401
        user.set_password(data["password"])
        db.session.commit()
        return jsonify({"message": "Password reset successful"}), 200
    except Exception:
        return jsonify({"message": "Invalid or expired token"}), 401
