from flask import Blueprint


def register_routes(app):
    from .auth import auth_bp
    from .movies import movies_bp
    from .showtimes import showtimes_bp
    from .bookings import bookings_bp
    from .cinemas import cinemas_bp
    from .users import users_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(movies_bp, url_prefix="/api/movies")
    app.register_blueprint(showtimes_bp, url_prefix="/api/showtimes")
    app.register_blueprint(bookings_bp, url_prefix="/api/bookings")
    app.register_blueprint(cinemas_bp, url_prefix="/api/cinemas")
    app.register_blueprint(users_bp, url_prefix="/api/users")
