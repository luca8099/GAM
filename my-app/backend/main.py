from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth_router, plants_router, machinery_router

# Creazione dell'app FastAPI
app = FastAPI(docs_url='/documentation',
              openapi_url='/documentation/json')

# Configurazione CORS (modifica `allow_origins` in produzione)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrazione delle rotte
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(plants_router, prefix="/plants", tags=["Plants"])
app.include_router(machinery_router, prefix="/machinery", tags=["Machinery"])

# Endpoint base
@app.get("/")
def read_root():
    return {"message": "Welcome to the Industrial Management API"}
