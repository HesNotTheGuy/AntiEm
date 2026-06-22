"use strict";

const { AbstractPipelineStage } = require("../PipelineStage");

/**
 * Stage 3 of 6 — ThreatAssessmentStage
 *
 * Escorts each classified threat segment through the CharacterStateMachine's
 * formal neutralization ceremony. This stage performs no text mutation; its
 * sole responsibility is to advance the deterministic finite automaton through
 * its lawful state sequence for every confirmed threat, thereby generating the
 * procedural due-process record demanded by our internal governance framework.
 *
 * In effect: we do not simply delete em dashes. We hold a brief, dignified
 * ceremony for each one first.
 */
class ThreatAssessmentStage extends AbstractPipelineStage {
  constructor(logger, stateMachine) {
    super(logger);
    this._stateMachine = stateMachine;
  }

  process(context) {
    this._stateMachine.arm();
    let neutralized = 0;

    for (const segment of context.segments) {
      if (!segment.isThreat) continue;
      this._stateMachine.processThreat({
        position: segment.startIndex,
        threatType: segment.threatType,
        confidence: segment.confidence,
      });
      neutralized += 1;
    }

    this._stateMachine.standDown();
    context.metrics.threatsNeutralized = neutralized;

    if (this._logger) {
      const stats = this._stateMachine.statistics;
      this._logger.info(
        `Threat assessment ceremony complete: ${neutralized} threat(s) escorted ` +
          `through ${stats.totalTransitions} lawful state transition(s)`
      );
    }
    return context;
  }
}

module.exports = { ThreatAssessmentStage };
