from sqlalchemy import Column, String, Integer, JSON, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from database import Base

class Problem(Base):
    __tablename__ = "problems"

    id = Column(String, primary_key=True, index=True)
    problem_statement = Column(String, nullable=False)
    analysis = Column(JSON, nullable=False)
    current_step = Column(Integer, default=1)
    mode = Column(String, default="guided") # guided | practice
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    
    attempts = relationship("Attempt", back_populates="problem")

class Attempt(Base):
    __tablename__ = "attempts"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    problem_id = Column(String, ForeignKey("problems.id"))
    step = Column(Integer)
    score = Column(Integer, nullable=True)
    feedback = Column(String, nullable=True)
    user_code = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))

    problem = relationship("Problem", back_populates="attempts")

class UserStats(Base):
    __tablename__ = "user_stats"

    id = Column(Integer, primary_key=True, default=1)
    total_problems = Column(Integer, default=0)
    successful = Column(Integer, default=0)
    total_score = Column(Integer, default=0)
    hints_used = Column(Integer, default=0)
    total_hints_available = Column(Integer, default=0)
    concept_stats = Column(JSON, default={}) # {concept: {attempts, total_score}}
    streak_dates = Column(JSON, default=[])
