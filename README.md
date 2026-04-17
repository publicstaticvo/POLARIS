# POLARIS IRT Core

This repository contains the website and backend scaffolding for the POLARIS IRT Core adaptive LLM evaluation platform.

## Project structure

- `backend/`: FastAPI backend API and IRT core modules.
- `frontend/`: Next.js 14 + TypeScript frontend UI.

## Backend

Install dependencies:

```bash
cd POLARIS/backend
python -m venv .venv
.\.venv\Scripts\activate
python -m pip install -r requirements.txt
```

Run the backend:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API docs:

- `http://localhost:8000/docs`
- Health: `http://localhost:8000/api/health`

## Frontend

Install dependencies:

```bash
cd POLARIS/frontend
npm install
npm run dev
```

The frontend expects the backend at `http://localhost:8000/api` by default.

## Next steps

- Implement real database integration with PostgreSQL and Redis.
- Add Celery+Redis task queue for long-running CAT evaluations.
- Replace stub IRT logic with the full MFI+ selection and EAP engine.
- Add authentication, user accounts, and leaderboard persistence.
