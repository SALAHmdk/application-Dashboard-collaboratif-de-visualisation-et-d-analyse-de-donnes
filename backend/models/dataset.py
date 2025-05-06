from database import Base
from sqlalchemy import Column, ForeignKey, Integer, String, Text


class Dataset(Base):
    __tablename__ = "datasets"
    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String)
    content = Column(Text)
