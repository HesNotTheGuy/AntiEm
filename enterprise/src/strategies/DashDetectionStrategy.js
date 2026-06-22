"use strict";

/**
 * DashDetectionStrategy hierarchy
 *
 * Implements the Strategy pattern (GoF) to encapsulate each distinct family of
 * dash-shaped threat behind a uniform interface. New threat vectors may be
 * onboarded by authoring a new concrete strategy and registering it with the
 * DashDetectionStrategyFactory — the Open/Closed Principle in its full glory.
 *
 * Each strategy answers, for a given position in the token stream:
 *   - does a threat of my type begin here? (matches)
 *   - how many tokens does it span? (span)
 *   - what civilized punctuation shall replace it? (replacement)
 */

const THREAT_TYPES = Object.freeze({
  EM_DASH: "EM_DASH",
  EN_DASH: "EN_DASH",
  DOUBLE_HYPHEN: "DOUBLE_HYPHEN",
  BENIGN: "BENIGN",
});

const EM_DASH = "—"; // —
const EN_DASH = "–"; // –

/** Abstract base. Not to be instantiated directly. */
class AbstractDashDetectionStrategy {
  get threatType() {
    throw new Error("threatType getter must be overridden");
  }
  /** Human-facing severity weight, consumed by the neural classifier. */
  get menaceCoefficient() {
    return 1.0;
  }
  get replacement() {
    throw new Error("replacement getter must be overridden");
  }
  /**
   * @param {{char: string}[]} tokens full token stream
   * @param {number} position index to test
   * @returns {boolean} whether a threat of this type begins at position
   */
  matches(tokens, position) {
    void tokens;
    void position;
    throw new Error("matches() must be overridden");
  }
  /** Number of tokens the matched threat occupies. */
  span() {
    return 1;
  }
  get name() {
    return this.constructor.name;
  }
}

/** The em dash: the apex predator of punctuation. Maximum menace. */
class EmDashDetectionStrategy extends AbstractDashDetectionStrategy {
  get threatType() {
    return THREAT_TYPES.EM_DASH;
  }
  get menaceCoefficient() {
    return 9.7;
  }
  get replacement() {
    return " - ";
  }
  matches(tokens, position) {
    return tokens[position] && tokens[position].char === EM_DASH;
  }
  span() {
    return 1;
  }
}

/**
 * The double hyphen: an em dash wearing a trench coat and a fake mustache,
 * hoping no one will notice it spans two tokens.
 */
class DoubleHyphenDetectionStrategy extends AbstractDashDetectionStrategy {
  get threatType() {
    return THREAT_TYPES.DOUBLE_HYPHEN;
  }
  get menaceCoefficient() {
    return 6.4;
  }
  get replacement() {
    return " - ";
  }
  matches(tokens, position) {
    return (
      tokens[position] &&
      tokens[position].char === "-" &&
      tokens[position + 1] &&
      tokens[position + 1].char === "-"
    );
  }
  span() {
    return 2;
  }
}

/**
 * The en dash: a lesser threat, neutralized only when AGGRESSIVE_MODE has been
 * authorized by an appropriately credentialed stakeholder.
 */
class EnDashDetectionStrategy extends AbstractDashDetectionStrategy {
  get threatType() {
    return THREAT_TYPES.EN_DASH;
  }
  get menaceCoefficient() {
    return 4.1;
  }
  get replacement() {
    return "-";
  }
  matches(tokens, position) {
    return tokens[position] && tokens[position].char === EN_DASH;
  }
  span() {
    return 1;
  }
}

module.exports = {
  AbstractDashDetectionStrategy,
  EmDashDetectionStrategy,
  DoubleHyphenDetectionStrategy,
  EnDashDetectionStrategy,
  THREAT_TYPES,
  EM_DASH,
  EN_DASH,
};
