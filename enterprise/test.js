"use strict";

/**
 * AntiEm Enterprise Edition™ — Verification & Validation Suite
 *
 * Exercises the full remediation apparatus end-to-end, plus targeted unit
 * coverage of the neural classifier, the finite state machine, the immutable
 * blockchain ledger, the IoC container, and the configuration builder.
 *
 * That a one-character string replacement warrants a test suite of this
 * magnitude is not a bug. It is the brand.
 */

const assert = require("assert");
const { purge, remediate, ConfigurationBuilder } = require("./src/index");
const {
  EmDashRemediationOrchestrator,
} = require("./src/core/EmDashRemediationOrchestrator");
const { ServiceContainer } = require("./src/di/ServiceContainer");
const {
  BlockchainAuditLedger,
} = require("./src/ledger/BlockchainAuditLedger");
const {
  CharacterStateMachine,
  STATES,
} = require("./src/statemachine/CharacterStateMachine");
const {
  ConfigurationException,
  DependencyResolutionException,
  BlockchainIntegrityException,
  IllegalStateTransitionException,
} = require("./src/exceptions/EmDashExceptions");

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  PASS  ${name}`);
    passed++;
  } catch (e) {
    console.log(`  FAIL  ${name}: ${e.message}`);
    failed++;
  }
}

console.log("\nAntiEm Enterprise Edition™ Verification Suite\n");

// ── End-to-end remediation correctness ─────────────────────────────────────
test("purges em dashes end-to-end", () => {
  assert.strictEqual(purge("hello—world"), "hello - world");
});

test("purges double hyphens end-to-end", () => {
  assert.strictEqual(purge("hello--world"), "hello - world");
});

test("leaves en dashes alone by default", () => {
  assert.strictEqual(purge("pages 1–5"), "pages 1–5");
});

test("aggressive mode neutralizes en dashes", () => {
  assert.strictEqual(purge("pages 1–5", { aggressive: true }), "pages 1-5");
});

test("reconciles redundant whitespace", () => {
  assert.strictEqual(purge("hello — world"), "hello - world");
});

test("leaves single hyphens untouched", () => {
  assert.strictEqual(purge("well-being is good"), "well-being is good");
});

test("handles the empty corpus", () => {
  assert.strictEqual(purge(""), "");
});

test("handles a corpus of pure em dashes", () => {
  // Each em dash becomes " - "; reconciliation collapses the seams but the
  // leading and trailing spaces survive, as they do in the un-enterprised tool.
  assert.strictEqual(purge("———"), " - - - ");
});

// ── Metrics & structured result ─────────────────────────────────────────────
test("remediate reports accurate threat metrics", () => {
  const result = remediate("a—b—c—d");
  assert.strictEqual(result.metrics.threatsDetected, 3);
  assert.strictEqual(result.metrics.threatsNeutralized, 3);
  assert.strictEqual(result.output, "a - b - c - d");
});

test("remediate counts neural inferences", () => {
  const result = remediate("a—b");
  // one inference per swept position; em dash collapses its own position only
  assert.ok(result.metrics.inferenceCount >= 3);
});

// ── Neural classifier confidence calibration ───────────────────────────────
test("classifier is highly confident about em dashes", () => {
  const result = remediate("x—y");
  const op = result.purgeOperations[0];
  assert.ok(
    op.confidence > 0.9,
    `expected high confidence, got ${op.confidence}`
  );
});

// ── Blockchain audit ledger ─────────────────────────────────────────────────
test("ledger commits one block per neutralization plus genesis", () => {
  const result = remediate("a—b—c");
  // genesis + 2 neutralizations
  assert.strictEqual(result.ledger.blockCount, 3);
});

test("ledger validates its own integrity", () => {
  const result = remediate("a—b");
  assert.strictEqual(result.ledger.validateIntegrity(), true);
});

test("ledger detects tampering", () => {
  const config = new ConfigurationBuilder()
    .withProofOfWorkDifficulty(1)
    .build();
  const ledger = new BlockchainAuditLedger(config, null, null);
  ledger.commit({ event: "THREAT_NEUTRALIZED", threatType: "EM_DASH" });
  // Tamper with history.
  ledger.chain[1].payload.threatType = "TOTALLY_FINE_ACTUALLY";
  // Note: chain getter returns a copy, so mutate the live chain instead.
  ledger._chain[1].payload.threatType = "TOTALLY_FINE_ACTUALLY";
  assert.throws(
    () => ledger.validateIntegrity(),
    BlockchainIntegrityException
  );
});

test("proof-of-work produces the required leading zeroes", () => {
  const config = new ConfigurationBuilder()
    .withProofOfWorkDifficulty(2)
    .build();
  const ledger = new BlockchainAuditLedger(config, null, null);
  const block = ledger.commit({ event: "THREAT_NEUTRALIZED" });
  assert.strictEqual(block.hash.substring(0, 2), "00");
});

// ── Finite state machine ────────────────────────────────────────────────────
test("state machine returns to SCANNING after a threat", () => {
  const sm = new CharacterStateMachine(null, null);
  sm.arm();
  sm.processThreat({ position: 0, threatType: "EM_DASH", confidence: 1 });
  assert.strictEqual(sm.currentState, STATES.SCANNING);
});

test("state machine rejects illegal transitions", () => {
  const sm = new CharacterStateMachine(null, null);
  // From IDLE, the only legal move is SCANNING; force an illegal one.
  assert.throws(
    () => sm._transition(STATES.NEUTRALIZED),
    IllegalStateTransitionException
  );
});

test("state machine tallies neutralizations", () => {
  const sm = new CharacterStateMachine(null, null);
  sm.arm();
  sm.processThreat({ position: 0, threatType: "EM_DASH", confidence: 1 });
  sm.processThreat({ position: 5, threatType: "EM_DASH", confidence: 1 });
  assert.strictEqual(sm.statistics.totalNeutralizations, 2);
});

// ── Configuration builder validation ────────────────────────────────────────
test("config builder rejects out-of-range difficulty", () => {
  assert.throws(
    () => new ConfigurationBuilder().withProofOfWorkDifficulty(99),
    ConfigurationException
  );
});

test("config builder rejects invalid confidence threshold", () => {
  assert.throws(
    () => new ConfigurationBuilder().withNeuralConfidenceThreshold(7),
    ConfigurationException
  );
});

test("config builder is fluent", () => {
  const config = new ConfigurationBuilder()
    .withAggressiveMode(true)
    .withBlockchainAuditing(false)
    .build();
  assert.strictEqual(config.aggressiveMode, true);
  assert.strictEqual(config.blockchainAuditingEnabled, false);
  assert.ok(Object.isFrozen(config));
});

// ── IoC container ───────────────────────────────────────────────────────────
test("container resolves singletons identically", () => {
  const c = new ServiceContainer();
  let count = 0;
  c.register("thing", () => ({ id: ++count }));
  assert.strictEqual(c.resolve("thing"), c.resolve("thing"));
});

test("container throws on unknown token", () => {
  const c = new ServiceContainer();
  assert.throws(
    () => c.resolve("nonexistent"),
    DependencyResolutionException
  );
});

test("container detects circular dependencies", () => {
  const c = new ServiceContainer();
  c.register("a", (ctr) => ctr.resolve("b"));
  c.register("b", (ctr) => ctr.resolve("a"));
  assert.throws(() => c.resolve("a"), DependencyResolutionException);
});

// ── Auditing can be disabled ────────────────────────────────────────────────
test("blockchain can be disabled", () => {
  const result = remediate("a—b", { blockchain: false });
  assert.strictEqual(result.ledger, null);
  assert.strictEqual(result.output, "a - b");
});

// ── The orchestrator is reusable across fresh instances ─────────────────────
test("fresh orchestrators are independent", () => {
  const cfg = ConfigurationBuilder.default();
  const o1 = new EmDashRemediationOrchestrator(cfg, {
    logLevelOverride: 100,
  });
  const o2 = new EmDashRemediationOrchestrator(cfg, {
    logLevelOverride: 100,
  });
  assert.strictEqual(o1.remediate("a—b").output, "a - b");
  assert.strictEqual(o2.remediate("c—d").output, "c - d");
});

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
