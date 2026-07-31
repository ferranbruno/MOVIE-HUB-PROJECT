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

    _ensure_seed(app)

    register_routes(app)

    return app


def _ensure_seed(app):
    """Idempotently seed demo data on first boot, serialized across workers."""
    try:
        import fcntl
    except ImportError:
        fcntl = None

    try:
        from seed import run_seed
    except ImportError:
        return

    if fcntl is not None:
        with open("/tmp/moviehub_seed.lock", "w") as lockfile:
            fcntl.flock(lockfile, fcntl.LOCK_EX)
            try:
                run_seed(app)
            finally:
                fcntl.flock(lockfile, fcntl.LOCK_UN)
    else:
        run_seed(app)
