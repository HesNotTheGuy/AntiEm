"use strict";

const { Step } = require("./Step");

/**
 * Step III — Morse Transliteration
 *
 * The entire corpus is rendered into Morse code so that em dashes may be
 * identified by their distinctive long tone (████████), which is of course
 * just the letter we already knew was an em dash, now wearing a telegraph hat.
 *
 * The Morse scroll is filed. Nothing is removed. The telegraph operator sighs.
 */
class MorseTransliterationStep extends Step {
  constructor() {
    super({
      number: 3,
      name: "Morse Transliteration",
      motto: "Dit-dah the heretics so the wire may know their names.",
    });
  }

  perform(ctx) {
    const scroll = [];
    const threatSignatures = [];

    for (const ch of ctx.corpus) {
      const signal = toMorse(ch);
      scroll.push({ glyph: ch, signal });
      if (ch === "\u2014" || ch === "\u2013") {
        threatSignatures.push({
          glyph: ch,
          signal,
          annotation:
            ch === "\u2014"
              ? "EM DASH DETECTED ON THE WIRE — HOLD ALL TRAINS"
              : "en dash on the wire (monitor)",
        });
      }
    }

    // Also scan for double-hyphen impostors in the original
    for (const s of ctx.suspects.filter((x) => x.type === "double-hyphen")) {
      threatSignatures.push({
        glyph: "--",
        signal: "-....- -....-",
        annotation: `DOUBLE HYPHEN IMPOSTOR AT INDEX ${s.index}`,
        suspectId: s.suspectId,
      });
    }

    const form = ctx.fileForm("FORM-MORSE-003-C");
    const rendered = scroll.map((s) => s.signal).join(" / ");

    ctx.artifacts.morseScroll = {
      ...form,
      rendered,
      characterCount: scroll.length,
      threatSignatures,
      telegraphOffice: "AntiEm Central Wire, Desk 4",
      operatorInitials: "A.E.",
      stamp: ctx.stamp("WIRED"),
    };

    ctx.log(this.name, `Transmitted ${scroll.length} glyphs; ${threatSignatures.length} threat signature(s) on the wire.`, {
      threatsOnWire: threatSignatures.length,
    });
    ctx.metrics.stepsCompleted += 1;
    ctx.metrics.linesOfBureaucracy += 8 + threatSignatures.length;
    return ctx;
  }
}

const ALPHA = {
  a: ".-",
  b: "-...",
  c: "-.-.",
  d: "-..",
  e: ".",
  f: "..-.",
  g: "--.",
  h: "....",
  i: "..",
  j: ".---",
  k: "-.-",
  l: ".-..",
  m: "--",
  n: "-.",
  o: "---",
  p: ".--.",
  q: "--.-",
  r: ".-.",
  s: "...",
  t: "-",
  u: "..-",
  v: "...-",
  w: ".--",
  x: "-..-",
  y: "-.--",
  z: "--..",
  "0": "-----",
  "1": ".----",
  "2": "..---",
  "3": "...--",
  "4": "....-",
  "5": ".....",
  "6": "-....",
  "7": "--...",
  "8": "---..",
  "9": "----.",
  " ": "/",
  ".": ".-.-.-",
  ",": "--..--",
  "?": "..--..",
  "'": ".----.",
  "!": "-.-.--",
  "/": "-..-.",
  "(": "-.--.",
  ")": "-.--.-",
  "&": ".-...",
  ":": "---...",
  ";": "-.-.-.",
  "=": "-...-",
  "+": ".-.-.",
  "-": "-....-",
  _: "..--.-",
  '"': ".-..-.",
  $: "...-..-",
  "@": ".--.-.",
  "\n": ".-.-",
  "\t": "-...-",
};

function toMorse(ch) {
  if (ch === "\u2014") return "████████ [EM DASH — CONTRABAND]";
  if (ch === "\u2013") return "██████ [en dash — watchlist]";
  const lower = ch.toLowerCase();
  if (ALPHA[lower]) return ALPHA[lower];
  return `[${ch.codePointAt(0).toString(16)}]`;
}

module.exports = { MorseTransliterationStep };
