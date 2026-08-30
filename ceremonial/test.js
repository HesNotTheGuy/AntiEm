"use strict";

const assert = require("assert");
const { purge, conduct, previewSuspects } = require("./src");

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

console.log("\nAntiEm Ceremonial Edition — Liturgical Test Suite\n");

test("purges em dashes (after thirteen steps of theatre)", () => {
  assert.strictEqual(purge("hello—world", { quiet: true }), "hello - world");
});

test("purges double hyphens", () => {
  assert.strictEqual(purge("hello--world"), "hello - world");
});

test("leaves en dashes alone by default", () => {
  assert.strictEqual(purge("pages 1–5"), "pages 1–5");
});

test("aggressive mode condemns en dashes", () => {
  assert.strictEqual(purge("pages 1–5", { aggressive: true }), "pages 1-5");
});

test("collapses extra spaces around erased dashes", () => {
  assert.strictEqual(purge("hello — world"), "hello - world");
});

test("handles clean text (still holds the full ceremony)", () => {
  const ctx = conduct("pure prose", { verbose: false });
  assert.strictEqual(ctx.corpus, "pure prose");
  assert.strictEqual(ctx.metrics.threatsNeutralized, 0);
  assert.strictEqual(ctx.metrics.stepsCompleted, 13);
});

test("waiver is always filed", () => {
  const ctx = conduct("a—b", { verbose: false });
  assert.ok(ctx.artifacts.waiver);
  assert.ok(ctx.artifacts.waiver.filingNumber.startsWith("ANTIEM-"));
  assert.strictEqual(ctx.artifacts.waiver.acknowledgements.length, 4);
});

test("genealogy detains suspects", () => {
  const suspects = previewSuspects("a—b--c");
  assert.strictEqual(suspects.length, 2);
  assert.strictEqual(suspects[0].type, "em-dash");
  assert.strictEqual(suspects[1].type, "double-hyphen");
});

test("parliament expels every suspect", () => {
  const ctx = conduct("x—y—z", { verbose: false });
  const minutes = ctx.artifacts.parliamentaryMinutes;
  assert.strictEqual(minutes.sittings.length, 2);
  assert.ok(minutes.sittings.every((s) => s.division.result.includes("EXPULSION")));
});

test("astrology can be skipped", () => {
  const ctx = conduct("a—b", { skipAstrology: true, verbose: false });
  assert.strictEqual(ctx.artifacts.horoscope.skipped, true);
});

test("mercury retrograde files an override", () => {
  const ctx = conduct("a—b", { mercuryIsInRetrograde: true, verbose: false });
  assert.strictEqual(ctx.artifacts.horoscope.mercuryRetrograde, true);
  assert.ok(ctx.artifacts.horoscope.clearance.override);
});

test("mock trial convicts everyone", () => {
  const ctx = conduct("a—b", { verbose: false });
  const cases = ctx.artifacts.trialTranscript.cases;
  assert.strictEqual(cases.length, 1);
  assert.strictEqual(cases[0].verdict, "GUILTY on all counts");
});

test("appeals are always denied", () => {
  const ctx = conduct("a—b", { verbose: false });
  assert.strictEqual(ctx.metrics.appealsHeard, 3);
  const appeals = ctx.artifacts.appealsDocket.docket[0].appeals;
  assert.ok(appeals.every((a) => a.holding.startsWith("DENIED")));
});

test("postal service ships to Null Island", () => {
  const ctx = conduct("a—b", { verbose: false });
  const receipt = ctx.artifacts.postalReceipts.receipts[0];
  assert.ok(receipt.to.includes("Null Island"));
  assert.strictEqual(receipt.returnAddress, "/dev/null");
  assert.strictEqual(receipt.hops.length, 7);
});

test("erasure certificate admits the one-liner", () => {
  const ctx = conduct("a—b", { verbose: false });
  assert.strictEqual(
    ctx.artifacts.erasureCertificate.oneLinerWeCouldHaveUsed,
    'text.replaceAll("—", " - ")'
  );
  assert.strictEqual(ctx.artifacts.erasureCertificate.threatsNeutralized, 1);
});

test("victory parade files an after-action report", () => {
  const ctx = conduct("a—b—c", { verbose: false });
  assert.strictEqual(ctx.artifacts.victoryParade.afterActionReport.threatsNeutralized, 2);
  assert.ok(ctx.artifacts.victoryParade.chant.includes("U+2014"));
});

test("rubber stamps accumulate", () => {
  const ctx = conduct("a—b", { verbose: false });
  assert.ok(ctx.metrics.rubberStampsApplied > 10);
  assert.ok(ctx.metrics.formsFiled >= 13);
});

test("empty string survives the liturgy", () => {
  assert.strictEqual(purge(""), "");
});

test("multiple em dashes", () => {
  assert.strictEqual(purge("a—b—c—d"), "a - b - c - d");
});

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
