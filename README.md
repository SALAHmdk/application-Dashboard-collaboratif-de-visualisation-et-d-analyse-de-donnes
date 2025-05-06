# application-Dashboard-collaboratif-

# 🚀 Guide d'installation - Dashboard collaboratif

## 📌 Technologies utilisées

| Domaine             | Technologie choisie     | Raisons du choix |
|---------------------|-------------------------|------------------|
| **Frontend**        | React + Vite + TailwindCSS | Rapide, moderne, écosystème riche |
| **Backend**         | FastAPI (Python)        | Asynchrone, typé, Swagger auto |
| **Base de données** | PostgreSQL              | Open source, robuste, relationnelle |
| **Sécurité**        | JWT (JSON Web Token)    | Authentification sécurisée |
| **Bonus**           | Docker                  | Portabilité, conteneurisation |

---

## 📦 Installation backend (FastAPI + JWT + SQLAlchemy)

```bash
cd backend
python -m venv env
env\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
✅ Swagger UI : http://localhost:8000/docs

🎨 Installation frontend (React + Vite + TailwindCSS)
bash

cd frontend
npm install
npm run dev
📍 Interface : http://localhost:5173

🐘 Base de données (PostgreSQL)
Tables :

users (admin, credentials)

datasets (fichiers CSV + métadonnées)

ORM : SQLAlchemy

Connexion via DATABASE_URL

🔐 Authentification
/token : login avec JWT

Nom d'utilisateur : admin
Mot de passe : admin123

@Depends(get_current_user) : protègent les routes

Stockage du token en localStorage pour réutilisation

🐳 Utilisation de Docker (optionnel)
bash

# backend/Dockerfile
FROM python:3.11
WORKDIR /app
COPY . .
RUN pip install -r requirements.txt
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
bash

# frontend/Dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "run", "dev"]
bash

# docker-compose.yml
version: '3'
services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
🎯 Explication du choix des technologies
🔷 Frontend : React
Réactif, performant, avec une forte communauté.

Vite pour un démarrage rapide.

TailwindCSS pour un style élégant et maintenable.

🔶 Backend : FastAPI (Python)
Facile à prendre en main pour les développeurs Python.

Documentation Swagger automatique.

Compatible avec pandas et scikit-learn pour l’analyse des données.

🗃️ Base de données : PostgreSQL
Relationnelle et compatible avec les ORM modernes.

Bonne gestion des types JSON si besoin.

🔐 Sécurité : JWT
Le token est utilisé pour sécuriser les routes /upload, etc.

Stocké côté client et envoyé dans les headers.


## Lunch.bat pour lancer directement le tout
