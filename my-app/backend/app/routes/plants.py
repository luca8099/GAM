from fastapi import APIRouter, HTTPException
from bson import ObjectId
from app.models.plant import Plant
from app.services.plants_service import (
    get_all_plants,
    get_plant_by_id,
    add_plant,
    update_plant,
    delete_plant,
    get_machinery_names_by_plant_id  # Import della nuova funzione
)

router = APIRouter()

@router.get("/")
def list_plants():
    return get_all_plants()

@router.get("/{plant_id}")
def get_plant(plant_id: str):
    if not ObjectId.is_valid(plant_id):
        raise HTTPException(status_code=400, detail="Invalid plant ID")
    return get_plant_by_id(plant_id)

@router.post("/")
def create_plant(plant: Plant):
    return add_plant(plant)

@router.put("/{plant_id}")
def modify_plant(plant_id: str, plant: Plant):
    if not ObjectId.is_valid(plant_id):
        raise HTTPException(status_code=400, detail="Invalid plant ID")
    return update_plant(plant_id, plant)

@router.delete("/{plant_id}")
def remove_plant(plant_id: str):
    if not ObjectId.is_valid(plant_id):
        raise HTTPException(status_code=400, detail="Invalid plant ID")
    return delete_plant(plant_id)

# Nuovo endpoint per ottenere i macchinari associati a un impianto
@router.get("/{plant_id}/machinery")
def list_machinery_in_plant(plant_id: str):
    machinery_details = get_machinery_names_by_plant_id(plant_id)
    if not machinery_details:
        raise HTTPException(status_code=404, detail="No machinery found for this plant")
    return machinery_details
