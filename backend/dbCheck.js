// backend/dbCheck.js
import logger from "./logger.js";

const log = logger.withScope("DB");

/**
 * Prüft die DB-Verbindung mit Retries.
 * @param {import('pg').Pool} pool - bestehender pg Pool
 * @param {object} [opts]
 * @param {number} [opts.retries=10]
 * @param {number} [opts.delayMs=2000]
 * @param {boolean} [opts.exitOnFail=(process.env.DB_CHECK_EXIT_ON_FAIL==="true")]
 * @returns {Promise<boolean>} true bei Erfolg, false bei Fehlschlag
 */
export async function checkDatabaseConnection(
  pool,
  { retries = 10, delayMs = 2000, exitOnFail = (process.env.DB_CHECK_EXIT_ON_FAIL === "true") } = {}
) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    log.debug(`Starte Datenbank-Check... (Versuch ${attempt}/${retries})`);
    try {
      const client = await pool.connect();
      client.release();
      log.info("Datenbankverbindung erfolgreich hergestellt.");
      return true;
    } catch (err) {
      log.warn(`DB noch nicht bereit: ${err.message}`);
      if (attempt === retries) {
        log.error("Maximale Versuche erreicht. DB-Check fehlgeschlagen.");
        if (exitOnFail) process.exit(1);
        return false;
      }
      await new Promise((res) => setTimeout(res, delayMs));
    }
  }
  return false;
}
