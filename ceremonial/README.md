# AntiEm Ceremonial Edition

> Thirteen steps. One deletion. Infinite paperwork.

```js
text.replaceAll("—", " - ")
```

That is the entire problem. Below is our solution — a full **Em Dash Extinction Ceremony**.

---

## Why

The Enterprise Edition asked: *what if deleting an em dash required a neural network and a blockchain?*

The Ceremonial Edition asks a more ancient question:

> **What if deleting an em dash required a waiver, a genealogy, Morse code, Parliament, carbon dating, astrology, a subcommittee, a mock trial, a notary, the postal service, three denied appeals, one actual deletion, and a parade?**

We believe the answer is yes.

## The Thirteen Steps

```
 I.  Waiver Signing .............. confess that a one-liner would suffice
 II. Unicode Genealogy ........... detain every glyph by bloodline
III. Morse Transliteration ....... dit-dah the heretics onto the wire
 IV. Parliamentary Inquiry ....... Commons expels them (1 abstention)
  V. Carbon Dating ............... radiocarbon the vibes in triplicate
 VI. Astrological Clearance ...... ask Mercury; file override if needed
VII. Subcommittee Formation ...... appoint a working group on working groups
VIII.Mock Trial .................. convict before twelve angry hyphens
 IX. Notarization ................ red wax, burgundy ribbon
  X. Postal Oblivion ............. ship to P.O. Box 0, Null Island
 XI. Appeals Tribunal ............ deny, deny, deny with prejudice
XII. Final Erasure ............... ← the only step that edits the string
XIII.Victory Parade .............. confetti; file the after-action report
```

Steps I–XI and XIII produce artifacts. **Only Step XII changes the text.**
This is Doctrine. This is the point.

## Architecture (so to speak)

```
                    ┌─────────────────────────┐
                    │    CeremonyConductor    │
                    │  (high priest / CLI)    │
                    └───────────┬─────────────┘
                                │ escorts CeremonyContext through
                                ▼
   ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐
   │ I  │→│ II │→│III │→│ IV │→│ V  │→│ VI │→│VII │→ …
   └────┘ └────┘ └────┘ └────┘ └────┘ └────┘ └────┘
                                │
            … → VIII → IX → X → XI → ┌─────┐ → XIII
                                     │ XII │  (parade)
                                     │ ✦✦✦ │
                                     └──┬──┘
                                        │
                                        ▼
                              "hello - world"
```

## Installation

```bash
cd ceremonial
# There are no dependencies. Running npm install anyway is a form of prayer.
npm install
```

## CLI Usage

```bash
# Full liturgy; purified text on stdout, ceremony on stderr
node cli.js fixtures/infected.txt

# Quiet mode (paperwork still happens; you just don't hear the choir)
node cli.js --quiet --text "hello—world"

# Overwrite a file after the parade
node cli.js --fix --report fixtures/infected.txt

# Dump the artifact cabinet (JSON) for auditors and gawkers
node cli.js --quiet --artifacts --text "the em dash—begone"

# Force Mercury into retrograde (an override will be filed automatically)
node cli.js --mercury-retrograde --text "a—b"

# Also condemn en dashes (nuclear theology)
node cli.js --aggressive --text "pages 1–5—and beyond"

# Pipe
echo "hello—world" | node cli.js -
```

### Sample Post-Ceremony Summary

```
  POST-CEREMONY EXECUTIVE SUMMARY
  ════════════════════════════════════════════════════════
  Characters processed          : 13
  Threats neutralized           : 1
  Steps completed               : 13
  Forms filed                   : 14
  Rubber stamps applied         : 18
  Committee meetings held       : 3
  Appeals heard (all denied)    : 3
  Tracking numbers issued       : 1
  Lines of bureaucracy          : 247
  Actual deletion steps         : 1  (Step XII)
  Efficiency                    : spiritually negative
  Equivalent one-liner          : text.replaceAll("—", " - ")
```

## Programmatic API

```js
const { purge, conduct, previewSuspects } = require("./ceremonial/src");

// Just the string. Thirteen steps still ran. You simply looked away.
purge("hello—world");
// => "hello - world"

// The full engagement: metrics, stamps, Hansard, tracking numbers, parade route.
const ctx = conduct("the em dash—it must go", { verbose: false });
ctx.metrics.formsFiled;
ctx.artifacts.trialTranscript.cases[0].verdict; // "GUILTY on all counts"
ctx.artifacts.postalReceipts.receipts[0].to;    // "Oblivion, P.O. Box 0, Null Island..."
ctx.artifacts.erasureCertificate.oneLinerWeCouldHaveUsed;
// => 'text.replaceAll("—", " - ")'

// Peek at suspects after the waiver + genealogy only
previewSuspects("a—b--c");
```

## Testing

```bash
npm test
```

Nineteen liturgical assertions. Conviction rate remains 100%.

## FAQ

**Q: Is this slower than `replaceAll`?**
A: Yes. That is the product.

**Q: Can I skip to Step XII?**
A: No. The waiver is non-negotiable. The notary has opinions. The parade has a permit.

**Q: What if Mercury is in retrograde?**
A: We file Form ASTRO-OVERRIDE-77 and continue. The stars are disappointed but compliant.

**Q: Does the postal service really deliver to Null Island?**
A: Tracking shows seven hops and a signature from `∅`. We choose to believe.

**Q: Why thirteen steps instead of twelve?**
A: Twelve felt tidy. Tidiness is how em dashes breed. We added a parade.

## License

MIT — the waiver in Step I still applies.
