from typing import Dict, Optional
from pydantic import BaseModel, Field
from bson import ObjectId

class Machinery(BaseModel):
    name: str = Field(..., description="Nome del macchinario")
    type: str = Field(..., description="Tipo del macchinario")
    status: str = Field(..., description="Stato del macchinario (e.g., operativo, non operativo)")
    #plant_id: Optional[str] = Field(None, description="ID dell'impianto associato")
    specifications: Dict[str, str] = Field(default_factory=dict, description="Specifiche tecniche")

    class Config:
        from_attributes = True  # Sostituito 'orm_mode' con 'from_attributes'
        json_encoders = {ObjectId: str}  # Assicurati che ObjectId sia convertito in stringa
