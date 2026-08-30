"use strict";

/**
 * CeremonyContext
 *
 * The sacred vessel that carries a corpus through every station of the
 * Em Dash Extinction Ceremony. Starts as a string. Accumulates affidavits,
 * Morse scrolls, parliamentary minutes, carbon dates, horoscopes, subcommittee
 * rosters, trial transcripts, notarizations, postal tracking numbers, appeals
 * dockets, and — eventually — a string with the em dashes gone.
 *
 * Yes: the output is still just a string. The rest is liturgy.
 */
class CeremonyContext {
  constructor(corpus, options = {}) {
    if (typeof corpus !== "string") {
      throw new TypeError("CeremonyContext requires a string corpus");
    }
    this.originalCorpus = corpus;
    this.corpus = corpus;
    this.options = {
      aggressive: Boolean(options.aggressive),
      verbose: Boolean(options.verbose),
      skipAstrology: Boolean(options.skipAstrology),
      mercuryIsInRetrograde: options.mercuryIsInRetrograde ?? null,
      seed: options.seed ?? 0xae4d,
    };
    this.stepLog = [];
    this.artifacts = {
      waiver: null,
      genealogy: null,
      morseScroll: null,
      parliamentaryMinutes: null,
      carbonDates: null,
      horoscope: null,
      subcommittee: null,
      trialTranscript: null,
      notarizations: null,
      postalReceipts: null,
      appealsDocket: null,
      erasureCertificate: null,
      victoryParade: null,
    };
    this.suspects = [];
    this.metrics = {
      stepsCompleted: 0,
      formsFiled: 0,
      rubberStampsApplied: 0,
      committeeMeetingsHeld: 0,
      appealsHeard: 0,
      trackingNumbersIssued: 0,
      charactersProcessed: corpus.length,
      threatsNeutralized: 0,
      linesOfBureaucracy: 0,
    };
  }

  log(stepName, message, extra = {}) {
    this.stepLog.push({
      step: stepName,
      at: new Date().toISOString(),
      message,
      ...extra,
    });
  }

  stamp(label = "APPROVED") {
    this.metrics.rubberStampsApplied += 1;
    return `[✧ ${label} ✧ #${String(this.metrics.rubberStampsApplied).padStart(4, "0")}]`;
  }

  fileForm(formId) {
    this.metrics.formsFiled += 1;
    return {
      formId,
      filingNumber: `ANTIEM-${Date.now().toString(36).toUpperCase()}-${this.metrics.formsFiled}`,
      filedAt: new Date().toISOString(),
    };
  }
}

module.exports = { CeremonyContext };
