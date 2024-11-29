from pydantic import BaseModel, Field
from bson import ObjectId
from typing import Any

class PyObjectId(ObjectId):
    """Custom ObjectId field for Pydantic models."""
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v: Any):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, _schema, **kwargs):
        return {
            "type": "string",
            "format": "object-id",
        }

class MongoModel(BaseModel):
    """Base model for MongoDB documents"""
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
