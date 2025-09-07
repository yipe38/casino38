# Casino38 – Development Setup

Dieses Projekt besteht aus einem Backend (Node.js + Fastify), einer PostgreSQL-Datenbank und Adminer als Datenbank-UI.  
Alle Services laufen in Docker-Containern und können mit **einem Befehl** gestartet werden.

---

## Voraussetzungen

- [Docker](https://www.docker.com/get-started) installiert  
- [Docker Compose](https://docs.docker.com/compose/) verfügbar  
- Git zum Klonen des Repositories

---

## Setup & Start

```bash
# Repository klonen
git clone <repo-url>
cd casino38

# Container bauen und starten
docker compose up -d
