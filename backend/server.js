// backend/server.js (ESM)
import Fastify from "fastify";
import pkg from "pg";
import logger from "./logger.js";
import { checkDatabaseConnection } from "./dbCheck.js";
import cors from "@fastify/cors";

const { Pool } = pkg;
const log = logger.withScope("Server");

// Eigene Logs verwenden (kein Fastify-Logger, um Format zu vereinheitlichen)
const app = Fastify({ logger: false });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// CORS nur für Dev-Frontend erlauben (per ENV übersteuerbar)
const allowedOrigins = (process.env.CORS_ORIGINS?.split(",") ?? [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]).map((s) => s.trim());

await app.register(cors, {
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
});

// Health-Route (SCRUM-30)
app.get("/health", async () => ({ status: "ok" }));

// DB-Check-Route
app.get("/dbcheck", async () => {
  const { rows } = await pool.query("SELECT 1 as ok");
  return { db: rows[0].ok === 1 ? "ok" : "fail" };
});

// Pool sauber schließen, wenn Server beendet wird
app.addHook("onClose", async () => {
  await pool.end();
});

// Request-/Response-Logging
app.addHook("onRequest", async (req) => {
  req._start = Date.now();
  log.info(`→ ${req.method} ${req.url}`);
});
app.addHook("onResponse", async (req, reply) => {
  const ms = req._start ? Date.now() - req._start : undefined;
  log.info(`← ${req.method} ${req.url} ${reply.statusCode}${ms !== undefined ? ` (${ms}ms)` : ""}`);
});

// 404-Handler
app.setNotFoundHandler((req, reply) => {
  log.warn(`404 ${req.method} ${req.url}`);
  reply.code(404).send({ error: "Not Found" });
});

// Zentrales Error-Handling
app.setErrorHandler((err, req, reply) => {
  log.error(`Unhandled app error at ${req.method} ${req.url}`, err);
  reply.code(500).send({ error: "Internal Server Error" });
});

// Prozessfehler
process.on("unhandledRejection", (reason) => {
  log.error("unhandledRejection", reason instanceof Error ? reason : new Error(String(reason)));
});
process.on("uncaughtException", (err) => {
  log.error("uncaughtException", err);
});

// Start: erst Server bereitstellen (Healthcheck wird grün), dann DB-Check im Hintergrund
const start = async () => {
  try {
    const port = Number(process.env.PORT || 3000);
    const host = process.env.HOST || "0.0.0.0";

    await app.listen({ port, host });
    log.info(`Server listening at http://${host}:${port}`);

    // DB-Check asynchron (blockiert das Listen nicht)
    // Fail-Fast nur, wenn DB_CHECK_EXIT_ON_FAIL=true (siehe dbCheck.js)
    checkDatabaseConnection(pool).then((ok) => {
      if (!ok) log.warn("DB check failed after retries.");
    });
  } catch (err) {
    log.error("Server start failed:", err);
    process.exit(1);
  }
};

start();
