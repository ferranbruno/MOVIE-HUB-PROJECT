from flask import Flask
from .config import Config
from .extensions import db, migrate, jwt, cors, ma
from .routes import register_routes


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    cors.init_app(app)
    ma.init_app(app)

    with app.app_context():
        db.create_all()

    register_routes(app)

    return app


