# import jwt
# from datetime import datetime, timedelta
# from fastapi import HTTPException, Depends
# from fastapi.security import OAuth2PasswordBearer

# SECRET_KEY = "yungsters inserite una password che vi aggrada"  
# ALGORITHM = "HS256" #è solo il tipo di hash
# ACCESS_TOKEN_EXPIRE_MINUTES = 60

# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


# def create_token(username: str, role: str):
#     """
#     Genera un token JWT con username e ruolo.
#     """
#     expiration = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES) #è deprecato ma funziona, non ho la minima idea di cosa usare, sia la doc che gpt suggerivano questo
#     payload = {"sub": username, "role": role, "exp": expiration}
#     return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


# def decode_token(token: str):
#     """
#     Decodifica un token JWT e restituisce il payload.
#     """
#     try:
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
#         return payload
#     except jwt.ExpiredSignatureError:
#         raise HTTPException(status_code=401, detail="Token scaduto")
#     except jwt.InvalidTokenError:
#         raise HTTPException(status_code=401, detail="Token non valido")


# def get_current_user(token: str = Depends(oauth2_scheme)):
#     """
#     Restituisce l'utente attuale in base al token JWT.
#     """
#     return decode_token(token)
