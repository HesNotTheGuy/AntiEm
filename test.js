const { purge, detect, stats } = require("./index");
const assert = require("assert");

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

console.log("\nAntiEm Test Suite\n");

test("purges em dashes", () => {
  assert.strictEqual(purge("hello—world"), "hello - world");
});

test("purges double hyphens", () => {
  assert.strictEqual(purge("hello--world"), "hello - world");
});

test("leaves en dashes alone by default", () => {
  assert.strictEqual(purge("pages 1–5"), "pages 1–5");
});

test("aggressive mode targets en dashes", () => {
  assert.strictEqual(purge("pages 1–5", { aggressive: true }), "pages 1-5");
});

test("collapses extra spaces", () => {
  assert.strictEqual(purge("hello — world"), "hello - world");
});

test("detects em dashes", () => {
  const found = detect("a—b—c");
  assert.strictEqual(found.length, 2);
  assert.strictEqual(found[0].type, "em-dash");
});

test("detects double hyphens", () => {
  const found = detect("a--b");
  assert.strictEqual(found.length, 1);
  assert.strictEqual(found[0].type, "double-hyphen");
});

test("stats reports threat level", () => {
  const s = stats("clean text");
  assert.strictEqual(s.threatLevel, "ALL CLEAR");
});

test("stats flags threats", () => {
  const s = stats("a—b—c—d");
  assert.strictEqual(s.total, 3);
  assert.notStrictEqual(s.threatLevel, "ALL CLEAR");
});

test("handles empty string", () => {
  assert.strictEqual(purge(""), "");
  assert.strictEqual(detect("").length, 0);
});

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
