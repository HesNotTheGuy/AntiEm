"use strict";

const { Step } = require("./Step");
const crypto = require("crypto");

/**
 * Step I — Waiver Signing
 *
 * Before any em dash may be contemplated for removal, the operator must
 * acknowledge that string.replaceAll would have been faster, cheaper, and
 * emotionally healthier. The ceremony records this confession and proceeds.
 */
class WaiverSigningStep extends Step {
  constructor() {
    super({
      number: 1,
      name: "Waiver Signing",
      motto: "I understand that a one-liner would suffice, and I proceed anyway.",
    });
  }

  perform(ctx) {
    const form = ctx.fileForm("FORM-WAIVER-001-A");
    const digest = crypto
      .createHash("sha256")
      .update(ctx.originalCorpus)
      .digest("hex")
      .slice(0, 16);

    ctx.artifacts.waiver = {
      ...form,
      acknowledgements: [
        "I have read and rejected the alternative `text.replaceAll(\"—\", \" - \")`.",
        "I accept that this ceremony will take thirteen steps to achieve the same result.",
        "I will not hold AntiEm liable for lost productivity, dignity, or CPU cycles.",
        "I affirm that em dashes have no legitimate use and waive their right to counsel.",
      ],
      corpusFingerprint: digest,
      operatorSignature: ctx.stamp("WAIVED"),
      inkColor: "ceremonial crimson",
    };

    ctx.log(this.name, "Waiver executed; operator has confessed to knowing better.", {
      filingNumber: form.filingNumber,
      fingerprint: digest,
    });
    ctx.metrics.stepsCompleted += 1;
    ctx.metrics.linesOfBureaucracy += 12;
    return ctx;
  }
}

module.exports = { WaiverSigningStep };
