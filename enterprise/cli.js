#!/usr/bin/env node
"use strict";

const fs = require("fs");
const {
  EmDashRemediationOrchestrator,
} = require("./src/core/EmDashRemediationOrchestrator");
const { ConfigurationBuilder } = require("./src/config/ConfigurationBuilder");
const { LEVELS } = require("./src/logging/EnterpriseLogger");

const BANNER = `
╔══════════════════════════════════════════════════════════════════╗
║                                                                    ║
║      █████╗ ███╗   ██╗████████╗██╗███████╗███╗   ███╗              ║
║     ██╔══██╗████╗  ██║╚══██╔══╝██║██╔════╝████╗ ████║              ║
║     ███████║██╔██╗ ██║   ██║   ██║█████╗  ██╔████╔██║              ║
║     ██╔══██║██║╚██╗██║   ██║   ██║██╔══╝  ██║╚██╔╝██║              ║
║     ██║  ██║██║ ╚████║   ██║   ██║███████╗██║ ╚═╝ ██║              ║
║     ╚═╝  ╚═╝╚═╝  ╚═══╝   ╚═╝   ╚═╝╚══════╝╚═╝     ╚═╝              ║
║                                                                    ║
║                  E N T E R P R I S E   E D I T I O N ™             ║
║                                                                    ║
║   Cloud-Native · Blockchain-Audited · AI-Powered · Mission-Critical║
║         Em Dash Remediation-as-a-Service · v1.0.0-ENTERPRISE       ║
╚══════════════════════════════════════════════════════════════════╝
`;

function printUsage() {
  process.stdout.write(BANNER);
  process.stdout.write(`
USAGE
  antiem-enterprise <file>              Remediate a file (purified text → stdout)
  antiem-enterprise --fix <file>        Remediate a file in place
  antiem-enterprise --text "<string>"   Remediate a literal string
  echo "text" | antiem-enterprise -     Remediate piped stdin

FLAGS
  --aggressive          Arm the EnDashDetectionStrategy (nuclear option)
  --no-blockchain       Disable the immutable audit ledger (not recommended)
  --difficulty <n>      Proof-of-Work difficulty, 0–6 (default 2)
  --quiet               Suppress the enterprise observability firehose
  --no-color            Disable ANSI color in logs
  --ledger              Print the full blockchain audit trail on completion
  --report              Print the post-engagement executive summary
  -h, --help            Display this dignified help text

PHILOSOPHY
  Removing an em dash is a one-line operation. We have ensured it is not.
`);
}

function parseArgs(argv) {
  const opts = {
    aggressive: false,
    blockchain: true,
    difficulty: 2,
    quiet: false,
    color: true,
    showLedger: false,
    showReport: false,
    fix: false,
    stdin: false,
    text: null,
    file: null,
    help: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    switch (arg) {
      case "-h":
      case "--help":
        opts.help = true;
        break;
      case "--aggressive":
        opts.aggressive = true;
        break;
      case "--no-blockchain":
        opts.blockchain = false;
        break;
      case "--difficulty":
        opts.difficulty = parseInt(argv[++i], 10);
        break;
      case "--quiet":
        opts.quiet = true;
        break;
      case "--no-color":
        opts.color = false;
        break;
      case "--ledger":
        opts.showLedger = true;
        break;
      case "--report":
        opts.showReport = true;
        break;
      case "--fix":
        opts.fix = true;
        break;
      case "--text":
        opts.text = argv[++i];
        break;
      case "-":
        opts.stdin = true;
        break;
      default:
        if (!arg.startsWith("-")) opts.file = arg;
        break;
    }
  }
  return opts;
}

function buildConfig(opts) {
  const builder = new ConfigurationBuilder()
    .withAggressiveMode(opts.aggressive)
    .withBlockchainAuditing(opts.blockchain)
    .withColor(opts.color);
  if (!Number.isNaN(opts.difficulty)) {
    builder.withProofOfWorkDifficulty(opts.difficulty);
  }
  builder.withLogLevel(opts.quiet ? LEVELS.SILENT : LEVELS.DEBUG);
  return builder.build();
}

