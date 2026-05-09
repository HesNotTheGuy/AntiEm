#!/usr/bin/env node

const fs = require("fs");
const { purge, stats } = require("./index");

const BANNER = `
   ___          __  _ ____
  / _ | ___  __/ /_(_) __/_ _
 / __ |/ _ \\/ _  / / _// '  \\
/_/ |_/_//_/\\__/_/___/_/_/_/

  Em Dash Removal Tool v1.0.0
  "Because punctuation should know its place."
`;

const args = process.argv.slice(2);

if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
  console.log(BANNER);
  console.log("Usage:");
  console.log("  antiem <file>              Purge em dashes from a file (prints to stdout)");
  console.log("  antiem --fix <file>        Purge em dashes and overwrite the file");
  console.log("  antiem --scan <file>       Scan file and report em dash threat level");
  console.log("  antiem --aggressive <file> Also target en dashes (nuclear option)");
  console.log("  echo 'text' | antiem -     Read from stdin");
  console.log("");
  process.exit(0);
}

const aggressive = args.includes("--aggressive");
const fix = args.includes("--fix");
const scan = args.includes("--scan");
const fileArg = args.find((a) => !a.startsWith("-"));
const useStdin = args.includes("-");

function processText(text, filename) {
  if (scan) {
    const s = stats(text);
    console.log(`\n  THREAT ASSESSMENT: ${filename || "stdin"}`);
    console.log(`  ${"=".repeat(40)}`);
    console.log(`  Em dashes:       ${s.emDashes}`);
    console.log(`  En dashes:       ${s.enDashes}`);
    console.log(`  Double hyphens:  ${s.doubleHyphens}`);
    console.log(`  Total threats:   ${s.total}`);
    console.log(`  Threat level:    ${s.threatLevel}`);
    console.log("");
    process.exit(s.total > 0 ? 1 : 0);
  }

  const cleaned = purge(text, { aggressive });
  if (fix && fileArg) {
    fs.writeFileSync(fileArg, cleaned, "utf-8");
    const s = stats(text);
    console.log(`Purged ${s.total} threat(s) from ${fileArg}. You're welcome.`);
  } else {
    process.stdout.write(cleaned);
  }
}

if (useStdin) {
  let input = "";
  process.stdin.setEncoding("utf-8");
  process.stdin.on("data", (chunk) => (input += chunk));
  process.stdin.on("end", () => processText(input));
} else if (fileArg) {
  if (!fs.existsSync(fileArg)) {
    console.error(`File not found: ${fileArg}`);
    process.exit(1);
  }
  const text = fs.readFileSync(fileArg, "utf-8");
  processText(text, fileArg);
} else {
  console.error("No file specified. Run antiem --help for usage.");
  process.exit(1);
}
