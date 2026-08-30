"use strict";

const { Step } = require("./Step");

/**
 * Step VII — Subcommittee Formation
 *
 * A subcommittee is formed to study the formation of a working group that will
 * recommend the appointment of a task force to advise the committee that
 * already voted for expulsion in Step IV. This is how institutions heal.
 */
class SubcommitteeFormationStep extends Step {
  constructor() {
    super({
      number: 7,
      name: "Subcommittee Formation",
      motto: "When in doubt, appoint a subcommittee to appoint a working group.",
    });
  }

  perform(ctx) {
    ctx.metrics.committeeMeetingsHeld += 2;

    const roster = [
      { role: "Chair", name: "Dr. Emelia Hyphen-Smythe, PhD (Punctuation Studies)" },
      { role: "Vice-Chair", name: "Capt. Fullstop, Ret." },
      { role: "Recording Secretary", name: "Ms. Ellipsis Dotdotdot" },
      { role: "Sergeant-at-Arms", name: "Brackets McGee" },
      { role: "Public Comment Liaison", name: "Anon. Reddit User" },
      { role: "Ethics Observer", name: "the ghost of Strunk & White" },
      { role: "Industry Partner", name: "a synod of offended novelists" },
    ];

    const agenda = [
      "Call to order (gavel optional, preferred)",
      "Approve minutes of a meeting that never happened",
      `Review ${ctx.suspects.length} suspect dossier(s) already decided in Parliament`,
      "Debate whether 'debate' is the right word",
      "Authorize the Task Force on Imminent Erasure",
      "Schedule the next meeting to schedule the meeting after that",
      "Adjourn for complimentary oat milk",
    ];

    const resolutions = [
      {
        id: "RES-7A",
        text: "Be it resolved that the suspects identified in Step II remain identified.",
        vote: "unanimous",
      },
      {
        id: "RES-7B",
        text: "Be it resolved that a Working Group on Working Groups be formed.",
        vote: "unanimous",
      },
      {
        id: "RES-7C",
        text: "Be it resolved that Step XII may, eventually, delete something.",
        vote: "unanimous, with footnotes",
      },
    ];

    const form = ctx.fileForm("FORM-SUBCOMMITTEE-007-G");
    ctx.artifacts.subcommittee = {
      ...form,
      title:
        "Ad Hoc Subcommittee on the Pre-Erasure Confirmation of Previously Confirmed Erasures",
      roster,
      agenda,
      resolutions,
      workingGroupSpawned: {
        name: "Task Force on Imminent Erasure (TFIE)",
        mandate: "Prepare a memo authorizing Step VIII",
        dueDate: "before the heat death of the universe",
      },
      attendance: roster.length,
      oatMilkConsumedMl: 240 * roster.length,
      stamp: ctx.stamp("QUORUM"),
    };

    ctx.log(this.name, "Subcommittee formed, resolved, and adjourned. Nothing was deleted. Morale is high.");
    ctx.metrics.stepsCompleted += 1;
    ctx.metrics.linesOfBureaucracy += 25;
    return ctx;
  }
}

module.exports = { SubcommitteeFormationStep };
