"use strict";

const { Step } = require("./Step");

/**
 * Step VIII — Mock Trial
 *
 * Each suspect is tried before the Court of Typographic Criminality.
 * The prosecution reads the Morse scroll into evidence. The defence
 * is court-appointed and chronically unprepared. Verdict: guilty.
 * Sentence: replacement by a spaced hyphen, to be carried out later,
 * after notarization, postage, and appeals.
 */
class MockTrialStep extends Step {
  constructor() {
    super({
      number: 8,
      name: "Mock Trial",
      motto: "Guilty until proven aesthetic — which is never.",
    });
  }

  perform(ctx) {
    const cases = ctx.suspects.map((s, i) => {
      const caseNo = `CTC-${new Date().getFullYear()}-${String(i + 1).padStart(4, "0")}`;
      return {
        caseNo,
        defendant: s,
        charges: [
          "Aggravated Interruption of a Clause",
          "Impersonation of a Pause",
          "Conspiracy to Undermine the Semicolon",
          s.type === "double-hyphen"
            ? "Fraudulent Disguise as Two Hyphens"
            : "Unlawful Occupation of U+2014",
        ],
        prosecution: "Office of the AntiEm Attorney General",
        defence: "Public Defender for Lost Causes, Esq.",
        evidenceEntered: [
          "Unicode genealogy extract",
          "Morse threat signature",
          "Parliamentary expulsion resolution",
          "Carbon date lab triplicate",
        ],
        jury: "twelve angry hyphens",
        verdict: "GUILTY on all counts",
        sentence:
          "To be stricken from the corpus and replaced with a civilized spaced hyphen (' - '), sentence stayed pending notarization, postage, and appeals.",
        gavelStrikes: 3,
        stamp: ctx.stamp("GUILTY"),
      };
    });

    const form = ctx.fileForm("FORM-TRIAL-008-H");
    ctx.artifacts.trialTranscript = {
      ...form,
      court: "Court of Typographic Criminality",
      judge: "The Hon. Justice En-Dash-No-More",
      bailiff: "Court Officer Parentheses",
      cases,
      courtroomSketch: `
        [jury of hyphens]     [judge]
              |                  |
         [defendant —]     [prosecutor]
              \\               /
               [public gallery of commas]
      `,
      stamp: ctx.stamp("SO ORDERED"),
    };

    ctx.log(this.name, `Tried ${cases.length} case(s); conviction rate 100%.`);
    ctx.metrics.stepsCompleted += 1;
    ctx.metrics.linesOfBureaucracy += 18 + cases.length * 8;
    return ctx;
  }
}

module.exports = { MockTrialStep };
