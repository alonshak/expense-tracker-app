from datetime import datetime
from flask import Blueprint, jsonify, request
from sqlalchemy import func
from werkzeug.security import generate_password_hash, check_password_hash
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
            password_hash=generate_password_hash(data["password"]),
            full_name=data["full_name"],
        )
        db.add(user)
        db.commit()
        return jsonify({"id": user.id, "full_name": user.full_name}), 201
    finally:
        db.close()


@api.post("/auth/login")
def login():
    data = request.get_json(force=True)

    db = SessionLocal()
    try:
        user = db.query(User).filter_by(email=data["email"]).first()
        if not user:
            return {"error": "Invalid credentials"}, 401

        if not check_password_hash(user.password_hash, data["password"]):
            return {"error": "Invalid credentials"}, 401

        return {"user_id": user.id}
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

@api.put("/expenses/<int:expense_id>")
def update_expense(expense_id: int):
    data = request.get_json(force=True)
    user_id = int(data["user_id"])

    db = SessionLocal()
    try:
        exp = db.query(Expense).filter_by(id=expense_id, user_id=user_id).first()
        if not exp:
            return {"error": "Expense not found"}, 404

        if "amount" in data:
            exp.amount = data["amount"]
        if "category" in data:
            exp.category = data["category"]
        if "description" in data:
            exp.description = data.get("description")
        if "date" in data:
            exp.date = parse_date(data["date"])

        db.commit()

        return jsonify({
            "id": exp.id,
            "amount": float(exp.amount),
            "category": exp.category,
            "description": exp.description,
            "date": exp.date.isoformat(),
        })
    finally:
        db.close()


@api.delete("/expenses/<int:expense_id>")
def delete_expense(expense_id: int):
    user_id = int(request.args["user_id"])

    db = SessionLocal()
    try:
        exp = db.query(Expense).filter_by(id=expense_id, user_id=user_id).first()
        if not exp:
            return {"error": "Expense not found"}, 404

        db.delete(exp)
        db.commit()
        return jsonify({"status": "deleted"})
    finally:
        db.close()


@api.get("/expenses")
def list_expenses():
    """
    Returns ALL expenses for the user, newest first.
    Supports optional pagination:
      ?limit=50&offset=0
    """
    user_id = int(request.args["user_id"])
    limit = int(request.args.get("limit", 200))
    offset = int(request.args.get("offset", 0))

    db = SessionLocal()
    try:
        q = (
            db.query(Expense)
            .filter(Expense.user_id == user_id)
            .order_by(Expense.date.desc(), Expense.id.desc())
            .limit(limit)
            .offset(offset)
        )

        rows = q.all()

        return jsonify(
            [
                {
                    "id": r.id,
                    "amount": float(r.amount),
                    "category": r.category,
                    "description": r.description,
                    "date": r.date.isoformat(),
                }
                for r in rows
            ]
        )
    finally:
        db.close()


@api.get("/overview")
def overview():
    user_id = int(request.args["user_id"])
    year = int(request.args["year"])
    month = int(request.args["month"])

    db = SessionLocal()
    try:
        expenses = (
            db.query(
                Expense.category,
                func.coalesce(func.sum(Expense.amount), 0).label("spent"),
            )
            .filter(
                Expense.user_id == user_id,
                func.extract("year", Expense.date) == year,
                func.extract("month", Expense.date) == month,
            )
            .group_by(Expense.category)
            .all()
        )

        budgets = (
            db.query(Budget)
            .filter_by(
                user_id=user_id,
                year=year,
                month=month,
            )
            .all()
        )

        budget_map = {b.category: float(b.limit_amount) for b in budgets}

        result = []
        for category, spent in expenses:
            limit_amount = budget_map.get(category)
            spent_f = float(spent)
            result.append(
                {
                    "category": category,
                    "spent": spent_f,
                    "limit": limit_amount,
                    "remaining": None
                    if limit_amount is None
                    else max(limit_amount - spent_f, 0),
                }
            )

        return jsonify(result)
    finally:
        db.close()


@api.get("/overview/yearly")
def overview_yearly():
    user_id = int(request.args["user_id"])
    year = int(request.args["year"])

    db = SessionLocal()
    try:
        rows = (
            db.query(
                Expense.category,
                func.coalesce(func.sum(Expense.amount), 0).label("spent"),
            )
            .filter(
                Expense.user_id == user_id,
                func.extract("year", Expense.date) == year,
            )
            .group_by(Expense.category)
            .all()
        )

        return jsonify(
            [
                {"category": category, "spent": float(spent), "limit": None, "remaining": None}
                for category, spent in rows
            ]
        )
    finally:
        db.close()


@api.get("/overview/yearly/months")
def overview_yearly_months():
    user_id = int(request.args["user_id"])
    year = int(request.args["year"])

    db = SessionLocal()
    try:
        rows = (
            db.query(
                func.extract("month", Expense.date).label("month"),
                Expense.category.label("category"),
                func.coalesce(func.sum(Expense.amount), 0).label("spent"),
            )
            .filter(
                Expense.user_id == user_id,
                func.extract("year", Expense.date) == year,
            )
            .group_by("month", "category")
            .order_by("month")
            .all()
        )

        categories = sorted({r.category for r in rows})

        months = []
        for m in range(1, 13):
            item = {"month": m}
            for c in categories:
                item[c] = 0.0
            months.append(item)

        for r in rows:
            m = int(r.month)
            months[m - 1][r.category] = float(r.spent)

        for item in months:
            item["total"] = sum(item[c] for c in categories)

        return jsonify({"year": year, "categories": categories, "months": months})
    finally:
        db.close()
