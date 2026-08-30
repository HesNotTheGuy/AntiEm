#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { conduct } = require("./src");

const BANNER = `
   ___          __  _ ____                          _       _
  / _ | ___  __/ /_(_) __/___ __________ __  ___   (_)__ _ | |
 / __ |/ _ \\/ _  / / _// _ \`/ __/ __/ _ \`/ |/ _ \\ / / _ \`/_|_|
/_/ |_/_//_/\\__/_/___/\\_,_/_/ /_/  \\_,_/|_/\\___//_/\\_,_(_)___|

  Ceremonial Edition — Thirteen Steps to Delete One Glyph
  "Because replaceAll lacked gravitas."
`;

const args = process.argv.slice(2);

if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
  console.log(BANNER);
  console.log("Usage:");
  console.log("  node cli.js <file>                 Conduct ceremony; purified text → stdout");
  console.log("  node cli.js --fix <file>           Conduct ceremony; overwrite the file");
  console.log("  node cli.js --text \"hello—world\"    Conduct ceremony on a literal string");
  console.log("  node cli.js --quiet <file>          Suppress the liturgical firehose (stderr)");
  console.log("  node cli.js --report <file>         Print executive summary + artifact index");
  console.log("  node cli.js --artifacts <file>      Dump full JSON artifact cabinet to stderr");
  console.log("  node cli.js --aggressive <file>     Also condemn en dashes");
  console.log("  node cli.js --mercury-retrograde    Force Mercury into retrograde (override filed)");
  console.log("  node cli.js --skip-astrology        Bypass the firmament (noted in the minutes)");
  console.log("  echo 'text' | node cli.js -         Read corpus from stdin");
  console.log("");
  console.log("The ceremony always completes. The em dash never survives Step XII.");
  console.log("");
  process.exit(0);
}

const aggressive = args.includes("--aggressive");
const fix = args.includes("--fix");
const quiet = args.includes("--quiet");
const report = args.includes("--report");
const dumpArtifacts = args.includes("--artifacts");
const skipAstrology = args.includes("--skip-astrology");
const mercuryRetrograde = args.includes("--mercury-retrograde");
const textFlagIdx = args.indexOf("--text");
const useStdin = args.includes("-");
const fileArg = args.find(
  (a, i) =>
    !a.startsWith("-") &&
    (textFlagIdx === -1 || i !== textFlagIdx + 1)
);

function run(corpus, filename) {
  const result = conduct(corpus, {
    aggressive,
    verbose: !quiet,
    skipAstrology,
    mercuryIsInRetrograde: mercuryRetrograde ? true : null,
  });

  if (fix && fileArg) {
    fs.writeFileSync(fileArg, result.corpus, "utf-8");
    console.error(
      `Ceremony complete. Purged ${result.metrics.threatsNeutralized} threat(s) from ${fileArg}. Filing cabinets updated.`
    );
  } else {
    process.stdout.write(result.corpus);
    if (!result.corpus.endsWith("\n")) process.stdout.write("\n");
  }

  if (report) {
    console.error("");
    console.error("  ARTIFACT CABINET INDEX");
    console.error("  ────────────────────────────────────────────");
    for (const [key, value] of Object.entries(result.artifacts)) {
      const status = value == null ? "(empty)" : "filed";
      console.error(`  • ${key.padEnd(22)} ${status}`);
    }
    console.error("");
  }

  if (dumpArtifacts) {
    console.error(JSON.stringify(summarizeArtifacts(result), null, 2));
  }

  if (filename && quiet && !fix) {
    // nothing else
  }
}

function summarizeArtifacts(result) {
  // Avoid dumping the full genealogy ledger (huge); summarize.
  const a = result.artifacts;
  return {
    metrics: result.metrics,
    waiver: a.waiver,
    genealogy: a.genealogy && {
      filingNumber: a.genealogy.filingNumber,
      totalCharacters: a.genealogy.totalCharacters,
      knownTroublemakers: a.genealogy.knownTroublemakers,
      housesRepresented: a.genealogy.housesRepresented,
      seal: a.genealogy.seal,
    },
    morseScroll: a.morseScroll && {
      filingNumber: a.morseScroll.filingNumber,
      threatSignatures: a.morseScroll.threatSignatures,
      stamp: a.morseScroll.stamp,
    },
    parliamentaryMinutes: a.parliamentaryMinutes,
    carbonDates: a.carbonDates,
    horoscope: a.horoscope,
    subcommittee: a.subcommittee,
    trialTranscript: a.trialTranscript && {
      filingNumber: a.trialTranscript.filingNumber,
      court: a.trialTranscript.court,
      judge: a.trialTranscript.judge,
      cases: a.trialTranscript.cases,
      stamp: a.trialTranscript.stamp,
    },
    notarizations: a.notarizations,
    postalReceipts: a.postalReceipts,
    appealsDocket: a.appealsDocket,
    erasureCertificate: a.erasureCertificate,
    victoryParade: a.victoryParade,
    stepLog: result.stepLog,
    output: result.corpus,
  };
}

if (textFlagIdx !== -1) {
  const literal = args[textFlagIdx + 1];
  if (literal == null) {
    console.error("--text requires a string argument");
    process.exit(1);
  }
  run(literal, null);
} else if (useStdin) {
  let input = "";
  process.stdin.setEncoding("utf-8");
  process.stdin.on("data", (chunk) => (input += chunk));
  process.stdin.on("end", () => run(input, "stdin"));
} else if (fileArg) {
  const resolved = path.resolve(fileArg);
  if (!fs.existsSync(resolved)) {
    console.error(`File not found: ${fileArg}`);
    process.exit(1);
  }
  run(fs.readFileSync(resolved, "utf-8"), fileArg);
} else {
  console.error("No corpus specified. Run with --help.");
  process.exit(1);
}
