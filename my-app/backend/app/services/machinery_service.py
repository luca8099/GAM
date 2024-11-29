from app.utils.database import db
from bson import ObjectId
from app.models.machinery import Machinery

def get_machinery_by_id(machinery_id: str):
    machinery = db.machinery.find_one({"_id": ObjectId(machinery_id)})
    if not machinery:
        return None
    machinery["_id"] = str(machinery["_id"])
    return machinery

def add_machinery(plant_id,machinery: Machinery):
    machinery_data = machinery.dict(exclude_unset=True)
    #plant_id = machinery_data.get("plant_id")

    # Verifica che il macchinario non sia già associato a un altro impianto
    #if plant_id and db.machinery.find_one({"_id": machinery_data.get("_id"), "plant_id": {"$exists": True}}):
        #return {"error": "Machinery is already associated with another plant."}, 409
    machinery_data['plant_id'] = plant_id
    result = db.machinery.insert_one(machinery_data)

    if plant_id:
        db.plants.update_one(
            {"_id": ObjectId(plant_id)},
            {"$push": {"machinery": str(result.inserted_id)}}
        )
    return {"message": "Machinery added successfully", "id": str(result.inserted_id)}

def update_machinery(machinery_id: str, updated_data: Machinery):
    updated_data_dict = updated_data.dict(exclude_unset=True)
    existing_machinery = db.machinery.find_one({"_id": ObjectId(machinery_id)})
    if not existing_machinery:
        return {"message": "Machinery not found"}

    old_plant_id = existing_machinery.get("plant_id")
    new_plant_id = updated_data_dict.get("plant_id")

    # Verifica che il macchinario non venga associato a un altro impianto già occupato
    if new_plant_id and new_plant_id != old_plant_id:
        if db.machinery.find_one({"_id": {"$ne": ObjectId(machinery_id)}, "plant_id": new_plant_id}):
            return {"error": "Machinery is already associated with another plant."}, 409

    # Update the machinery document
    db.machinery.update_one(
        {"_id": ObjectId(machinery_id)}, {"$set": updated_data_dict}
    )

    # If plant_id has changed, update the plants
    if old_plant_id != new_plant_id:
        if old_plant_id:
            # Remove machinery from old plant
            db.plants.update_one(
                {"_id": ObjectId(old_plant_id)},
                {"$pull": {"machinery": str(machinery_id)}}
            )
        if new_plant_id:
            # Add machinery to new plant
            db.plants.update_one(
                {"_id": ObjectId(new_plant_id)},
                {"$push": {"machinery": str(machinery_id)}}
            )

    return {"message": "Machinery updated successfully"}

def delete_machinery(machinery_id: str):
    machinery = db.machinery.find_one({"_id": ObjectId(machinery_id)})
    if not machinery:
        return {"message": "Machinery not found"}

    plant_id = machinery.get("plant_id")
    result = db.machinery.delete_one({"_id": ObjectId(machinery_id)})

    if plant_id:
        db.plants.update_one(
            {"_id": ObjectId(plant_id)},
            {"$pull": {"machinery": str(machinery_id)}}
        )
    return {"message": "Machinery deleted successfully"}

def search_machinery(name: str = None, type: str = None, status: str = None):
    query = {}
    if name:
        query["name"] = {"$regex": name, "$options": "i"}
    if type:
        query["type"] = {"$regex": type, "$options": "i"}
    if status:
        query["status"] = {"$regex": status, "$options": "i"}

    machinery_list = db.machinery.find(query)

    return [
        dict(machinery, _id=str(machinery["_id"]))
        for machinery in machinery_list
    ]
