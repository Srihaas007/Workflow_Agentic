# Dev with Docker (single command)

## Prereqs
- Docker Desktop

## First time
- Copy `.env.example` to `.env` at repo root and set a 32+ char JWT secret

## Start all services
```powershell
# from repo root
$env:JWT_SECRET_KEY="your-long-secret"; docker compose up --build
```

- Backend: http://localhost:8000
- Frontend: http://localhost:3000
- Node-RED: http://localhost:1880/node-red

## Hot reload
- Backend and Frontend mount source for live reload in dev
- Node-RED mounts `node-red/` directory and persists flows in volume `node_red_data`

## Stop
```powershell
docker compose down
```

## Clean volumes
```powershell
docker compose down -v
```