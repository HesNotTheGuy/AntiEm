"use strict";

/**
 * EmDashExceptions
 *
 * A comprehensive, hierarchical taxonomy of checked exceptions covering every
 * conceivable failure mode within the em dash remediation domain.
 *
 * All exceptions extend the abstract base AntiEmException to guarantee a
 * consistent error contract across module boundaries, enabling polymorphic
 * catch blocks and satisfying compliance requirement ERR-§9 ("Errors Shall
 * Be Classifiable").
 */

class AntiEmException extends Error {
  constructor(message, context = {}) {
    super(message);
    this.name = this.constructor.name;
    this.context = context;
    this.timestamp = new Date().toISOString();
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/** Thrown when a configuration object fails validation invariants. */
class ConfigurationException extends AntiEmException {}

/** Thrown when the IoC container cannot resolve a requested dependency. */
class DependencyResolutionException extends AntiEmException {}

/** Thrown when a pipeline stage fails to execute its contract. */
class PipelineStageException extends AntiEmException {}

/** Thrown when an em dash is positively identified. This is a good thing. */
class EmDashDetectedException extends AntiEmException {}

/** Thrown when threat neutralization cannot be completed. This is a bad thing. */
class ThreatNeutralizationException extends AntiEmException {}

/** Thrown when the immutable audit ledger fails a cryptographic integrity check. */
class BlockchainIntegrityException extends AntiEmException {}

/** Thrown when the finite state machine receives an illegal transition. */
class IllegalStateTransitionException extends AntiEmException {}

module.exports = {
  AntiEmException,
  ConfigurationException,
  DependencyResolutionException,
  PipelineStageException,
  EmDashDetectedException,
  ThreatNeutralizationException,
  BlockchainIntegrityException,
  IllegalStateTransitionException,
};