function printLedger(ledger) {
  if (!ledger) return;
  process.stdout.write("\n  IMMUTABLE BLOCKCHAIN AUDIT TRAIL\n");
  process.stdout.write("  " + "═".repeat(64) + "\n");
  for (const block of ledger.chain) {
    process.stdout.write(`  Block #${block.index}\n`);
    process.stdout.write(`    timestamp : ${block.timestamp}\n`);
    process.stdout.write(`    nonce     : ${block.nonce}\n`);
    process.stdout.write(`    prevHash  : ${block.previousHash.substring(0, 32)}…\n`);
    process.stdout.write(`    hash      : ${block.hash.substring(0, 32)}…\n`);
    if (block.payload.event === "THREAT_NEUTRALIZED") {
      process.stdout.write(
        `    payload   : neutralized '${block.payload.original}' at ` +
          `position ${block.payload.position} ` +
          `(confidence ${block.payload.confidence})\n`
      );
    } else {
      process.stdout.write(`    payload   : ${block.payload.event}\n`);
    }
    process.stdout.write("\n");
  }
}

function printReport(result) {
  const m = result.metrics;
  const smStats = result.stateMachine.statistics;
  process.stdout.write("\n  POST-ENGAGEMENT EXECUTIVE SUMMARY\n");
  process.stdout.write("  " + "═".repeat(64) + "\n");
  process.stdout.write(`  Character tokens processed   : ${m.tokenCount}\n`);
  process.stdout.write(`  Neural inferences performed  : ${m.inferenceCount}\n`);
  process.stdout.write(`  Threats detected             : ${m.threatsDetected}\n`);
  process.stdout.write(`  Threats neutralized          : ${m.threatsNeutralized}\n`);
  process.stdout.write(`  FSM state transitions        : ${smStats.totalTransitions}\n`);
  process.stdout.write(`  Domain events emitted        : ${result.eventsEmitted}\n`);
  if (result.ledger) {
    process.stdout.write(`  Blockchain blocks committed  : ${result.ledger.blockCount}\n`);
    process.stdout.write(`  Chain integrity              : VERIFIED ✓\n`);
  } else {
    process.stdout.write(`  Blockchain blocks committed  : 0 (auditing disabled)\n`);
  }
  process.stdout.write(
    `  Lines of code to delete "—"  : ~1,400\n`
  );
  process.stdout.write("\n");
}

function run(text, opts, filenameForFix) {
  const config = buildConfig(opts);
  const orchestrator = new EmDashRemediationOrchestrator(config, {
    logLevelOverride: opts.quiet ? LEVELS.SILENT : LEVELS.DEBUG,
  });
  const result = orchestrator.remediate(text);

  if (opts.fix && filenameForFix) {
    fs.writeFileSync(filenameForFix, result.output, "utf-8");
    process.stderr.write(
      `\nRemediated ${result.metrics.threatsNeutralized} threat(s) in ${filenameForFix}. ` +
        `The audit trail is on the blockchain. You are welcome.\n`
    );
  } else {
    process.stdout.write(result.output);
    if (!result.output.endsWith("\n")) process.stdout.write("\n");
  }

  if (opts.showReport) printReport(result);
  if (opts.showLedger) printLedger(result.ledger);
}

function main() {
  const opts = parseArgs(process.argv.slice(2));

  if (opts.help || (!opts.file && !opts.stdin && opts.text === null)) {
    printUsage();
    process.exit(0);
  }

  if (opts.text !== null) {
    run(opts.text, opts, null);
  } else if (opts.stdin) {
    let input = "";
    process.stdin.setEncoding("utf-8");
    process.stdin.on("data", (chunk) => (input += chunk));
    process.stdin.on("end", () => run(input, opts, null));
  } else {
    if (!fs.existsSync(opts.file)) {
      process.stderr.write(`File not found: ${opts.file}\n`);
      process.exit(1);
    }
    const text = fs.readFileSync(opts.file, "utf-8");
    run(text, opts, opts.file);
  }
}

main();
