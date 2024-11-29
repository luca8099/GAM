from pymongo import MongoClient
import os

# Configurazione MongoDB
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "project_group4")

client = MongoClient(MONGO_URI)
db = client[DATABASE_NAME]
