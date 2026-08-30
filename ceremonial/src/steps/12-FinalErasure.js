"use strict";

const { Step } = require("./Step");

const EM = "\u2014";
const EN = "\u2013";

/**
 * Step XII — Final Erasure
 *
 * THE ONLY STEP THAT IS ALLOWED TO TOUCH THE CORPUS.
 *
 * After eleven stations of bureaucracy, we finally perform the sacred rite:
 * replace em dashes (and optionally en dashes) with civilized spaced hyphens,
 * collapse redundant whitespace, and issue an Erasure Certificate.
 *
 * Equivalent to: text.replaceAll("—", " - ")
 * Estimated overhead: approximately twelve steps of theatre.
 */
class FinalErasureStep extends Step {
  constructor() {
    super({
      number: 12,
      name: "Final Erasure",
      motto: "Now — and only now — may the glyph be struck.",
    });
  }

  perform(ctx) {
    let text = ctx.corpus;
    let neutralized = 0;

    const beforeEm = (text.match(new RegExp(EM, "g")) || []).length;
    text = text.split(EM).join(" - ");
    neutralized += beforeEm;

    const beforeDbl = (text.match(/--/g) || []).length;
    text = text.split("--").join(" - ");
    neutralized += beforeDbl;

    if (ctx.options.aggressive) {
      const beforeEn = (text.match(new RegExp(EN, "g")) || []).length;
      text = text.split(EN).join("-");
      neutralized += beforeEn;
    }

    text = text.replace(/ {2,}/g, " ");

    ctx.corpus = text;
    ctx.metrics.threatsNeutralized = neutralized;

    const form = ctx.fileForm("FORM-ERASURE-012-L");
    ctx.artifacts.erasureCertificate = {
      ...form,
      method: "Authorized spaced-hyphen substitution (Doctrine XII)",
      threatsNeutralized: neutralized,
      priorStepsRequired: 11,
      oneLinerWeCouldHaveUsed: 'text.replaceAll("—", " - ")',
      outputPreview: text.length > 120 ? text.slice(0, 117) + "..." : text,
      executioner: "Step XII Erasure Crew",
      witnessedBy: [
        "Chair of the Subcommittee",
        "Notary A. Quill",
        "Postal Carrier ∅",
        "the ghost of Strunk & White",
      ],
      stamp: ctx.stamp("ERASED"),
    };

    ctx.log(this.name, `Erased ${neutralized} threat(s). The corpus is clean. The paperwork is eternal.`, {
      neutralized,
    });
    ctx.metrics.stepsCompleted += 1;
    ctx.metrics.linesOfBureaucracy += 16;
    return ctx;
  }
}

module.exports = { FinalErasureStep };
