"use strict";

const {
  EmDashDetectionStrategy,
  DoubleHyphenDetectionStrategy,
  EnDashDetectionStrategy,
} = require("./DashDetectionStrategy");

/**
 * DashDetectionStrategyFactory
 *
 * An Abstract Factory responsible for the provisioning and prioritized
 * ordering of the active threat-detection strategy ensemble.
 *
 * Strategies are returned in strict descending order of menace, guaranteeing
 * that higher-severity threats (em dashes) are evaluated before their lesser
 * imitators (double hyphens), in conformance with the Threat Prioritization
 * Matrix ratified at the Q3 Punctuation Security Working Group offsite.
 */
class DashDetectionStrategyFactory {
  constructor(configuration, logger) {
    this._config = configuration;
    this._logger = logger
      ? logger.forComponent("DashDetectionStrategyFactory")
      : null;
  }

  /**
   * Materializes the active strategy ensemble for the current engagement,
   * conditionally including the EnDashDetectionStrategy only when the operator
   * has assumed the elevated risk posture of AGGRESSIVE_MODE.
   *
   * @returns {Array} prioritized strategy instances
   */
  createStrategyEnsemble() {
    const ensemble = [
      new EmDashDetectionStrategy(),
      new DoubleHyphenDetectionStrategy(),
    ];

    if (this._config.aggressiveMode) {
      ensemble.push(new EnDashDetectionStrategy());
      if (this._logger) {
        this._logger.warn(
          "AGGRESSIVE_MODE engaged — EnDashDetectionStrategy has been armed. " +
            "Collateral en dash casualties are now considered acceptable."
        );
      }
    }

    // Sort by descending menace to enforce the Threat Prioritization Matrix.
    ensemble.sort((a, b) => b.menaceCoefficient - a.menaceCoefficient);

    if (this._logger) {
      this._logger.info(
        `Provisioned threat-detection ensemble of ${ensemble.length} ` +
          `strategies: [${ensemble.map((s) => s.name).join(", ")}]`
      );
    }
    return ensemble;
  }
}

module.exports = { DashDetectionStrategyFactory };
