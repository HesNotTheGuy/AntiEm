"use strict";

/**
 * Abstract ceremonial step. Each concrete step must:
 *   1. Have a number, name, and Latin motto
 *   2. Do something theatrical that does not remove the em dash
 *   3. Return the context so the next step can also not remove the em dash
 *
 * Only Step XII is permitted to actually change the corpus. This is Doctrine.
 */
class Step {
  constructor({ number, name, motto }) {
    this.number = number;
    this.name = name;
    this.motto = motto;
  }

  get roman() {
    const map = [
      "",
      "I",
      "II",
      "III",
      "IV",
      "V",
      "VI",
      "VII",
      "VIII",
      "IX",
      "X",
      "XI",
      "XII",
      "XIII",
    ];
    return map[this.number] || String(this.number);
  }

  banner() {
    return `── Step ${this.roman}: ${this.name} ──\n   "${this.motto}"`;
  }

  /**
   * @param {import('../CeremonyContext').CeremonyContext} ctx
   * @returns {import('../CeremonyContext').CeremonyContext}
   */
  perform(ctx) {
    throw new Error(`${this.name} has not been inscribed into the liturgy`);
  }
}

module.exports = { Step };
