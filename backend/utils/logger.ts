import { getEnv } from "../config/validateEnv.js";

type LogLevel = "error" | "warn" | "info" | "debug";

class Logger {
  private formatMessage(
    level: LogLevel,
    message: string,
    meta?: unknown
  ): string {
    const timestamp = new Date().toISOString();
    const env = getEnv();
    const logEntry: Record<string, unknown> = {
      timestamp,
      level: level.toUpperCase(),
      message,
    };
    if (meta) {
      logEntry.meta = meta;
    }
    if (env.NODE_ENV === "development") {
      logEntry.pid = process.pid;
    }
    return JSON.stringify(logEntry);
  }

  error(message: string, error?: Error | unknown): void {
    const errorMeta =
      error instanceof Error
        ? { error: error.message, stack: error.stack }
        : error;
    console.error(this.formatMessage("error", message, errorMeta));
  }

  warn(message: string, meta?: unknown): void {
    console.warn(this.formatMessage("warn", message, meta));
  }

  info(message: string, meta?: unknown): void {
    console.log(this.formatMessage("info", message, meta));
  }

  debug(message: string, meta?: unknown): void {
    const env = getEnv();
    if (env.NODE_ENV === "development") {
      console.debug(this.formatMessage("debug", message, meta));
    }
  }
}

export const logger = new Logger();
