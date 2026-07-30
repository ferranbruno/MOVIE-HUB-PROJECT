from datetime import datetime, date

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from src.extensions import db
from src.models import Movie
from src.schemas import MovieSchema
from src.decorators import admin_required

movies_bp = Blueprint("movies", __name__)


@movies_bp.route("", methods=["GET"])
def get_movies():
    movies = Movie.query.all()
    schema = MovieSchema(many=True)
    return jsonify(schema.dump(movies)), 200


@movies_bp.route("", methods=["POST"])
@jwt_required()
@admin_required
def create_movie():
    data = request.get_json()
    if not data or not data.get("title"):
        return jsonify({"message": "Title is required"}), 400

    existing = Movie.query.filter_by(title=data["title"]).first()
    if existing:
        schema = MovieSchema()
        return jsonify(schema.dump(existing)), 200

    release_date = data.get("release_date")
    if isinstance(release_date, str):
        try:
            release_date = date.fromisoformat(release_date)
        except (ValueError, TypeError):
            release_date = None

    movie = Movie(
        title=data["title"],
        description=data.get("description", ""),
        poster_url=data.get("poster_url"),
        release_date=release_date,
        rating=data.get("rating"),
        duration=data.get("duration"),
    )
    db.session.add(movie)
    db.session.commit()

    schema = MovieSchema()
    return jsonify(schema.dump(movie)), 201


@movies_bp.route("/<int:movie_id>", methods=["GET"])
def get_movie(movie_id):
    movie = Movie.query.get(movie_id)
    if not movie:
        return jsonify({"message": "Movie not found"}), 404
    schema = MovieSchema()
    return jsonify(schema.dump(movie)), 200


@movies_bp.route("/<int:movie_id>", methods=["PUT"])
@jwt_required()
@admin_required
def update_movie(movie_id):
    movie = Movie.query.get(movie_id)
    if not movie:
        return jsonify({"message": "Movie not found"}), 404

    data = request.get_json()
    if not data:
        return jsonify({"message": "Request body is required"}), 400

    if "title" in data:
        movie.title = data["title"]
    if "description" in data:
        movie.description = data["description"]
    if "rating" in data:
        movie.rating = data["rating"]
    if "duration" in data:
        movie.duration = data["duration"]
    if "poster_url" in data:
        movie.poster_url = data["poster_url"]
    if "release_date" in data:
        try:
            movie.release_date = date.fromisoformat(data["release_date"])
        except (ValueError, TypeError):
            pass

    db.session.commit()
    schema = MovieSchema()
    return jsonify(schema.dump(movie)), 200


@movies_bp.route("/<int:movie_id>", methods=["DELETE"])
@jwt_required()
@admin_required
def delete_movie(movie_id):
    movie = Movie.query.get(movie_id)
    if not movie:
        return jsonify({"message": "Movie not found"}), 404

    db.session.delete(movie)
    db.session.commit()
    return jsonify({"message": "Movie deleted"}), 200
