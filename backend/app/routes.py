from datetime import date as dt_date, datetime
from flask import Blueprint, jsonify, request
from sqlalchemy import func
from .db import SessionLocal, engine, Base
from .models import Expense

api = Blueprint("api", __name__)

# create tables (simple MVP). Later we’ll replace with migrations.
Base.metadata.create_all(bind=engine)

def parse_date(s: str):
    return datetime.strptime(s, "%Y-%m-%d").date()

@api.get("/health")
def health():
    return jsonify({"status": "ok"})

@api.post("/expenses")
def create_expense():
    payload = request.get_json(force=True)

    amount = payload.get("amount")
    category = (payload.get("category") or "").strip()
    description = (payload.get("description") or "").strip() or None
    date_str = payload.get("date")

    if amount is None or category == "" or date_str is None:
        return jsonify({"error": "amount, category, date are required"}), 400

    try:
        amount_val = float(amount)
        exp_date = parse_date(date_str)
    except Exception:
        return jsonify({"error": "invalid amount/date"}), 400

    db = SessionLocal()
    try:
        exp = Expense(amount=amount_val, category=category, description=description, date=exp_date)
        db.add(exp)
        db.commit()
        db.refresh(exp)
        return jsonify({
            "id": exp.id,
            "amount": float(exp.amount),
            "category": exp.category,
            "description": exp.description,
            "date": exp.date.isoformat()
        }), 201
    finally:
        db.close()

@api.get("/expenses")
def list_expenses():
    # optional filters: from, to, category
    from_q = request.args.get("from")
    to_q = request.args.get("to")
    category_q = request.args.get("category")

    db = SessionLocal()
    try:
        q = db.query(Expense)

        if from_q:
            q = q.filter(Expense.date >= parse_date(from_q))
        if to_q:
            q = q.filter(Expense.date <= parse_date(to_q))
        if category_q:
            q = q.filter(Expense.category == category_q)

        q = q.order_by(Expense.date.desc(), Expense.id.desc())
        rows = q.all()

        return jsonify([{
            "id": r.id,
            "amount": float(r.amount),
            "category": r.category,
            "description": r.description,
            "date": r.date.isoformat()
        } for r in rows])
    finally:
        db.close()

@api.get("/summary/monthly")
def monthly_summary():
    year = request.args.get("year")
    month = request.args.get("month")
    if not year or not month:
        return jsonify({"error": "year and month are required"}), 400

    y = int(year)
    m = int(month)

    db = SessionLocal()
    try:
        total = db.query(func.coalesce(func.sum(Expense.amount), 0)).filter(
            func.extract("year", Expense.date) == y,
            func.extract("month", Expense.date) == m
        ).scalar()

        return jsonify({
            "year": y,
            "month": m,
            "total": float(total)
        })
    finally:
        db.close()

@api.get("/summary/categories")
def categories_breakdown():
    from_q = request.args.get("from")
    to_q = request.args.get("to")

    db = SessionLocal()
    try:
        q = db.query(
            Expense.category,
            func.coalesce(func.sum(Expense.amount), 0).label("total")
        )

        if from_q:
            q = q.filter(Expense.date >= parse_date(from_q))
        if to_q:
            q = q.filter(Expense.date <= parse_date(to_q))

        q = q.group_by(Expense.category).order_by(func.sum(Expense.amount).desc())
        rows = q.all()

        return jsonify([{
            "category": r[0],
            "total": float(r[1])
        } for r in rows])
    finally:
        db.close()
