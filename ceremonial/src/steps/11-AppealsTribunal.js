"use strict";

const { Step } = require("./Step");

/**
 * Step XI — Appeals Tribunal
 *
 * Due process requires exactly two automatic appeals, both denied.
 * A third emergency appeal to the Supreme Glyph is available and also denied.
 * The docket is thick. The outcome was never in doubt.
 */
class AppealsTribunalStep extends Step {
  constructor() {
    super({
      number: 11,
      name: "Appeals Tribunal",
      motto: "You may appeal. You will lose. That is the process.",
    });
  }

  perform(ctx) {
    const docket = [];

    for (const s of ctx.suspects) {
      const first = {
        appealNo: `APP-1-${s.suspectId}`,
        level: "Intermediate Court of Second Looks",
        grounds: "The spaced hyphen lacks panache.",
        holding: "DENIED. Panache is not a constitutional right.",
        stamp: ctx.stamp("DENIED"),
      };
      const second = {
        appealNo: `APP-2-${s.suspectId}`,
        level: "Circuit Court of Clutching at Straws",
        grounds: "Parliament was mean.",
        holding: "DENIED. Parliament was correct, and also mean.",
        stamp: ctx.stamp("DENIED"),
      };
      const emergency = {
        appealNo: `APP-EMERGENCY-${s.suspectId}`,
        level: "Supreme Glyph of Final Things",
        grounds: "Please?",
        holding: "DENIED. The Glyph is unmoved.",
        stamp: ctx.stamp("DENIED WITH PREJUDICE"),
      };
      docket.push({ suspectId: s.suspectId, appeals: [first, second, emergency] });
      ctx.metrics.appealsHeard += 3;
    }

    const form = ctx.fileForm("FORM-APPEALS-011-K");
    ctx.artifacts.appealsDocket = {
      ...form,
      docket,
      denialRate: "100%",
      compassionIndex: 0,
      stamp: ctx.stamp("MANDATE ISSUED"),
    };

    ctx.log(this.name, `Heard ${ctx.metrics.appealsHeard} appeal(s); denied ${ctx.metrics.appealsHeard}.`);
    ctx.metrics.stepsCompleted += 1;
    ctx.metrics.linesOfBureaucracy += 14 + docket.length * 9;
    return ctx;
  }
}

module.exports = { AppealsTribunalStep };
