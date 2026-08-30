"use strict";

const { Step } = require("./Step");
const crypto = require("crypto");

/**
 * Step IX — Notarization
 *
 * Every guilty verdict is embossed with a notarial seal, an embossing
 * certificate number, and a declaration that the undersigned personally
 * appeared before the notary (they did not; the notary is a function).
 */
class NotarizationStep extends Step {
  constructor() {
    super({
      number: 9,
      name: "Notarization",
      motto: "If it is not stamped in triplicate, it did not happen.",
    });
  }

  perform(ctx) {
    const cases = ctx.artifacts.trialTranscript?.cases || [];
    const notarizations = cases.map((c) => {
      const seal = crypto
        .createHash("sha1")
        .update(c.caseNo + c.defendant.suspectId)
        .digest("hex")
        .slice(0, 12)
        .toUpperCase();
      return {
        caseNo: c.caseNo,
        suspectId: c.defendant.suspectId,
        notaryPublic: "A. Quill, Commission Expires Never",
        commissionId: `NTRY-${seal}`,
        jurat:
          "Subscribed and sworn before me, a Notary Public of the Realm of Clean Prose, that the defendant is guilty and the spaced hyphen stands ready.",
        embossedSeal: ctx.stamp(`NOTARY ${seal.slice(0, 6)}`),
        redWax: true,
        ribbonColor: "burgundy",
      };
    });

    const form = ctx.fileForm("FORM-NOTARY-009-I");
    ctx.artifacts.notarizations = {
      ...form,
      notarizations,
      county: "County of Kerning",
      stamp: ctx.stamp("EMBOSSED"),
    };

    ctx.log(this.name, `Notarized ${notarizations.length} verdict(s) with red wax and burgundy ribbon.`);
    ctx.metrics.stepsCompleted += 1;
    ctx.metrics.linesOfBureaucracy += 10 + notarizations.length * 3;
    return ctx;
  }
}

module.exports = { NotarizationStep };
