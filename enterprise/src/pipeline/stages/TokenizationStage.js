"use strict";

const { AbstractPipelineStage } = require("../PipelineStage");

/**
 * Stage 1 of 6 — TokenizationStage
 *
 * Decomposes the raw input corpus into an ordered stream of atomic character
 * tokens, each annotated with its zero-based positional index. Iteration is
 * performed over Unicode code points (not UTF-16 code units) so that the
 * tokenizer remains correct in the presence of astral-plane characters, a
 * robustness guarantee no em dash will ever actually exercise but which we
 * provide regardless.
 */
class TokenizationStage extends AbstractPipelineStage {
  process(context) {
    const tokens = [];
    let index = 0;
    for (const char of context.rawInput) {
      tokens.push({ index, char });
      index += 1;
    }
    context.tokens = tokens;
    context.metrics.tokenCount = tokens.length;
    if (this._logger) {
      this._logger.info(
        `Tokenized input corpus into ${tokens.length} atomic character token(s)`
      );
    }
    return context;
  }
}

module.exports = { TokenizationStage };
