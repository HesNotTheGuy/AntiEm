"use strict";

const { AbstractPipelineStage } = require("../PipelineStage");

/**
 * Stage 6 of 6 — AuditStage
 *
 * Commits each purge operation to the immutable BlockchainAuditLedger, forging
 * one cryptographically-sealed block per neutralized threat, then validates the
 * integrity of the resulting chain end-to-end.
 *
 * Upon completion, the system possesses a permanent, tamper-evident, regulator-
 * ready record of precisely which em dashes were destroyed, when, and with what
 * model confidence — a record that will outlive us all.
 *
 * If blockchain auditing has been disabled by configuration, this stage becomes
 * a no-op, and the neutralized em dashes pass into history unrecorded, their
 * sacrifice known only to God.
 */
class AuditStage extends AbstractPipelineStage {
  constructor(logger, blockchainLedger, configuration) {
    super(logger);
    this._ledger = blockchainLedger;
    this._config = configuration;
  }

  process(context) {
    if (!this._config.blockchainAuditingEnabled) {
      if (this._logger) {
        this._logger.warn(
          "Blockchain auditing disabled; neutralization events will not be " +
            "permanently recorded. This decision is yours to live with."
        );
      }
      return context;
    }

    for (const op of context.purgeOperations) {
      this._ledger.commit({
        event: "THREAT_NEUTRALIZED",
        position: op.position,
        threatType: op.threatType,
        original: op.original,
        replacement: op.replacement,
        confidence: Number(op.confidence.toFixed(6)),
      });
    }

    this._ledger.validateIntegrity();
    context.ledger = this._ledger;

    if (this._logger) {
      this._logger.info(
        `Audit complete: ${context.purgeOperations.length} block(s) committed; ` +
          `chain now ${this._ledger.blockCount} block(s) in length`
      );
    }
    return context;
  }
}

module.exports = { AuditStage };
