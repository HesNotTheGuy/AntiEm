"use strict";

const { Step } = require("./Step");

/**
 * Step V — Carbon Dating
 *
 * Each suspect is subjected to radiocarbon analysis to determine when it
 * contaminated the manuscript. Results are always "moments ago, give or take
 * a compiler pass" and are filed in triplicate for the Ministry of Chronology.
 */
class CarbonDatingStep extends Step {
  constructor() {
    super({
      number: 5,
      name: "Carbon Dating",
      motto: "Age the infection; quarantine the epoch.",
    });
  }

  perform(ctx) {
    const dates = ctx.suspects.map((s, i) => {
      const seed = (ctx.options.seed + s.index * 97 + i * 13) >>> 0;
      const bp = 14 + (seed % 2000); // "years before present" of nonsense
      return {
        suspectId: s.suspectId,
        sampleId: `C14-${s.suspectId}`,
        method: "Accelerator Mass Spectrometry (of vibes)",
        yearsBeforePresent: bp,
        calibratedAge: `circa ${new Date().getFullYear() - Math.floor(bp / 100)} (± bureaucracy)`,
        contaminationVector: guessVector(s),
        labNotes:
          "Isotope ratios consistent with AI-generated prose. Recommend extinction.",
        triplicate: {
          white: ctx.stamp("LAB COPY"),
          yellow: ctx.stamp("ARCHIVE COPY"),
          pink: ctx.stamp("MINISTRY COPY"),
        },
      };
    });

    const form = ctx.fileForm("FORM-CARBON-005-E");
    ctx.artifacts.carbonDates = {
      ...form,
      laboratory: "AntiEm Radiocarbon Wing, Basement B",
      samples: dates,
      ambientHum: "fluorescent",
      stamp: ctx.stamp("DATED"),
    };

    ctx.log(this.name, `Carbon-dated ${dates.length} sample(s); all suspiciously modern.`);
    ctx.metrics.stepsCompleted += 1;
    ctx.metrics.linesOfBureaucracy += 10 + dates.length * 4;
    return ctx;
  }
}

function guessVector(s) {
  const vectors = [
    "Large language model effusion",
    "Copy-paste from a thinkpiece",
    "AutoCorrect 'helpfulness'",
    "Writer who once took a creative writing class",
    "Slack message that escaped into a document",
  ];
  return vectors[s.index % vectors.length];
}

module.exports = { CarbonDatingStep };
