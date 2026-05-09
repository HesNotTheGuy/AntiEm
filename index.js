const EM_DASH = "—";
const EN_DASH = "–";

const replacements = {
  "—": " - ",
  "--": " - ",
  "–": "-",
};

function purge(text, { aggressive = false } = {}) {
  let result = text;
  result = result.replaceAll(EM_DASH, " - ");
  result = result.replaceAll("--", " - ");
  if (aggressive) {
    result = result.replaceAll(EN_DASH, "-");
  }
  result = result.replace(/ {2,}/g, " ");
  return result;
}

function detect(text) {
  const matches = [];
  for (let i = 0; i < text.length; i++) {
    if (text[i] === EM_DASH) {
      matches.push({ index: i, char: EM_DASH, type: "em-dash" });
    } else if (text[i] === EN_DASH) {
      matches.push({ index: i, char: EN_DASH, type: "en-dash" });
    } else if (text[i] === "-" && text[i + 1] === "-") {
      matches.push({ index: i, char: "--", type: "double-hyphen" });
      i++;
    }
  }
  return matches;
}

function stats(text) {
  const found = detect(text);
  return {
    emDashes: found.filter((m) => m.type === "em-dash").length,
    enDashes: found.filter((m) => m.type === "en-dash").length,
    doubleHyphens: found.filter((m) => m.type === "double-hyphen").length,
    total: found.length,
    threatLevel: threatLevel(found.length, text.length),
  };
}

function threatLevel(count, textLength) {
  if (count === 0) return "ALL CLEAR";
  const density = count / textLength;
  if (density > 0.01) return "CRITICAL";
  if (density > 0.005) return "SEVERE";
  if (count > 5) return "ELEVATED";
  if (count > 0) return "GUARDED";
  return "ALL CLEAR";
}

module.exports = { purge, detect, stats };
