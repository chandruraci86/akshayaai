from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Date
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
from database import Base

class Bucket(Base):
    __tablename__ = "buckets"

    id = Column(String, primary_key=True, index=True) # The deterministic hash generated from core attributes
    name = Column(String) # The human-readable abbreviated name
    strategy = Column(String, default="Rotation") # Rotation, Margin, etc.
    
    # ML Mock Columns (Computed/Stored values)
    stock_count = Column(Integer, default=0)
    reorder_point = Column(Float, default=0)
    recommended_quantity = Column(Integer, default=0)
    confidence_score = Column(Float, default=0.0)

    # Relationships
    items = relationship("JewelryItem", back_populates="bucket")

class JewelryItem(Base):
    __tablename__ = "jewelry_items"

    tagno = Column(String, primary_key=True, index=True) # Converted to String for safety, though it looks numeric in sample
    bucket_id = Column(String, ForeignKey("buckets.id"))

    # Core required flat attributes
    metal_name = Column(String)
    item_type_name = Column(String)
    item_name = Column(String)
    sub_item_name = Column(String)
    metal_color = Column(String)
    category = Column(String)
    design_group = Column(String)
    design_detail = Column(String)
    
    # Dynamic properties container
    flexible_attributes = Column(JSONB)

    # Useful for mock ML Inputs / Business logic metrics
    stock_date = Column(Date)
    sale_date = Column(Date, nullable=True) # if null, it's in stock
    
    bucket = relationship("Bucket", back_populates="items")
