from app.utils.database import db
from bson import ObjectId
from app.models.plant import Plant, PlantResponse

# Funzione per ottenere tutti gli impianti
def get_all_plants():
    return [dict(plant, _id=str(plant["_id"])) for plant in db.plants.find()]

# Funzione per ottenere un impianto per ID
def get_plant_by_id(plant_id: str):
    plant = db.plants.find_one({"_id": ObjectId(plant_id)})
    if not plant:
        return None
    plant["_id"] = str(plant["_id"])
    return plant

# Funzione per aggiungere un impianto
def add_plant(plant: Plant):
    plant_data = plant.dict(exclude_unset=True)
    machinery_ids = plant_data.get("machinery", [])

    # Verifica che nessun macchinario sia già associato a un impianto
    for machinery_id in machinery_ids:
        conflicting_machinery = db.machinery.find_one({"_id": ObjectId(machinery_id), "plant_id": {"$exists": True}})
        if conflicting_machinery:
            return {"error": f"Machinery {machinery_id} is already associated with another plant."}, 409

    # Aggiungi l'impianto
    result = db.plants.insert_one(plant_data)

    # Aggiorna i macchinari con il riferimento all'impianto
    for machinery_id in machinery_ids:
        db.machinery.update_one(
            {"_id": ObjectId(machinery_id)},
            {"$set": {"plant_id": str(result.inserted_id)}}
        )

    return {"message": "Plant added successfully", "id": str(result.inserted_id)}

# Funzione per aggiornare un impianto
def update_plant(plant_id: str, updated_data: Plant):
    updated_data_dict = updated_data.dict(exclude_unset=True)
    new_machinery_ids = set(updated_data_dict.get("machinery", []))

    # Ottieni l'impianto corrente
    plant = db.plants.find_one({"_id": ObjectId(plant_id)})
    if not plant:
        return {"message": "Plant not found"}

    current_machinery_ids = set(plant.get("machinery", []))

    # Identifica i macchinari da rimuovere e da aggiungere
    machinery_to_remove = current_machinery_ids - new_machinery_ids
    machinery_to_add = new_machinery_ids - current_machinery_ids

    # Verifica che i nuovi macchinari non siano già associati ad altri impianti
    for machinery_id in machinery_to_add:
        conflicting_machinery = db.machinery.find_one({"_id": ObjectId(machinery_id), "plant_id": {"$exists": True}})
        if conflicting_machinery:
            return {"error": f"Machinery {machinery_id} is already associated with another plant."}, 409

    # Aggiorna i macchinari
    for machinery_id in machinery_to_remove:
        db.machinery.update_one({"_id": ObjectId(machinery_id)}, {"$unset": {"plant_id": ""}})
    for machinery_id in machinery_to_add:
        db.machinery.update_one({"_id": ObjectId(machinery_id)}, {"$set": {"plant_id": plant_id}})

    # Aggiorna l'impianto
    db.plants.update_one(
        {"_id": ObjectId(plant_id)},
        {"$set": updated_data_dict}
    )

    return {"message": "Plant updated successfully"}

# Funzione per rimuovere un impianto
def delete_plant(plant_id: str):
    # Recupera l'impianto e i macchinari associati
    plant = db.plants.find_one({"_id": ObjectId(plant_id)})
    if not plant:
        return {"message": "Plant not found"}

    machinery_ids = plant.get("machinery", [])

    # Rimuovi l'impianto
    result = db.plants.delete_one({"_id": ObjectId(plant_id)})
    if result.deleted_count == 0:
        return {"message": "Plant not found"}

    # Disassocia i macchinari dall'impianto
    for machinery_id in machinery_ids:
        db.machinery.update_one({"_id": ObjectId(machinery_id)}, {"$unset": {"plant_id": ""}})

    return {"message": "Plant deleted successfully"}

# Funzione aggiornata per ottenere solo il nome dei macchinari associati a un impianto
def get_machinery_names_by_plant_id(plant_id: str):
    plant = db.plants.find_one({"_id": ObjectId(plant_id)})
    if not plant:
        return None

    machinery_ids = plant.get('machinery', [])
    machinery_details = db.machinery.find({"_id": {"$in": [ObjectId(id) for id in machinery_ids]}})
    
    return [
        {"name": machinery["name"]}  
        for machinery in machinery_details
    ]
