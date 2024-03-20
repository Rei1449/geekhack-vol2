from datetime import datetime
from sqlalchemy import Column, String, Text, Integer, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.sql.schema import ForeignKey

Base = declarative_base()

class Score(Base):
    __tablename__ = "scores"
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String(50), ForeignKey("users.id"), nullable=False)
    score = Column(Numeric, nullable=False)
    hand = Column(Text(), nullable=False)
    users = relationship("User", back_populates="scores")
