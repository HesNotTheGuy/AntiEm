"use strict";

const { AbstractPipelineStage } = require("../PipelineStage");

/**
 * Stage 2 of 6 — ClassificationStage
 *
 * Performs a single left-to-right sweep of the token stream, submitting each
 * position to the NeuralDashClassifier for probabilistic threat classification.
 * The output is a segmentation of the corpus into contiguous spans, each tagged
 * with its predicted threat type, model confidence, and the strategy that
 * adjudicated it.
 *
 * Multi-token threats (e.g. the two-token double hyphen) are coalesced into a
 * single segment of the appropriate span, and the sweep cursor advances past
 * the consumed tokens to prevent double-counting.
 */
class ClassificationStage extends AbstractPipelineStage {
  constructor(logger, neuralClassifier, configuration) {
    super(logger);
    this._classifier = neuralClassifier;
    this._config = configuration;
  }

  process(context) {
    const tokens = context.tokens;
    const segments = [];
    let threatsDetected = 0;
    let i = 0;

    while (i < tokens.length) {
      const prediction = this._classifier.classify(tokens, i);
      const isThreat =
        prediction.threatType !== "BENIGN" &&
        prediction.confidence >= this._config.neuralConfidenceThreshold;

      if (isThreat) {
        const chars = tokens
          .slice(i, i + prediction.span)
          .map((t) => t.char)
          .join("");
        segments.push({
          startIndex: i,
          chars,
          threatType: prediction.threatType,
          confidence: prediction.confidence,
          strategy: prediction.strategy,
          span: prediction.span,
          isThreat: true,
        });
        threatsDetected += 1;
        i += prediction.span;
      } else {
        segments.push({
          startIndex: i,
          chars: tokens[i].char,
          threatType: "BENIGN",
          confidence: prediction.confidence,
          strategy: null,
          span: 1,
          isThreat: false,
        });
        i += 1;
      }
    }

    context.segments = segments;
    context.metrics.threatsDetected = threatsDetected;
    context.metrics.inferenceCount = this._classifier.inferenceCount;
    if (this._logger) {
      this._logger.info(
        `Classification sweep complete: ${threatsDetected} threat segment(s) ` +
          `identified across ${segments.length} total segment(s)`
      );
    }
    return context;
  }
}

module.exports = { ClassificationStage };
