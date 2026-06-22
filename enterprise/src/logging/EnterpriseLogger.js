"use strict";

/**
 * EnterpriseLogger
 *
 * A fully-featured, structured, leveled logging subsystem providing
 * enterprise-grade observability across the em dash remediation lifecycle.
 *
 * Supports five (5) industry-standard severity levels and component-scoped
 * child loggers in accordance with internal logging governance policy
 * LOG-2017-§4.2 ("On The Matter Of Knowing What The Software Is Doing").
 */

const LEVELS = Object.freeze({
  TRACE: 10,
  DEBUG: 20,
  INFO: 30,
  WARN: 40,
  ERROR: 50,
  SILENT: 100,
});

const LEVEL_LABELS = Object.freeze({
  10: "TRACE",
  20: "DEBUG",
  30: "INFO ",
  40: "WARN ",
  50: "ERROR",
});

const ANSI = Object.freeze({
  TRACE: "\x1b[90m",
  DEBUG: "\x1b[36m",
  INFO: "\x1b[32m",
  WARN: "\x1b[33m",
  ERROR: "\x1b[31m",
  RESET: "\x1b[0m",
  DIM: "\x1b[2m",
});

class EnterpriseLogger {
  constructor(component, options = {}) {
    this._component = component || "Application";
    this._threshold =
      options.level !== undefined ? options.level : LEVELS.DEBUG;
    this._useColor = options.color !== undefined ? options.color : true;
    this._sink = options.sink || ((line) => process.stderr.write(line + "\n"));
  }

  /**
   * Constructs a component-scoped child logger, inheriting the parent's
   * threshold and sink configuration. This is the Composite pattern. Probably.
   */
  forComponent(component) {
    return new EnterpriseLogger(component, {
      level: this._threshold,
      color: this._useColor,
      sink: this._sink,
    });
  }

  _emit(levelValue, message) {
    if (levelValue < this._threshold) return;
    const label = LEVEL_LABELS[levelValue];
    const timestamp = new Date().toISOString();
    const colorKey = label.trim();
    let line;
    if (this._useColor) {
      line =
        `${ANSI.DIM}${timestamp}${ANSI.RESET} ` +
        `${ANSI[colorKey] || ""}[${label}]${ANSI.RESET} ` +
        `${ANSI.DIM}[${this._component}]${ANSI.RESET} ${message}`;
    } else {
      line = `${timestamp} [${label}] [${this._component}] ${message}`;
    }
    this._sink(line);
  }

  trace(message) {
    this._emit(LEVELS.TRACE, message);
  }
  debug(message) {
    this._emit(LEVELS.DEBUG, message);
  }
  info(message) {
    this._emit(LEVELS.INFO, message);
  }
  warn(message) {
    this._emit(LEVELS.WARN, message);
  }
  error(message) {
    this._emit(LEVELS.ERROR, message);
  }
}

module.exports = { EnterpriseLogger, LEVELS };
