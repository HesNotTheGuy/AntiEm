"use strict";

const { Step } = require("./Step");

/**
 * Step IV — Parliamentary Inquiry
 *
 * A full sitting of the AntiEm Commons is convened. Each suspect is introduced
 * by the Speaker, debated by the Government (Prosecution) and the Loyal
 * Opposition (who always lose), and subjected to a voice vote that is
 * invariably Unanimous for Expulsion.
 *
 * Hansard is published. The em dashes remain, for now, because due process.
 */
class ParliamentaryInquiryStep extends Step {
  constructor() {
    super({
      number: 4,
      name: "Parliamentary Inquiry",
      motto: "Order! Order! The honourable member from U+2014 will withdraw.",
    });
  }

  perform(ctx) {
    ctx.metrics.committeeMeetingsHeld += 1;
    const sittings = [];

    const speakers = [
      "The Rt Hon. Hyphen of Basic Latin",
      "Baroness Semicolon of Clause Junction",
      "Sir Comma of the Gentle Pause",
      "Lady Parenthesis of Soft Asides",
      "The Earl of Period, Full Stop",
    ];

    for (const suspect of ctx.suspects) {
      const govMotion = `That this House recognises ${suspect.suspectId} (${suspect.type}, ${suspect.epithet}) as an affront to clean prose and resolves that it be expelled forthwith.`;
      const opposition = inventFeebleDefence(suspect);
      const votesAye = 487 + (suspect.suspectId.charCodeAt(4) % 40);
      const votesNay = 0;
      const votesAbstain = 1; // always one coward

      sittings.push({
        suspectId: suspect.suspectId,
        orderPaperItem: `OP-${suspect.suspectId}`,
        speaker: speakers[suspectsIndex(ctx, suspect) % speakers.length],
        governmentMotion: govMotion,
        oppositionRemarks: opposition,
        division: {
          aye: votesAye,
          nay: votesNay,
          abstain: votesAbstain,
          result: "RESOLVED — EXPULSION CARRIED",
        },
        hansardExcerpt: [
          `Speaker: The question is ${suspect.suspectId}.`,
          `Gov: ${govMotion}`,
          `Opp: ${opposition}`,
          `Speaker: Ayes ${votesAye}, Noes ${votesNay}. The Ayes have it. The Ayes have it.`,
        ],
      });
    }

    if (ctx.suspects.length === 0) {
      sittings.push({
        note: "No suspects on the Order Paper. The House adjourns for biscuits.",
      });
    }

    const form = ctx.fileForm("FORM-PARLIAMENT-004-D");
    ctx.artifacts.parliamentaryMinutes = {
      ...form,
      chamber: "AntiEm Commons",
      session: "Extraordinary Sitting on Typographic Sedition",
      sittings,
      macePresent: true,
      blackRodKnocked: true,
      stamp: ctx.stamp("DIVISION CARRIED"),
    };

    ctx.log(this.name, `Commons sat; ${ctx.suspects.length} expulsion motion(s) carried unanimously (plus one abstention each).`);
    ctx.metrics.stepsCompleted += 1;
    ctx.metrics.linesOfBureaucracy += 20 + sittings.length * 6;
    return ctx;
  }
}

function suspectsIndex(ctx, suspect) {
  return ctx.suspects.indexOf(suspect);
}

function inventFeebleDefence(suspect) {
  const defences = [
    `With respect, Mr Speaker, ${suspect.epithet} merely adds drama.`,
    "The honourable members opposite lack panache.",
    "Punctuation must be free to sprawl.",
    "This is a slippery slope toward the abolition of italics.",
    "Have we considered that the readers... like it?",
  ];
  return defences[suspect.suspectId.charCodeAt(4) % defences.length];
}

module.exports = { ParliamentaryInquiryStep };
