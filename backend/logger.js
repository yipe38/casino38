// backend/logger.js
const LEVELS = { debug: 0, info: 1, warn: 2, error: 3 };
const levelName = (process.env.LOG_LEVEL || "info").toLowerCase();
const THRESHOLD = LEVELS[levelName] ?? LEVELS.info;
// pretty (dev) / json (prod) steuern
const MODE = (process.env.LOG_FORMAT || (process.env.NODE_ENV === "production" ? "json" : "pretty")).toLowerCase();

function ts() {
  return new Date().toISOString().replace("T", " | ").split(".")[0]; // YYYY-MM-DD | HH:mm:ss
}
function tag(level) {
  return ({ info:"INF", warn:"WRN", debug:"DBG", error:"ERR" }[level]) || level.toUpperCase();
}

function out(level, message, error, scope, meta) {
  if (LEVELS[level] < THRESHOLD) return;

  const base = { level, time: new Date().toISOString(), message, scope, ...meta };
  if (error instanceof Error) {
    base.error = { message: error.message, stack: error.stack };
  } else if (error) {
    base.error = error;
  }

  if (MODE === "json") {
    console.log(JSON.stringify(base));
  } else {
    const prefix = `[${ts()}] [${tag(level)}]${scope ? ` [${scope}]` : ""}`;
    const errPart = base.error ? ` | ${base.error.message || base.error}` : "";
    console.log(`${prefix} ${message}${errPart}`);
    if (base.error?.stack) console.log(base.error.stack);
  }
}

function withScope(scope) {
  return {
    info: (m, meta) => out("info", m, null, scope, meta),
    warn: (m, meta) => out("warn", m, null, scope, meta),
    debug: (m, meta) => out("debug", m, null, scope, meta),
    error: (m, err, meta) => out("error", m, err, scope, meta),
  };
}

const logger = withScope(); // default ohne Scope
logger.withScope = withScope;

export default logger;
