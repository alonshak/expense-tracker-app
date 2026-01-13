from datetime import datetime
from flask import Blueprint, jsonify, request
from sqlalchemy import func
from .db import SessionLocal, engine, Base
from .models import User, Expense, Budget

api = Blueprint("api", __name__)

Base.metadata.create_all(bind=engine)


def parse_date(s: str):
    return datetime.strptime(s, "%Y-%m-%d").date()

@api.get("/health")
def health():
	return {"status": "ok"}
@api.post("/auth/register")
def register():
    data = request.get_json(force=True)

    db = SessionLocal()
    try:
        user = User(
            email=data["email"],
            password_hash=data["password"],  # hashing later
            full_name=data["full_name"],
        )
        db.add(user)
        db.commit()
        return jsonify({"id": user.id, "full_name": user.full_name}), 201
    finally:
        db.close()


@api.post("/expenses")
def create_expense():
    data = request.get_json(force=True)

    db = SessionLocal()
    try:
        exp = Expense(
            user_id=data["user_id"],
            amount=data["amount"],
            category=data["category"],
            description=data.get("description"),
            date=parse_date(data["date"]),
        )
        db.add(exp)
        db.commit()
        return jsonify({"status": "ok"}), 201
    finally:
        db.close()

@api.get("/expenses")
def list_expenses():
    user_id = int(request.args["user_id"])
    year = int(request.args["year"])
    month = int(request.args["month"])

    db = SessionLocal()
    try:
        rows = db.query(Expense).filter(
            Expense.user_id == user_id,
            func.extract("year", Expense.date) == year,
            func.extract("month", Expense.date) == month,
        ).order_by(Expense.date.desc()).all()

        return jsonify([
            {
                "id": r.id,
                "amount": float(r.amount),
                "category": r.category,
                "description": r.description,
                "date": r.date.isoformat(),
            }
            for r in rows
        ])
    finally:
        db.close()


@api.get("/overview")
def overview():
    user_id = int(request.args["user_id"])
    year = int(request.args["year"])
    month = int(request.args["month"])

    db = SessionLocal()
    try:
        expenses = db.query(
            Expense.category,
            func.coalesce(func.sum(Expense.amount), 0).label("spent"),
        ).filter(
            Expense.user_id == user_id,
            func.extract("year", Expense.date) == year,
            func.extract("month", Expense.date) == month,
        ).group_by(Expense.category).all()

        budgets = db.query(Budget).filter_by(
            user_id=user_id,
            year=year,
            month=month,
        ).all()

        budget_map = {b.category: float(b.limit_amount) for b in budgets}

        result = []
        for category, spent in expenses:
            limit_amount = budget_map.get(category)
            result.append({
                "category": category,
                "spent": float(spent),
                "limit": limit_amount,
                "remaining": None if limit_amount is None else max(limit_amount - float(spent), 0),
            })

        return jsonify(result)
    finally:
        db.close()
