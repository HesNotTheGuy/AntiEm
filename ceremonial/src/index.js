"use strict";

/**
 * AntiEm Ceremonial Edition — Public API
 *
 * Removes em dashes by conducting a thirteen-step extinction ceremony
 * involving waivers, genealogy, Morse code, Parliament, carbon dating,
 * astrology, subcommittees, mock trials, notarization, postal shipping
 * to Null Island, appeals (denied), one actual deletion, and a parade.
 *
 * Output is identical to `text.replaceAll("—", " - ")`.
 * Process is not.
 */

const { CeremonyConductor } = require("./CeremonyConductor");
const { CeremonyContext } = require("./CeremonyContext");

/**
 * Conduct the full ceremony and return the purified string.
 */
function purge(text, options = {}) {
  return conduct(text, options).corpus;
}

/**
 * Conduct the full ceremony and return the entire context (artifacts, metrics, logs).
 */
function conduct(text, options = {}) {
  if (typeof text !== "string") {
    throw new TypeError("conduct(text): text must be a string");
  }
  const conductor = new CeremonyConductor(options);
  return conductor.conduct(text);
}

/**
 * Inspect suspects without running the full liturgy past genealogy.
 * (Still runs Steps I–II, because the waiver is non-negotiable.)
 */
function previewSuspects(text, options = {}) {
  const { WaiverSigningStep } = require("./steps/01-WaiverSigning");
  const { UnicodeGenealogyStep } = require("./steps/02-UnicodeGenealogy");
  let ctx = new CeremonyContext(text, options);
  ctx = new WaiverSigningStep().perform(ctx);
  ctx = new UnicodeGenealogyStep().perform(ctx);
  return ctx.suspects;
}

module.exports = {
  purge,
  conduct,
  previewSuspects,
  CeremonyConductor,
  CeremonyContext,
};
