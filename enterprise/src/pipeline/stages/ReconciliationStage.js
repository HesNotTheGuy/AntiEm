"use strict";

const { AbstractPipelineStage } = require("../PipelineStage");

/**
 * Stage 5 of 6 — ReconciliationStage
 *
 * Performs post-substitution whitespace reconciliation. The replacement of a
 * threat glyph with a spaced hyphen sequence may, in certain adjacencies,
 * yield redundant consecutive whitespace. This stage idempotently collapses
 * any such redundancy to a single space, restoring typographic equilibrium.
 *
 * Reconciliation may be disabled via configuration for operators who, for
 * reasons we do not question, wish to retain their double spaces.
 */
class ReconciliationStage extends AbstractPipelineStage {
  process(context) {
    if (!context.config.collapseRedundantWhitespace) {
      if (this._logger) {
        this._logger.debug(
          "Whitespace reconciliation disabled by configuration; passing through"
        );
      }
      return context;
    }

    const before = context.output;
    const after = before.replace(/ {2,}/g, " ");
    context.output = after;

    if (this._logger) {
      const collapsed = before.length - after.length;
      this._logger.info(
        `Whitespace reconciliation complete: ${collapsed} redundant ` +
          `character(s) reclaimed`
      );
    }
    return context;
  }
}

module.exports = { ReconciliationStage };
