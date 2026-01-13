from flask import Flask
from flask_cors import CORS

from .routes import api
from .db import Base, engine
from . import models  

def create_app():
    app = Flask(__name__)
    CORS(app)

    Base.metadata.create_all(bind=engine)

    app.register_blueprint(api, url_prefix="/api")
    return app
