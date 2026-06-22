"use strict";

const {
  PipelineStageException,
} = require("../exceptions/EmDashExceptions");

/**
 * RemediationContext
 *
 * The mutable unit-of-work threaded through every stage of the processing
 * pipeline. Each stage enriches the context with its contribution, in the
 * grand tradition of the Pipes-and-Filters architectural style.
 */
class RemediationContext {
  constructor(rawInput, configuration) {
    this.rawInput = rawInput;
    this.config = configuration;
    this.tokens = []; // [{ index, char }]
    this.segments = []; // [{ chars, threatType, confidence, strategy, span, isThreat }]
    this.output = null; // string, populated by PurificationStage
    this.purgeOperations = []; // [{ position, threatType, original, replacement, confidence }]
    this.metrics = {
      tokenCount: 0,
      threatsDetected: 0,
      threatsNeutralized: 0,
      inferenceCount: 0,
    };
  }
}

/**
 * AbstractPipelineStage
 *
 * The Template Method base class for all pipeline stages. Concrete stages
 * override `process(context)`; the base `execute` wraps that call with uniform
 * structured logging and exception translation so that any stage failure is
 * surfaced as a domain-typed PipelineStageException.
 */
class AbstractPipelineStage {
  constructor(logger) {
    this._logger = logger ? logger.forComponent(this.stageName) : null;
  }

  get stageName() {
    return this.constructor.name;
  }

  /** @param {RemediationContext} context */
  process(context) {
    void context;
    throw new Error(`Stage ${this.stageName} must implement process()`);
  }

  execute(context) {
    if (this._logger) {
      this._logger.debug(`Entering stage '${this.stageName}'`);
    }
    try {
      const result = this.process(context);
      if (this._logger) {
        this._logger.debug(`Stage '${this.stageName}' completed nominally`);
      }
      return result || context;
    } catch (err) {
      if (this._logger) {
        this._logger.error(
          `Stage '${this.stageName}' failed: ${err.message}`
        );
      }
      throw new PipelineStageException(
        `Pipeline halted: stage '${this.stageName}' raised ${err.name}: ${err.message}`,
        { stage: this.stageName, cause: err }
      );
    }
  }
}

module.exports = { AbstractPipelineStage, RemediationContext };
