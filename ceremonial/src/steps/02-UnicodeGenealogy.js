"use strict";

const { Step } = require("./Step");

const EM = "\u2014";
const EN = "\u2013";

/**
 * Step II — Unicode Genealogy
 *
 * Every character is assigned a bloodline, house, and ancestral Unicode block.
 * Em dashes are flagged as members of the House of General Punctuation —
 * a lineage of known troublemakers since Unicode 1.1 (1993).
 */
class UnicodeGenealogyStep extends Step {
  constructor() {
    super({
      number: 2,
      name: "Unicode Genealogy",
      motto: "Know thy enemy by their code point, block, and shameful ancestry.",
    });
  }

  _lineage(ch) {
    const cp = ch.codePointAt(0);
    const hex = "U+" + cp.toString(16).toUpperCase().padStart(4, "0");
    if (ch === EM) {
      return {
        char: ch,
        codePoint: hex,
        house: "House of General Punctuation",
        bloodline: "Em Dash (EM DASH)",
        yearOfInfamy: 1993,
        threat: true,
        type: "em-dash",
        epithet: "the uninvited guest",
      };
    }
    if (ch === EN) {
      return {
        char: ch,
        codePoint: hex,
        house: "House of General Punctuation",
        bloodline: "En Dash (EN DASH)",
        yearOfInfamy: 1993,
        threat: false,
        type: "en-dash",
        epithet: "the lesser cousin",
      };
    }
    return {
      char: ch,
      codePoint: hex,
      house: classifyHouse(cp),
      bloodline: "Civilian",
      threat: false,
      type: "civilian",
      epithet: null,
    };
  }

  perform(ctx) {
    const chars = Array.from(ctx.corpus);
    const genealogy = [];
    const suspects = [];

    for (let i = 0; i < chars.length; i++) {
      const ch = chars[i];
      let entry;

      if (ch === "-" && chars[i + 1] === "-") {
        entry = {
          index: i,
          char: "--",
          codePoint: "U+002D U+002D",
          house: "House of Basic Latin (in disguise)",
          bloodline: "Double Hyphen — an em dash wearing a trench coat",
          yearOfInfamy: "since forever",
          threat: true,
          type: "double-hyphen",
          epithet: "the impostor",
        };
        i += 1;
      } else if (ch === EM) {
        entry = { index: i, ...this._lineage(ch), threat: true };
      } else if (ch === EN) {
        entry = {
          index: i,
          ...this._lineage(ch),
          threat: Boolean(ctx.options.aggressive),
        };
        if (!ctx.options.aggressive) {
          entry.threat = false;
          entry.clemency = "spared under standard doctrine; aggressive mode not engaged";
        }
      } else {
        entry = { index: i, ...this._lineage(ch) };
      }

      genealogy.push(entry);
      if (entry.threat) {
        suspects.push({
          suspectId: `SUS-${String(suspects.length + 1).padStart(3, "0")}`,
          index: entry.index,
          type: entry.type,
          char: entry.char,
          epithet: entry.epithet,
          house: entry.house,
        });
      }
    }

    const form = ctx.fileForm("FORM-GENEALOGY-002-B");
    ctx.artifacts.genealogy = {
      ...form,
      totalCharacters: genealogy.length,
      housesRepresented: [...new Set(genealogy.map((g) => g.house))],
      knownTroublemakers: suspects.length,
      ledger: genealogy,
      seal: ctx.stamp("LINEAGE VERIFIED"),
    };
    ctx.suspects = suspects;

    ctx.log(this.name, `Catalogued ${genealogy.length} bloodlines; ${suspects.length} suspects detained.`, {
      suspects: suspects.length,
    });
    ctx.metrics.stepsCompleted += 1;
    ctx.metrics.linesOfBureaucracy += genealogy.length;
    return ctx;
  }
}

function classifyHouse(cp) {
  if (cp <= 0x007f) return "House of Basic Latin";
  if (cp <= 0x00ff) return "House of Latin-1 Supplement";
  if (cp >= 0x2000 && cp <= 0x206f) return "House of General Punctuation";
  if (cp >= 0x2100 && cp <= 0x214f) return "House of Letterlike Symbols";
  return "House of the Unclassified (watch closely)";
}

module.exports = { UnicodeGenealogyStep };
