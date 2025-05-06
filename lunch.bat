@echo off
cd backend
echo === [BACKEND] Activation de l'environnement Python ===
call env\Scripts\activate

echo === [BACKEND] Lancement FastAPI ===
start uvicorn main:app --reload --port 8000

cd ..\frontend
echo === [FRONTEND] Lancement de React (Vite) ===
start npm run dev

echo === [✔️] Application lancée : Backend http://localhost:8000 - Frontend http://localhost:3000
pause
