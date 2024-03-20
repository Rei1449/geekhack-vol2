from typing import Any
from datetime import datetime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine, Column, String, Text, Integer, Numeric, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql.schema import ForeignKey

import os
from os.path import join, dirname
from dotenv import load_dotenv

load_dotenv(verbose=True)

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)

Engine = create_engine(os.environ.get('DATABASE_URL'))

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False)
    password = Column(Text(), nullable=False)
    scores = relationship(
        "Score",
        back_populates="users"
    )
    created_at = Column(DateTime, default=datetime.now, nullable=False)
    updated_at = Column(DateTime, default=datetime.now, nullable=False)

class Score(Base):
    __tablename__ = "scores"
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_name = Column(String(50), ForeignKey("users.name"), nullable=False)
    score = Column(Numeric, nullable=False)
    hand = Column(Text(), nullable=False)
    created_at = Column(DateTime, default=datetime.now, nullable=False)
    updated_at = Column(DateTime, default=datetime.now, nullable=False)
    users = relationship("User", back_populates="scores")
