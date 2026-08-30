"use strict";

const { CeremonyContext } = require("./CeremonyContext");
const { WaiverSigningStep } = require("./steps/01-WaiverSigning");
const { UnicodeGenealogyStep } = require("./steps/02-UnicodeGenealogy");
const { MorseTransliterationStep } = require("./steps/03-MorseTransliteration");
const { ParliamentaryInquiryStep } = require("./steps/04-ParliamentaryInquiry");
const { CarbonDatingStep } = require("./steps/05-CarbonDating");
const { AstrologicalClearanceStep } = require("./steps/06-AstrologicalClearance");
const { SubcommitteeFormationStep } = require("./steps/07-SubcommitteeFormation");
const { MockTrialStep } = require("./steps/08-MockTrial");
const { NotarizationStep } = require("./steps/09-Notarization");
const { PostalOblivionStep } = require("./steps/10-PostalOblivion");
const { AppealsTribunalStep } = require("./steps/11-AppealsTribunal");
const { FinalErasureStep } = require("./steps/12-FinalErasure");
const { VictoryParadeStep } = require("./steps/13-VictoryParade");

/**
 * CeremonyConductor
 *
 * Orchestrates the thirteen-step Em Dash Extinction Ceremony.
 * Steps I–XI and XIII generate paperwork. Step XII deletes the em dash.
 * This is the correct order of operations for a mature organization.
 */
class CeremonyConductor {
  constructor(options = {}) {
    this.options = options;
    this.steps = [
      new WaiverSigningStep(),
      new UnicodeGenealogyStep(),
      new MorseTransliterationStep(),
      new ParliamentaryInquiryStep(),
      new CarbonDatingStep(),
      new AstrologicalClearanceStep(),
      new SubcommitteeFormationStep(),
      new MockTrialStep(),
      new NotarizationStep(),
      new PostalOblivionStep(),
      new AppealsTribunalStep(),
      new FinalErasureStep(),
      new VictoryParadeStep(),
    ];
  }

  /**
   * Conduct a full ceremony.
   * @param {string} corpus
   * @returns {CeremonyContext}
   */
  conduct(corpus) {
    let ctx = new CeremonyContext(corpus, this.options);
    const sink = this.options.sink || (this.options.verbose ? defaultSink : null);

    if (sink) {
      sink("");
      sink("╔══════════════════════════════════════════════════════════╗");
      sink("║   AntiEm Ceremonial Edition — Extinction Ceremony      ║");
      sink("║   Thirteen steps. One deletion. Infinite paperwork.    ║");
      sink("╚══════════════════════════════════════════════════════════╝");
      sink("");
    }

    for (const step of this.steps) {
      if (sink) {
        sink(step.banner());
      }
      ctx = step.perform(ctx);
      if (sink) {
        const last = ctx.stepLog[ctx.stepLog.length - 1];
        sink(`   → ${last.message}`);
        sink("");
      }
    }

    if (sink) {
      sink(renderExecutiveSummary(ctx));
    }

    return ctx;
  }
}

function defaultSink(line) {
  console.error(line);
}

function renderExecutiveSummary(ctx) {
  const m = ctx.metrics;
  const lines = [
    "  POST-CEREMONY EXECUTIVE SUMMARY",
    "  ════════════════════════════════════════════════════════",
    `  Characters processed          : ${m.charactersProcessed}`,
    `  Threats neutralized           : ${m.threatsNeutralized}`,
    `  Steps completed               : ${m.stepsCompleted}`,
    `  Forms filed                   : ${m.formsFiled}`,
    `  Rubber stamps applied         : ${m.rubberStampsApplied}`,
    `  Committee meetings held       : ${m.committeeMeetingsHeld}`,
    `  Appeals heard (all denied)    : ${m.appealsHeard}`,
    `  Tracking numbers issued       : ${m.trackingNumbersIssued}`,
    `  Lines of bureaucracy          : ${m.linesOfBureaucracy}`,
    `  Actual deletion steps         : 1  (Step XII)`,
    `  Efficiency                    : spiritually negative`,
    `  Equivalent one-liner          : text.replaceAll("—", " - ")`,
    "",
  ];
  return lines.join("\n");
}

module.exports = { CeremonyConductor, renderExecutiveSummary };
