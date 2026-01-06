from sqlalchemy import Column, Integer, String, Numeric, Date
from .db import Base

class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Numeric(10, 2), nullable=False)
    category = Column(String(64), nullable=False)
    description = Column(String(256), nullable=True)
    date = Column(Date, nullable=False)
