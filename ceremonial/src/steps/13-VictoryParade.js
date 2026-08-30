"use strict";

const { Step } = require("./Step");

/**
 * Step XIII — Victory Parade
 *
 * Confetti, a marching band of commas, and an after-action report.
 * The em dashes are gone. The artifacts remain forever in the filing cabinet.
 */
class VictoryParadeStep extends Step {
  constructor() {
    super({
      number: 13,
      name: "Victory Parade",
      motto: "Celebrate the hyphen. File everything. Never speak of the one-liner.",
    });
  }

  perform(ctx) {
    const form = ctx.fileForm("FORM-VICTORY-013-M");
    const floats = [
      "The Grand Hyphen Float",
      "Semicolon Veterans Association",
      "Marching Band of Commas (fff)",
      "Parentheses Twirlers",
      "Convertibles of Retired Periods",
      "the Open-Source Banner: 'we could have used replaceAll'",
    ];

    ctx.artifacts.victoryParade = {
      ...form,
      route: "from the Courthouse steps to /dev/null and back",
      floats,
      confettiDensity: "irresponsible",
      afterActionReport: {
        originalLength: ctx.originalCorpus.length,
        purifiedLength: ctx.corpus.length,
        threatsNeutralized: ctx.metrics.threatsNeutralized,
        formsFiled: ctx.metrics.formsFiled,
        rubberStampsApplied: ctx.metrics.rubberStampsApplied,
        committeeMeetingsHeld: ctx.metrics.committeeMeetingsHeld,
        appealsHeard: ctx.metrics.appealsHeard,
        trackingNumbersIssued: ctx.metrics.trackingNumbersIssued,
        linesOfBureaucracy: ctx.metrics.linesOfBureaucracy,
        stepsCompleted: ctx.metrics.stepsCompleted + 1,
        efficiencyRating: "spiritually negative",
        recommendation: "Do it again next time an em dash appears.",
      },
      chant: "HEY HEY, HO HO, U+2014 HAS GOT TO GO",
      stamp: ctx.stamp("PARADE PERMITTED"),
    };

    ctx.log(this.name, "Parade concluded. Filing cabinets groan with satisfaction.");
    ctx.metrics.stepsCompleted += 1;
    ctx.metrics.linesOfBureaucracy += 20;
    return ctx;
  }
}

module.exports = { VictoryParadeStep };
