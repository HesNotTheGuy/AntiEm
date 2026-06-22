"use strict";

/**
 * TextProcessingPipeline
 *
 * The orchestral conductor of the Pipes-and-Filters remediation flow. Holds an
 * ordered, immutable sequence of pipeline stages and threads a single
 * RemediationContext through each in turn, fail-fast on the first stage to
 * raise.
 *
 * The pipeline is deliberately agnostic to the concrete identity of its stages;
 * it knows only that each honors the AbstractPipelineStage contract. Stages may
 * therefore be reordered, inserted, or removed by reconfiguring the IoC wiring
 * alone, without modification to this class — a flexibility we will never use.
 */
class TextProcessingPipeline {
  constructor(stages, logger) {
    this._stages = stages;
    this._logger = logger
      ? logger.forComponent("TextProcessingPipeline")
      : null;
  }

  /**
   * Executes every stage in sequence against the supplied context.
   * @param {object} context the RemediationContext to process
   * @returns {object} the fully-enriched context
   */
  run(context) {
    if (this._logger) {
      this._logger.info(
        `Initiating ${this._stages.length}-stage remediation pipeline`
      );
    }
    let current = context;
    let stageNumber = 0;
    for (const stage of this._stages) {
      stageNumber += 1;
      if (this._logger) {
        this._logger.debug(
          `→ Stage ${stageNumber}/${this._stages.length}: ${stage.stageName}`
        );
      }
      current = stage.execute(current);
    }
    if (this._logger) {
      this._logger.info("Remediation pipeline drained successfully");
    }
    return current;
  }

  get stageCount() {
    return this._stages.length;
  }
}

module.exports = { TextProcessingPipeline };
