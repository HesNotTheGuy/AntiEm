"use strict";

const { AbstractPipelineStage } = require("../PipelineStage");

/**
 * Stage 4 of 6 — PurificationStage
 *
 * Materializes the remediated output corpus by reducing the classified segment
 * stream into a single purified string. Benign segments are emitted verbatim;
 * threat segments are substituted with the civilized replacement prescribed by
 * their adjudicating strategy. A structured purge operation is recorded for
 * each substitution to feed the downstream immutable audit ledger.
 *
 * This is the precise instant at which the em dash ceases to exist. Observe a
 * respectful moment of silence.
 */
class PurificationStage extends AbstractPipelineStage {
  process(context) {
    const parts = [];
    const purgeOperations = [];

    for (const segment of context.segments) {
      if (segment.isThreat && segment.strategy) {
        const replacement = segment.strategy.replacement;
        parts.push(replacement);
        purgeOperations.push({
          position: segment.startIndex,
          threatType: segment.threatType,
          original: segment.chars,
          replacement,
          confidence: segment.confidence,
        });
      } else {
        parts.push(segment.chars);
      }
    }

    context.output = parts.join("");
    context.purgeOperations = purgeOperations;

    if (this._logger) {
      this._logger.info(
        `Purification complete: ${purgeOperations.length} substitution(s) applied. ` +
          `The corpus is cleaner than it was.`
      );
    }
    return context;
  }
}

module.exports = { PurificationStage };
