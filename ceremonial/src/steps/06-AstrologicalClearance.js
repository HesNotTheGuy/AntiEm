"use strict";

const { Step } = require("./Step");

/**
 * Step VI — Astrological Clearance
 *
 * No em dash may be extinguished while Mercury is in retrograde — unless the
 * operator has filed Form ASTRO-OVERRIDE-77. We consult a deterministic
 * ephemeris (a hash of the date) and either clear the ceremony or stamp an
 * override so the joke can continue on schedule.
 */
class AstrologicalClearanceStep extends Step {
  constructor() {
    super({
      number: 6,
      name: "Astrological Clearance",
      motto: "The heavens must consent, or the paperwork must overrule them.",
    });
  }

  perform(ctx) {
    if (ctx.options.skipAstrology) {
      ctx.artifacts.horoscope = {
        skipped: true,
        reason: "Operator invoked --skip-astrology (bold; noted).",
        stamp: ctx.stamp("ASTRO WAIVED"),
      };
      ctx.log(this.name, "Astrology skipped by executive order.");
      ctx.metrics.stepsCompleted += 1;
      return ctx;
    }

    const mercuryRetrograde =
      ctx.options.mercuryIsInRetrograde !== null
        ? Boolean(ctx.options.mercuryIsInRetrograde)
        : isMercuryRetrogradeToday(ctx.options.seed);

    const signs = [
      "Aries",
      "Taurus",
      "Gemini",
      "Cancer",
      "Leo",
      "Virgo",
      "Libra",
      "Scorpio",
      "Sagittarius",
      "Capricorn",
      "Aquarius",
      "Pisces",
    ];
    const moonSign = signs[(ctx.options.seed + ctx.corpus.length) % 12];

    let clearance;
    let override = null;

    if (mercuryRetrograde) {
      override = ctx.fileForm("FORM-ASTRO-OVERRIDE-77");
      clearance = {
        status: "CLEARED UNDER PROTEST",
        note: "Mercury is retrograde. Override filed. The stars are disappointed but compliant.",
        override,
      };
      ctx.metrics.formsFiled += 0; // already counted in fileForm
    } else {
      clearance = {
        status: "CLEARED",
        note: "Mercury is direct. The firmament green-lights typographic violence.",
      };
    }

    const form = ctx.fileForm("FORM-ASTRO-006-F");
    ctx.artifacts.horoscope = {
      ...form,
      mercuryRetrograde,
      moonSign,
      risingPunctuation: "Semicolon",
      venusAspect: "trine to Hyphen",
      reading: `Today is an excellent day to delete em dashes. The Moon in ${moonSign} favors restraint. Venus trines the Hyphen — a rare auspicious alignment for spaced hyphens.`,
      clearance,
      stamp: ctx.stamp(mercuryRetrograde ? "OVERRIDE" : "AUSPICIOUS"),
    };

    ctx.log(this.name, `Horoscope cast; Mercury retrograde=${mercuryRetrograde}; clearance=${clearance.status}.`);
    ctx.metrics.stepsCompleted += 1;
    ctx.metrics.linesOfBureaucracy += 15;
    return ctx;
  }
}

function isMercuryRetrogradeToday(seed) {
  // Deterministic nonsense: ~28% of days are "retrograde"
  const day = Math.floor(Date.now() / 86400000);
  return ((day * 2654435761 + seed) >>> 0) % 100 < 28;
}

module.exports = { AstrologicalClearanceStep };
