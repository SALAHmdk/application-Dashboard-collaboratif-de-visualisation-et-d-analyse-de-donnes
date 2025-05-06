# backend/main.py

import io

import pandas as pd
from auth import create_access_token, get_current_user
from database import Base, engine, get_db
from fastapi import Depends, FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from models.dataset import Dataset
from models.log import Log
from models.user import User
from sqlalchemy.orm import Session

Base.metadata.create_all(bind=engine)

app = FastAPI()

# Autoriser React (localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Tu peux restreindre à ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "API is running"}

from auth import (  # assure-toi que verify_password est bien importé
    create_access_token, get_current_user, verify_password)


@app.post("/token")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid username")
    if not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect password")
    token = create_access_token(user.username)
    return {"access_token": token, "token_type": "bearer"}


@app.post("/upload")
def upload_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Unsupported file format")

    content = file.file.read().decode("utf-8")
    df = pd.read_csv(io.StringIO(content))

    # ✅ Enregistrement dans la base si nécessaire
    dataset = Dataset(owner_id=user.id, name=file.filename, content=df.to_json())
    db.add(dataset)
    db.commit()

    # ✅ Calcul des statistiques
    mean = df.mean(numeric_only=True).to_dict()
    median = df.median(numeric_only=True).to_dict()
    std = df.std(numeric_only=True).to_dict()

    # ✅ Retourne les stats au frontend
    return {
        "mean": mean,
        "median": median,
        "std": std
    }

@app.get("/datasets")
def list_datasets(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Dataset).filter_by(owner_id=user.id).all()

@app.get("/stats/{dataset_id}")
def dataset_stats(dataset_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    dataset = db.query(Dataset).filter_by(id=dataset_id, owner_id=user.id).first()
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    df = pd.read_json(dataset.content)
    return {
        "mean": df.mean(numeric_only=True).to_dict(),
        "median": df.median(numeric_only=True).to_dict(),
        "std": df.std(numeric_only=True).to_dict(),
        "correlation": df.corr(numeric_only=True).to_dict()
    }
