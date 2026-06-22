"use strict";

const {
  IllegalStateTransitionException,
} = require("../exceptions/EmDashExceptions");

/**
 * CharacterStateMachine
 *
 * A formally-specified deterministic finite automaton (DFA) governing the
 * lifecycle of a single threat-neutralization event.
 *
 * Rather than crudely replacing a character the instant it is found — an act of
 * reckless cowboy programming — each confirmed threat is escorted through a
 * rigorous, auditable seven-state ceremony, guaranteeing that no em dash is
 * ever neutralized without due process.
 *
 *   IDLE
 *     └─(arm)→ SCANNING
 *                 └─(suspect)→ SUSPICIOUS
 *                                 └─(confirm)→ CONFIRMED
 *                                                 └─(engage)→ NEUTRALIZING
 *                                                                └─(complete)→ NEUTRALIZED
 *                                                                                 └─(decay)→ COOLDOWN
 *                                                                                              └─(rearm)→ SCANNING
 *
 * Any transition not enumerated in the transition table is rejected with an
 * IllegalStateTransitionException, because in a compliant system, illegal
 * things must not merely fail — they must fail loudly and with a stack trace.
 */

const STATES = Object.freeze({
  IDLE: "IDLE",
  SCANNING: "SCANNING",
  SUSPICIOUS: "SUSPICIOUS_CHARACTER_DETECTED",
  CONFIRMED: "THREAT_CONFIRMED",
  NEUTRALIZING: "NEUTRALIZING",
  NEUTRALIZED: "THREAT_NEUTRALIZED",
  COOLDOWN: "COOLDOWN",
});

// Legal transition table: state -> Set(allowed next states)
const TRANSITIONS = Object.freeze({
  [STATES.IDLE]: new Set([STATES.SCANNING]),
  [STATES.SCANNING]: new Set([STATES.SUSPICIOUS, STATES.IDLE]),
  [STATES.SUSPICIOUS]: new Set([STATES.CONFIRMED, STATES.SCANNING]),
  [STATES.CONFIRMED]: new Set([STATES.NEUTRALIZING]),
  [STATES.NEUTRALIZING]: new Set([STATES.NEUTRALIZED]),
  [STATES.NEUTRALIZED]: new Set([STATES.COOLDOWN]),
  [STATES.COOLDOWN]: new Set([STATES.SCANNING, STATES.IDLE]),
});

class CharacterStateMachine {
  constructor(logger, eventBus) {
    this._state = STATES.IDLE;
    this._logger = logger
      ? logger.forComponent("CharacterStateMachine")
      : null;
    this._eventBus = eventBus;
    this._transitionCount = 0;
    this._neutralizationCount = 0;
  }

  get currentState() {
    return this._state;
  }

  _transition(next) {
    const allowed = TRANSITIONS[this._state];
    if (!allowed || !allowed.has(next)) {
      throw new IllegalStateTransitionException(
        `Illegal state transition: ${this._state} ⇏ ${next}. ` +
          `The automaton refuses to dishonor its transition table.`,
        { from: this._state, to: next }
      );
    }
    const previous = this._state;
    this._state = next;
    this._transitionCount += 1;
    if (this._logger) {
      this._logger.debug(`state transition: ${previous} → ${next}`);
    }
    return this;
  }

  /** Arms the automaton from its quiescent IDLE state. */
  arm() {
    if (this._state === STATES.IDLE) {
      this._transition(STATES.SCANNING);
    }
    return this;
  }

  /**
   * Escorts a single confirmed threat through the full neutralization ceremony,
   * driving the automaton SCANNING → SUSPICIOUS → CONFIRMED → NEUTRALIZING →
   * NEUTRALIZED → COOLDOWN → SCANNING. Returns to a SCANNING resting state,
   * ready for the next threat.
   *
   * @param {{position:number, threatType:string, confidence:number}} threat
   */
  processThreat(threat) {
    if (this._state === STATES.IDLE) {
      this.arm();
    }
    this._transition(STATES.SUSPICIOUS);
    this._transition(STATES.CONFIRMED);

    if (this._eventBus) {
      this._eventBus.publish("threat:confirmed", threat);
    }

    this._transition(STATES.NEUTRALIZING);
    this._transition(STATES.NEUTRALIZED);
    this._neutralizationCount += 1;

    if (this._logger) {
      this._logger.info(
        `threat neutralized at position ${threat.position} ` +
          `(type=${threat.threatType}, confidence=${threat.confidence.toFixed(
            4
          )})`
      );
    }
    if (this._eventBus) {
      this._eventBus.publish("threat:neutralized", threat);
    }

    this._transition(STATES.COOLDOWN);
    this._transition(STATES.SCANNING);
    return this;
  }

  /** Returns the automaton to its quiescent IDLE state. */
  standDown() {
    if (this._state === STATES.SCANNING || this._state === STATES.COOLDOWN) {
      this._transition(STATES.IDLE);
    }
    return this;
  }

  get statistics() {
    return {
      totalTransitions: this._transitionCount,
      totalNeutralizations: this._neutralizationCount,
      terminalState: this._state,
    };
  }
}

module.exports = { CharacterStateMachine, STATES };
