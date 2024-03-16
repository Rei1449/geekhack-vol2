from datetime import datetime
from src.db.base_class import Base
from sqlalchemy import Column, String, Text, Integer

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False, default="default_name")
    password = Column(Text(), nullable=False)
