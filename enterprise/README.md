# AntiEm Enterprise Edition™

> A cloud-native, blockchain-audited, AI-powered, enterprise-grade solution for mission-critical em dash remediation at scale.

```
text.replaceAll("—", " - ")
```

That is the entire problem. Below is our solution.

---

## Executive Summary

The em dash represents an existential threat to clean prose. Legacy approaches — so-called "string replacement" — are reckless, unauditable, and fundamentally unprepared for the compliance realities of the modern enterprise.

**AntiEm Enterprise Edition™** reimagines em dash remediation as a fully-observable, cryptographically-audited, AI-driven pipeline. Every em dash is classified by a neural network, escorted through a formal finite-state-machine neutralization ceremony, and permanently recorded on an immutable blockchain ledger.

We could have written one line of code. We chose **digital transformation**.

## Architecture

AntiEm Enterprise Edition™ comprises **fourteen collaborating services**, wired through an Inversion-of-Control container and orchestrated across a **six-stage Pipes-and-Filters pipeline**.

```
                         ┌─────────────────────────────────────────┐
                         │   EmDashRemediationOrchestrator         │
                         │   (Composition Root / Facade)           │
                         └────────────────────┬────────────────────┘
                                              │ bootstraps
                         ┌────────────────────▼────────────────────┐
                         │        ServiceContainer (IoC)           │
                         │   resolves the 14-node dependency graph │
                         └────────────────────┬────────────────────┘
                                              │ wires
                         ┌────────────────────▼────────────────────┐
                         │       TextProcessingPipeline            │
                         └────────────────────┬────────────────────┘
                                              │ threads RemediationContext through
                                              ▼
   ┌──────────────┐   ┌──────────────┐   ┌──────────────────┐   ┌──────────────┐   ┌────────────────┐   ┌──────────┐
   │ ① Tokenize   │──▶│ ② Classify   │──▶│ ③ ThreatAssess   │──▶│ ④ Purify     │──▶│ ⑤ Reconcile    │──▶│ ⑥ Audit  │
   │              │   │   (DASH-BERT)│   │   (FSM ceremony) │   │              │   │  (whitespace)  │   │ (⛓ chain)│
   └──────────────┘   └──────┬───────┘   └────────┬─────────┘   └──────────────┘   └────────────────┘   └────┬─────┘
                             │                    │                                                          │
                    ┌────────▼────────┐  ┌────────▼──────────┐                                  ┌────────────▼───────────┐
                    │ NeuralDash      │  │ CharacterState    │                                  │ BlockchainAuditLedger  │
                    │ Classifier      │  │ Machine (DFA)     │                                  │ (SHA-256 + PoW)        │
                    │ + Strategy      │  │ 7 states          │                                  │ immutable, tamper-     │
                    │   Ensemble      │  │ IDLE→…→COOLDOWN    │                                  │ evident                │
                    └─────────────────┘  └───────────────────┘                                  └────────────────────────┘

           cross-cutting:   EnterpriseLogger (5 levels)      EmDashEventBus (pub/sub)      ConfigurationBuilder (fluent)
```

### The Six Stages

| # | Stage | Responsibility |
|---|-------|----------------|
| ① | **TokenizationStage** | Decomposes the corpus into Unicode-code-point-correct atomic character tokens |
| ② | **ClassificationStage** | Submits each token to the DASH-BERT neural network for probabilistic threat classification |
| ③ | **ThreatAssessmentStage** | Escorts each confirmed threat through the finite state machine's seven-state neutralization ceremony |
| ④ | **PurificationStage** | Substitutes neutralized threats with civilized, spaced hyphens |
| ⑤ | **ReconciliationStage** | Idempotently collapses redundant whitespace to restore typographic equilibrium |
| ⑥ | **AuditStage** | Commits each neutralization to the immutable blockchain and verifies end-to-end chain integrity |

### Key Subsystems

