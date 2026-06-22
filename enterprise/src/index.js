"use strict";

/**
 * AntiEm Enterprise Edition™ — Public API Facade
 *
 * Exposes a deceptively simple surface over the full enterprise remediation
 * apparatus. Beneath the humble `purge(text)` call lies a neural network, a
 * finite state machine, a blockchain, a dependency-injection container, an
 * event bus, and a six-stage pipeline — all to turn "—" into " - ".
 *
 * We could have written `text.replaceAll("—", " - ")`. We chose growth.
 */

const {
  EmDashRemediationOrchestrator,
} = require("./core/EmDashRemediationOrchestrator");
const {
  ConfigurationBuilder,
  RemediationConfiguration,
} = require("./config/ConfigurationBuilder");
const { LEVELS } = require("./logging/EnterpriseLogger");

function _resolveConfiguration(options) {
  if (options.configuration instanceof RemediationConfiguration) {
    return options.configuration;
  }
  const builder = new ConfigurationBuilder()
    .withAggressiveMode(Boolean(options.aggressive))
    .withBlockchainAuditing(options.blockchain !== false);
  if (typeof options.proofOfWorkDifficulty === "number") {
    builder.withProofOfWorkDifficulty(options.proofOfWorkDifficulty);
  }
  if (typeof options.confidenceThreshold === "number") {
    builder.withNeuralConfidenceThreshold(options.confidenceThreshold);
  }
  return builder.build();
}

/**
 * Conducts a complete remediation engagement and returns the full structured
 * result, including metrics, purge operations, and the blockchain ledger.
 *
 * @param {string} text corpus to remediate
 * @param {object} [options]
 * @param {boolean} [options.aggressive=false] also neutralize en dashes
 * @param {boolean} [options.blockchain=true] commit an immutable audit trail
 * @param {boolean} [options.verbose=false] stream enterprise logs to stderr
 * @param {(line:string)=>void} [options.sink] custom log sink
 * @param {RemediationConfiguration} [options.configuration] full config override
 * @returns {object} structured remediation result
 */
function remediate(text, options = {}) {
  if (typeof text !== "string") {
    throw new TypeError("remediate(text): text must be a string");
  }
  const configuration = _resolveConfiguration(options);
  const orchestrator = new EmDashRemediationOrchestrator(configuration, {
    sink: options.sink,
    logLevelOverride: options.verbose ? LEVELS.TRACE : LEVELS.SILENT,
  });
  return orchestrator.remediate(text);
}

/**
 * The headline convenience API. Conducts a full enterprise remediation
 * engagement and returns only the purified string, discarding the neural
 * confidence scores, the cryptographic audit ledger, and the procedural
 * due-process record — all of which were, of course, absolutely essential.
 *
 * @param {string} text corpus to remediate
 * @param {object} [options] see {@link remediate}
 * @returns {string} the purified corpus
 */
function purge(text, options = {}) {
  return remediate(text, options).output;
}

module.exports = {
  purge,
  remediate,
  EmDashRemediationOrchestrator,
  ConfigurationBuilder,
  RemediationConfiguration,
  LEVELS,
};
