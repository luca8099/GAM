from typing import List, Optional
from pydantic import BaseModel, Field
from .base import MongoModel

class Plant(BaseModel):
    name: str = Field(..., description="Nome dell'impianto")
    location: str = Field(..., description="Posizione dell'impianto")
    description: str = Field(..., description="Descrizione dell'impianto")
    machinery: Optional[List[str]] = []

class PlantResponse(MongoModel):
    name: str = Field(..., description="Nome dell'impianto")
    location: str = Field(..., description="Posizione dell'impianto")
    description: str = Field(..., description="Descrizione dell'impianto")
    machinery: Optional[List[str]] = []
