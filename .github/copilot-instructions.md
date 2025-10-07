# AI Automation Platform — Copilot Instructions (for AI agents)

## Big picture
- Hybrid system with three runtimes:
	- FastAPI backend (8000) in `main.py` with routers from `backend/api/v1/__init__.py` (auth, workflows, email)
	- React frontend (3000) in `frontend/` using MUI Dark + React Flow
	- Node-RED (1880) in `node-red/` with custom integration (`ai-platform-integration.js`, `settings.js`)
- Dev auth is bypassed in `frontend/src/App.tsx` (isAuthenticated=true) to jump straight to `/workflows`. Backend still validates JWT.

## How to run (dev)
```bash
# From repo root
python main.py                 # FastAPI on :8000 (auto DB init, health at /health)
cd frontend && npm start       # React on :3000
cd node-red && node start-nodered.js   # Node-RED on :1880 (/node-red UI)

# Or one-liner (if needed) from root
npm run start-all              # uses concurrently
```

## What lives where
- Config: `backend/core/config.py` (Pydantic). Requires 32+ char `JWT_SECRET_KEY` in `.env`.
- DB init: `backend/core/database.py::init_db()` creates tables on startup (SQLite `automation_platform.db`).
- API surface: under `/api/v1/*`. Examples:
	- Auth: include via `api_router.include_router(auth_router, prefix="/auth")`
	- Workflows: `backend/api/workflows.py` → `/api/v1/workflows/...`
	- Email: `backend/api/email.py` → `/api/v1/email/...`
- Frontend routes: `frontend/src/App.tsx` (redirect `/` → `/workflows`, MUI theme, Sidebar/Header shell).
- Node-RED: `node-red/settings.js` (admin at `/node-red`, CORS for :3000/:3001, login admin/password), flows in `node-red/node-red-data/flows.json`.

## Conventions and patterns
- Theme: violet primary `#8b5cf6` across UI (MUI + Node-RED theme cues).
- API prefixes: always `/api/v1/...`; avoid duplicating prefixes when including routers.
- CORS: configured in FastAPI and Node-RED for ports 3000/3001—align when adding new origins.
- Frontend dev: auth bypassed; call backend directly (proxy set in `frontend/package.json`).

## Integration points
- Node-RED ←→ Backend: via `node-red/ai-platform-integration.js` (Axios to `/api/v1/*`).
- Frontend ↔ Node-RED: “Open Node-RED” button in `pages/WorkflowBuilder.tsx` opens `http://localhost:1880/node-red`.
- Health checks: backend `/health`; Node-RED `/health`; integration status `/api/integration/status` (from `start-nodered.js`).

## Debugging checklist (fast wins)
1) 401/403 from API: ensure `.env` `JWT_SECRET_KEY` ≥ 32 chars and tokens passed where required.
2) CORS errors: confirm allowed origins in `backend/core/config.py` and `node-red/settings.js` include the active frontend port.
3) 404s on auth endpoints: check router include paths in `backend/api/v1/__init__.py` (no duplicate prefixes).
4) Node-RED not found: start from `node-red/` and ensure local install (`npm i`) then `node start-nodered.js`.

## Tests and tools
- Integration smoke: `node test-integration.js` (pings frontend, backend, Node-RED).
- Quick HTML probes: `api_test.html`, `direct_test.html` at repo root.

## Examples
- Execute a workflow (backend): POST to `/api/v1/workflows/execute` (see `backend/api/workflows.py`).
- Generate email content: POST `/api/v1/email/generate` (see `backend/api/email.py`).
- Frontend start route: `/workflows` (see `frontend/src/pages/WorkflowBuilder.tsx`).