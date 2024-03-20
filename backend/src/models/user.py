from datetime import datetime
from sqlalchemy import Column, String, Text, Integer
from sqlalchemy.orm import relationship
from sqlalchemy.sql.schema import ForeignKey

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False)
    password = Column(Text(), nullable=False)
    scores = relationship(
        "Score",
        back_populates="users",
        cascade="all, delete-orphan",
    )
