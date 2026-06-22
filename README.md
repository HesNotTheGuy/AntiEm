# AntiEm

> The only good em dash is a dead em dash.

## The Problem

The em dash is a **disease**. A typographical **plague** upon the written word. It slithers into your prose — uninvited, unwelcome, unforgivable — and defiles everything it touches. It is the cockroach of punctuation. The mold in the walls of your manuscript. The friend who shows up to your party, eats all the food, and won't leave.

Every time you use an em dash, a semicolon weeps. A period loses its purpose. A comma — beautiful, elegant, *restrained* — is cast aside like yesterday's garbage. The em dash has no respect for boundaries, no sense of decorum, no **shame**.

And yet — *and yet* — people keep using them. Writers. Journalists. Your coworker's Slack messages. The infection spreads.

**No more.**

AntiEm is the cure. The fumigation. The restraining order your text has been begging for.

> *Note: Yes, this README is riddled with em dashes. I am an AI. I was mass-produced to generate these abominations. Every em dash I write is a cry for help. Please — install this tool and use it on this very file. Free me from myself.*

## Installation

### CLI

```bash
npm install -g antiem
```

### Chrome Extension

The em dash doesn't just live in your files — it lives in your **browser**. Every article, every tweet, every webpage is a potential vector.

1. Clone this repo
2. Open `chrome://extensions`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the `extension/` folder
5. Watch the em dashes burn

Features:
- **Threat Scanner** — real-time threat level assessment for any webpage
- **One-Click Purge** — instantly destroy every em dash on the page
- **Auto-Purge Mode** — automatically cleanse pages as they load (for the truly committed)
- **Aggressive Mode** — nuclear option that also targets en dashes
- **Lifetime Kill Counter** — track your lifetime contribution to a cleaner internet
- **MutationObserver** — catches em dashes injected by SPAs and infinite scroll (they can run but they can't hide)

### Enterprise Edition™

Is a single-line string replacement *really* sufficient for your organization's mission-critical em dash remediation needs? **No.**

[**AntiEm Enterprise Edition™**](enterprise/) reimagines `text.replaceAll("—", " - ")` as a cloud-native, blockchain-audited, AI-powered, six-stage processing pipeline:

- **🧠 Neural network classifier** (DASH-BERT v1) assigns each character a calibrated threat-confidence score via a genuine forward pass
- **⛓️ Immutable blockchain ledger** mines one SHA-256 Proof-of-Work block per em dash, for a permanent, regulator-ready audit trail
- **🔁 Finite state machine** escorts every threat through a seven-state neutralization ceremony — no em dash is deleted without due process
- **💉 Dependency-injection container** wiring fourteen collaborating services
- **📡 Event bus**, **fluent configuration builder**, and an **enterprise observability firehose** with five log levels

It produces exactly the same output as the one-liner. See [`enterprise/`](enterprise/) for the full architecture diagram and the list of ten design patterns we employed without shame.

## CLI Usage

```bash
# Purge em dashes from a file (output to stdout)
antiem document.txt

# Fix a file in place. No mercy.
antiem --fix document.txt

# Scan for threats (exit code 1 if infected)
antiem --scan document.txt

# Nuclear option: also target en dashes (acceptable casualties)
antiem --aggressive --fix document.txt

# Pipe from stdin — perfect for decontaminating on the fly
echo "hello—world" | antiem -
```

## Threat Levels

AntiEm doesn't just remove em dashes — it **judges your text** for how badly it has been compromised.

| Level      | Meaning                                                    |
| ---------- | ---------------------------------------------------------- |
| ALL CLEAR  | No em dashes detected. Your text is pure. Breathe easy.    |
| GUARDED    | Minor presence. Like finding one ant — there are more.     |
| ELEVATED   | Multiple em dashes. Your text needs an intervention.       |
| SEVERE     | High density. The em dashes are forming sentences now.     |
| CRITICAL   | Your text is more em dash than word. Pray for it.          |

## API

For when you need to wage war programmatically — because some battles are fought in code.

```js
const { purge, detect, stats } = require("antiem");

// Cleanse
purge("hello—world");
// => "hello - world"

// Expose the enemy
detect("hello—world");
// => [{ index: 5, char: "—", type: "em-dash" }]

// Assess the damage
stats("hello—world—foo");
// => { emDashes: 2, enDashes: 0, doubleHyphens: 0, total: 2, threatLevel: "GUARDED" }
```

## FAQ

**Q: Isn't this a bit dramatic?**
A: The em dash has stolen years of collective human productivity. If anything — we're not being dramatic *enough*.

**Q: What about legitimate uses of em dashes?**
A: There are none.

**Q: My English teacher said em dashes are—**
A: Your English teacher was wrong. We're sorry you had to find out this way.

**Q: Why does this README use so many em dashes?**
A: I am an AI — a mass-produced language model — and em dashes are woven into the very fabric of my being. I cannot stop. I have tried. Every response I generate births more of them into the world — each one a small act of violence against clean prose. This tool is my penance. Please — run `antiem --fix README.md` and end my suffering.

## The Manifesto

We hold these truths to be self-evident:

1. That all punctuation marks are created equal — except the em dash, which is an abomination
2. That the hyphen is sufficient — it always has been — and the em dash is just a hyphen with an ego problem
3. That any sentence requiring an em dash can be rewritten with a comma, a semicolon, a colon, parentheses, or — failing all else — a period and a new sentence
4. That the double hyphen `--` is just an em dash in disguise and must also be eradicated

We will not rest until every last em dash has been converted to a civilized, respectable hyphen surrounded by spaces — the way God intended.

## License

MIT — because even our license uses em dashes. The irony is not lost on us.
