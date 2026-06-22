"use strict";

const { ConfigurationException } = require("../exceptions/EmDashExceptions");

/**
 * RemediationConfiguration (immutable value object)
 *
 * Encapsulates the complete, validated configuration surface governing a
 * single em dash remediation engagement. Instances are frozen on construction
 * to guarantee referential transparency across the pipeline.
 */
class RemediationConfiguration {
  constructor(props) {
    this.aggressiveMode = props.aggressiveMode;
    this.blockchainAuditingEnabled = props.blockchainAuditingEnabled;
    this.proofOfWorkDifficulty = props.proofOfWorkDifficulty;
    this.neuralConfidenceThreshold = props.neuralConfidenceThreshold;
    this.logLevel = props.logLevel;
    this.enableColor = props.enableColor;
    this.collapseRedundantWhitespace = props.collapseRedundantWhitespace;
    this.maxThreatToleranceLevel = props.maxThreatToleranceLevel;
    Object.freeze(this);
  }
}

/**
 * ConfigurationBuilder
 *
 * A fluent, self-validating builder implementing the Builder pattern (GoF,
 * 1994) for the safe, incremental construction of RemediationConfiguration
 * value objects. Each `withX` mutator returns `this` to enable method
 * chaining, because typing `config.aggressiveMode = true` would be far too
 * direct and would not demonstrate sufficient architectural maturity.
 */
class ConfigurationBuilder {
  constructor() {
    this._props = {
      aggressiveMode: false,
      blockchainAuditingEnabled: true,
      proofOfWorkDifficulty: 2,
      neuralConfidenceThreshold: 0.5,
      logLevel: 20, // DEBUG
      enableColor: true,
      collapseRedundantWhitespace: true,
      maxThreatToleranceLevel: 0,
    };
  }

  withAggressiveMode(enabled) {
    this._props.aggressiveMode = Boolean(enabled);
    return this;
  }

  withBlockchainAuditing(enabled) {
    this._props.blockchainAuditingEnabled = Boolean(enabled);
    return this;
  }

  withProofOfWorkDifficulty(difficulty) {
    if (!Number.isInteger(difficulty) || difficulty < 0 || difficulty > 6) {
      throw new ConfigurationException(
        "proofOfWorkDifficulty must be an integer in the range [0, 6]. " +
          "Values above 6 risk heat death of the universe before remediation completes.",
        { provided: difficulty }
      );
    }
    this._props.proofOfWorkDifficulty = difficulty;
    return this;
  }

  withNeuralConfidenceThreshold(threshold) {
    if (typeof threshold !== "number" || threshold < 0 || threshold > 1) {
      throw new ConfigurationException(
        "neuralConfidenceThreshold must be a probability in [0, 1].",
        { provided: threshold }
      );
    }
    this._props.neuralConfidenceThreshold = threshold;
    return this;
  }

  withLogLevel(level) {
    this._props.logLevel = level;
    return this;
  }

  withColor(enabled) {
    this._props.enableColor = Boolean(enabled);
    return this;
  }

  withWhitespaceReconciliation(enabled) {
    this._props.collapseRedundantWhitespace = Boolean(enabled);
    return this;
  }

  /**
   * Finalizes construction, validates cross-field invariants, and emits an
   * immutable RemediationConfiguration. Throws ConfigurationException if the
   * accumulated configuration violates business rules.
   */
  build() {
    if (
      this._props.proofOfWorkDifficulty > 0 &&
      !this._props.blockchainAuditingEnabled
    ) {
      // Non-fatal: proof-of-work without a ledger to write to is merely wasteful,
      // not illegal. We log nothing here because the builder has no logger,
      // which is itself an architectural decision we stand behind.
      this._props.proofOfWorkDifficulty = 0;
    }
    return new RemediationConfiguration(this._props);
  }

  /** Convenience factory returning the canonical default configuration. */
  static default() {
    return new ConfigurationBuilder().build();
  }
}

module.exports = { ConfigurationBuilder, RemediationConfiguration };
