import os

class Config:
    DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@db:5432/expenses")
    FLASK_ENV = os.getenv("FLASK_ENV", "production")
