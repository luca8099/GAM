from fastapi import APIRouter, HTTPException
from bson import ObjectId
from pydantic import BaseModel
from typing import Optional
from app.models.machinery import Machinery
from app.utils.database import db

from app.services.machinery_service import (
    get_machinery_by_id,
    add_machinery,
    update_machinery,
    delete_machinery,
    search_machinery,
)

router = APIRouter()

@router.get("/{machinery_id}")
def get_machinery(machinery_id: str):
    if not ObjectId.is_valid(machinery_id):
        raise HTTPException(status_code=400, detail="Invalid machinery ID")
    machinery = get_machinery_by_id(machinery_id)
    if not machinery:
        raise HTTPException(status_code=404, detail="Machinery not found")
    return machinery

@router.post("/{plant_id}")
def add_machinery_route(plant_id:str,machinery: Machinery):
    try:
        result = add_machinery(plant_id,machinery)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Errore nell'aggiunta: {str(e)}")

@router.put("/{machinery_id}")
def modify_machinery(machinery_id: str, machinery: Machinery):
    if not ObjectId.is_valid(machinery_id):
        raise HTTPException(status_code=400, detail="Invalid machinery ID")
    result = update_machinery(machinery_id, machinery)
    if result.get("message") == "Machinery not found":
        raise HTTPException(status_code=404, detail=result["message"])
    return result

@router.delete("/{machinery_id}")
def remove_machinery(machinery_id: str):
    if not ObjectId.is_valid(machinery_id):
        raise HTTPException(status_code=400, detail="Invalid machinery ID")
    result = delete_machinery(machinery_id)
    if result.get("message") == "Machinery not found":
        raise HTTPException(status_code=404, detail=result["message"])
    return result

@router.get("/plants/{plant_id}/machinery")
def get_machinery_by_plant_id(plant_id: str):
    if not ObjectId.is_valid(plant_id):
        raise HTTPException(status_code=400, detail="Invalid plant ID")

    machinery_list = db.machinery.find({"plant_id": plant_id})
    return [
        dict(machinery, _id=str(machinery["_id"]))
        for machinery in machinery_list
    ]

@router.get("/search")
def search(name: Optional[str] = None, type: Optional[str] = None, status: Optional[str] = None):
    try:
        # Costruisci la query solo se ci sono parametri
        query = {}
        if name:
            query["name"] = {"$regex": name, "$options": "i"}
        if type:
            query["type"] = {"$regex": type, "$options": "i"}
        if status:
            query["status"] = {"$regex": status, "$options": "i"}
        
        # Se la query è vuota, restituisci tutti i macchinari
        if not query:
            machinery_list = db.machinery.find()
        else:
            machinery_list = db.machinery.find(query)
        
        # Converti ObjectId in stringa
        return [
            dict(machinery, _id=str(machinery["_id"]))
            for machinery in machinery_list
        ]
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Errore nella ricerca: {str(e)}")

@router.get("/")
def get_all_machinery():
    machinery_list = db.machinery.find()
    return [
        dict(machinery, _id=str(machinery["_id"]))
        for machinery in machinery_list
    ]
