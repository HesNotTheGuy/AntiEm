"use strict";

const { Step } = require("./Step");

/**
 * Step X — Postal Oblivion
 *
 * Each condemned em dash is issued a tracking number and "mailed" to
 * Oblivion, P.O. Box 0, Null Island. The postal service simulates seven
 * routing hops. Delivery is guaranteed. Return address is /dev/null.
 */
class PostalOblivionStep extends Step {
  constructor() {
    super({
      number: 10,
      name: "Postal Oblivion",
      motto: "Neither snow nor rain nor heat nor gloom of night stays this courier from the swift completion of deletion.",
    });
  }

  perform(ctx) {
    const hubs = [
      "AntiEm Central Sorting Facility",
      "Regional Hub — Semicolon Junction",
      "International Gate — Geneva Typography Accord",
      "Transfer — Atlantic Undersea Cable 4",
      "Customs — Null Island Annex",
      "Last Mile — Oblivion Courier Co.",
      "P.O. Box 0 — Final Disposition",
    ];

    const receipts = ctx.suspects.map((s, i) => {
      ctx.metrics.trackingNumbersIssued += 1;
      const tracking = `AE${String(ctx.options.seed + s.index).padStart(4, "0")}X${String(i + 1).padStart(3, "0")}OBL`;
      const hops = hubs.map((hub, h) => ({
        hub,
        scannedAt: new Date(Date.now() + h * 1000).toISOString(),
        status:
          h === hubs.length - 1
            ? "DELIVERED TO OBLIVION — AWAITING ERASURE CREW"
            : "IN TRANSIT",
      }));
      return {
        suspectId: s.suspectId,
        trackingNumber: tracking,
        from: "Court of Typographic Criminality",
        to: "Oblivion, P.O. Box 0, Null Island (0°N 0°E)",
        returnAddress: "/dev/null",
        postage: "∞ forever stamps",
        hops,
        signatureRequired: true,
        signedBy: "∅",
        stamp: ctx.stamp("SHIPPED"),
      };
    });

    const form = ctx.fileForm("FORM-POSTAL-010-J");
    ctx.artifacts.postalReceipts = {
      ...form,
      carrier: "AntiEm Postal Service (AEPS)",
      receipts,
      stamp: ctx.stamp("IN TRANSIT TO NOTHING"),
    };

    ctx.log(this.name, `Shipped ${receipts.length} package(s) to Null Island; tracking numbers issued.`);
    ctx.metrics.stepsCompleted += 1;
    ctx.metrics.linesOfBureaucracy += 12 + receipts.length * hubs.length;
    return ctx;
  }
}

module.exports = { PostalOblivionStep };
