# create_admin.py

from database import Base, SessionLocal, engine
from models.user import User
from passlib.context import CryptContext

# Configuration du hash
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Créer la base de données si besoin
Base.metadata.create_all(bind=engine)

# Création session DB
db = SessionLocal()

# Paramètres de l’utilisateur
username = "admin"
password = "admin123"
hashed_password = pwd_context.hash(password)

# Vérifie si l'utilisateur existe déjà
existing = db.query(User).filter(User.username == username).first()
if not existing:
    new_user = User(username=username, hashed_password=hashed_password, role="admin")
    db.add(new_user)
    db.commit()
    print(f"✅ Utilisateur '{username}' créé avec succès.")
else:
    print(f"⚠️ L'utilisateur '{username}' existe déjà.")
