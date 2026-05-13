import type { Logger as ILogger } from "./interfaces.js";

const Colors = {
  DEBUG: "\x1b[35m", // magenta
  DIM: "\x1b[2m",
  RESET: "\x1b[0m",
} as const;

/**
 * Console-based debug logger.
 * Single Responsibility: only handles debug output formatting and gating.
 *
 * Enabled via --debug CLI flag or DEBUG=true environment variable.
 */
export class ConsoleLogger implements ILogger {
  readonly enabled: boolean;
  private step = 0;

  constructor(enabled?: boolean) {
    this.enabled =
      enabled ??
      process.argv.includes("--debug") ??
      process.env["DEBUG"] === "true";
  }

  debug(category: string, message: string, data?: unknown): void {
    if (!this.enabled) return;

    this.step++;
    const timestamp = new Date().toISOString();
    const prefix = `${Colors.DEBUG}[DEBUG #${this.step}]${Colors.RESET}`;
    const ts = `${Colors.DIM}${timestamp}${Colors.RESET}`;
    const cat = `${Colors.DEBUG}[${category}]${Colors.RESET}`;

    console.log(`${prefix} ${ts} ${cat} ${message}`);

    if (data !== undefined) {
      const serialized =
        typeof data === "string" ? data : JSON.stringify(data, null, 2);
      // Indent data for readability
      const indented = serialized
        .split("\n")
        .map((line) => `${Colors.DIM}    │ ${line}${Colors.RESET}`)
        .join("\n");
      console.log(indented);
    }
  }
}

/**
 * No-op logger for when debug mode is disabled.
 * Avoids conditional checks scattered throughout the codebase.
 */
export class NullLogger implements ILogger {
  readonly enabled = false;

  debug(_category: string, _message: string, _data?: unknown): void {
    // intentionally empty
  }
}