- **🧠 NeuralDashClassifier (DASH-BERT v1)** — A 4-layer feedforward neural network with 25 hand-tuned parameters, performing a genuine forward pass (embedding → ReLU → sigmoid) to assign each character a calibrated threat-confidence score. Cross-validated against a deterministic ground-truth oracle for a guaranteed 100% accuracy we are contractually obligated to advertise.
- **⛓️ BlockchainAuditLedger** — An immutable, SHA-256-chained, Proof-of-Work-sealed distributed ledger. One block is mined per neutralized em dash, producing a permanent, regulator-ready chain of custody. Difficulty configurable from 0 to 6.
- **🔁 CharacterStateMachine** — A formally-specified deterministic finite automaton. No em dash is removed without first passing through `IDLE → SCANNING → SUSPICIOUS → CONFIRMED → NEUTRALIZING → NEUTRALIZED → COOLDOWN`. Illegal transitions throw.
- **💉 ServiceContainer** — A lightweight IoC container with lazy singleton instantiation, transitive dependency resolution, and circular-dependency detection.
- **📡 EmDashEventBus** — A decoupled publish/subscribe backbone broadcasting domain events (`threat:detected`, `block:mined`, `remediation:completed`, …).
- **🏗️ ConfigurationBuilder** — A fluent, self-validating Builder producing immutable, frozen configuration value objects.

## Installation

```bash
cd enterprise
npm install   # (there are no dependencies, but running this demonstrates commitment)
```

## CLI Usage

```bash
# Remediate a file (purified text → stdout, observability firehose → stderr)
node cli.js document.txt

# Remediate in place, with an executive summary and the full blockchain ledger
node cli.js --fix --report --ledger document.txt

# Remediate a literal string, quietly
node cli.js --quiet --text "hello—world"

# Engage AGGRESSIVE_MODE (also neutralizes en dashes)
node cli.js --aggressive --text "pages 1–5"

# Crank the Proof-of-Work difficulty (your CPU will feel this)
node cli.js --difficulty 4 --ledger --text "a—b"

# Pipe from stdin
echo "hello—world" | node cli.js -
```

### Sample Executive Summary

```
  POST-ENGAGEMENT EXECUTIVE SUMMARY
  ════════════════════════════════════════════════════════════════
  Character tokens processed   : 176
  Neural inferences performed  : 174
  Threats detected             : 4
  Threats neutralized          : 4
  FSM state transitions        : 26
  Domain events emitted        : 18
  Blockchain blocks committed  : 5
  Chain integrity              : VERIFIED ✓
  Lines of code to delete "—"  : ~1,400
```

## Programmatic API

For the discerning engineer who wishes to integrate enterprise-grade em dash remediation directly into their value stream:

```js
const { purge, remediate, ConfigurationBuilder } = require("./enterprise/src");

// The humble facade. A neural network, a blockchain, a finite state machine,
// an event bus, and a six-stage pipeline all fire to produce this string.
purge("hello—world");
// => "hello - world"

// The full engagement, with metrics and the cryptographic audit trail.
const result = remediate("the em dash—it must go", { verbose: false });
console.log(result.metrics);          // { tokenCount, threatsDetected, ... }
console.log(result.ledger.blockCount); // immutable proof of what you have done
result.ledger.validateIntegrity();     // => true

// Advanced configuration via the fluent builder.
const config = new ConfigurationBuilder()
  .withAggressiveMode(true)
  .withBlockchainAuditing(true)
  .withProofOfWorkDifficulty(3)
  .withNeuralConfidenceThreshold(0.5)
  .build();

remediate("pages 1–5—and beyond", { configuration: config });
```

## Testing

```bash
node test.js
```

26 tests spanning end-to-end remediation, neural confidence calibration, blockchain integrity & tamper detection, Proof-of-Work, finite-state-machine legality, configuration validation, and IoC container resolution.

## Design Patterns Employed

Because a code review will ask, and we are ready:

- **Facade** (`EmDashRemediationOrchestrator`)
- **Builder** (`ConfigurationBuilder`)
- **Abstract Factory** (`DashDetectionStrategyFactory`)
- **Strategy** (`*DashDetectionStrategy`)
- **Template Method** (`AbstractPipelineStage`)
- **Pipes and Filters** (`TextProcessingPipeline`)
- **Observer / Pub-Sub** (`EmDashEventBus`)
- **Dependency Injection** (`ServiceContainer`)
- **State** (`CharacterStateMachine`)
- **Value Object** (`RemediationConfiguration`)

## Frequently Anticipated Questions

**Q: Why?**
A: Why not.

**Q: Is the neural network real?**
A: It performs a real forward pass with real matrix multiplication. Whether `text === "—"` required a neural network is a philosophical question above our pay grade.

**Q: Is the blockchain real?**
A: It is a real, cryptographically-chained, Proof-of-Work-mined ledger. It secures a record of which dashes you deleted. It is exactly as useful as that sounds.

**Q: Should I use this in production?**
A: Yes. Immediately. Tell your manager it's "AI-powered."

**Q: Couldn't this be one line of code?**
A: See [`../index.js`](../index.js). We do not speak of it here.

## License

MIT — the only thing in this project that is appropriately sized.
