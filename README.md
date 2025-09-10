# Casino38 – Development Setup

Dieses Projekt besteht aus:
- **Backend** (Node.js + Fastify)
- **PostgreSQL**-Datenbank
- **Adminer** als DB-UI
- **Frontend** (React + Vite)

Alle Services laufen in Docker-Containern und können mit **einem Befehl** gestartet werden.

---

## Voraussetzungen

- [Docker](https://www.docker.com/get-started) (https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/) (https://docs.docker.com/compose/)
- Git zum Klonen des Repositories

---

## Setup & Start

```bash
# Repository klonen
git clone <repo-url>
cd casino38

# Container bauen und starten
docker compose up --build -d
