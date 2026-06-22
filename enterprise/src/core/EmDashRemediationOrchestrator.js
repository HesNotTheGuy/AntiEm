"use strict";

const { EnterpriseLogger, LEVELS } = require("../logging/EnterpriseLogger");
const { ServiceContainer } = require("../di/ServiceContainer");
const { EmDashEventBus } = require("../events/EmDashEventBus");
const {
  DashDetectionStrategyFactory,
} = require("../strategies/DashDetectionStrategyFactory");
const {
  NeuralDashClassifier,
} = require("../classification/NeuralDashClassifier");
const {
  CharacterStateMachine,
} = require("../statemachine/CharacterStateMachine");
const {
  BlockchainAuditLedger,
} = require("../ledger/BlockchainAuditLedger");
const {
  TextProcessingPipeline,
} = require("../pipeline/TextProcessingPipeline");
const { RemediationContext } = require("../pipeline/PipelineStage");

const { TokenizationStage } = require("../pipeline/stages/TokenizationStage");
const {
  ClassificationStage,
} = require("../pipeline/stages/ClassificationStage");
const {
  ThreatAssessmentStage,
} = require("../pipeline/stages/ThreatAssessmentStage");
const { PurificationStage } = require("../pipeline/stages/PurificationStage");
const {
  ReconciliationStage,
} = require("../pipeline/stages/ReconciliationStage");
const { AuditStage } = require("../pipeline/stages/AuditStage");

/**
 * EmDashRemediationOrchestrator
 *
 * The composition root and top-level facade of AntiEm Enterprise Edition™.
 *
 * On construction it bootstraps the Inversion-of-Control container, registers
 * the complete graph of fourteen (14) collaborating services, and wires the
 * six-stage processing pipeline. The `remediate` method then represents a
 * single, fully-audited em dash remediation engagement.
 *
 * One orchestrator models one engagement: its blockchain ledger, neural
 * inference counters, and state machine accumulate engagement-scoped state.
 * For independent engagements, instantiate independent orchestrators. This is
 * not a limitation; it is a lifecycle.
 */
class EmDashRemediationOrchestrator {
  constructor(configuration, runtimeOptions = {}) {
    this._config = configuration;
    this._container = new ServiceContainer();
    this._bootstrap(runtimeOptions);
  }

  _bootstrap(runtimeOptions) {
    const c = this._container;
    const config = this._config;

    const logLevel =
      runtimeOptions.logLevelOverride !== undefined
        ? runtimeOptions.logLevelOverride
        : config.logLevel;

    // ── Root infrastructure ──────────────────────────────────────────────
    c.register(
      "logger",
      () =>
        new EnterpriseLogger("Bootstrap", {
          level: logLevel,
          color: config.enableColor,
          sink: runtimeOptions.sink,
        }),
      { singleton: true }
    );
    // Re-point the container's own diagnostic logger now that one exists.
    c._logger = c.resolve("logger").forComponent("ServiceContainer");

    c.register("config", () => config);
    c.register(
      "eventBus",
      (ctr) => new EmDashEventBus(ctr.resolve("logger"))
    );

    // ── Detection & classification ───────────────────────────────────────
    c.register(
      "strategyFactory",
      (ctr) =>
        new DashDetectionStrategyFactory(
          ctr.resolve("config"),
          ctr.resolve("logger")
        )
    );
    c.register("strategyEnsemble", (ctr) =>
      ctr.resolve("strategyFactory").createStrategyEnsemble()
    );
    c.register(
      "neuralClassifier",
      (ctr) =>
        new NeuralDashClassifier(
          ctr.resolve("strategyEnsemble"),
          ctr.resolve("config"),
          ctr.resolve("logger"),
          ctr.resolve("eventBus")
        )
    );

    // ── Ceremony & audit ─────────────────────────────────────────────────
    c.register(
      "stateMachine",
      (ctr) =>
        new CharacterStateMachine(
          ctr.resolve("logger"),
          ctr.resolve("eventBus")
        )
    );
    c.register(
      "blockchainLedger",
      (ctr) =>
        new BlockchainAuditLedger(
          ctr.resolve("config"),
          ctr.resolve("logger"),
          ctr.resolve("eventBus")
        )
    );

    // ── Pipeline stages (6) ──────────────────────────────────────────────
    c.register(
      "stage.tokenization",
      (ctr) => new TokenizationStage(ctr.resolve("logger"))
    );
    c.register(
      "stage.classification",
      (ctr) =>
        new ClassificationStage(
          ctr.resolve("logger"),
          ctr.resolve("neuralClassifier"),
          ctr.resolve("config")
        )
    );
    c.register(
      "stage.threatAssessment",
      (ctr) =>
        new ThreatAssessmentStage(
          ctr.resolve("logger"),
          ctr.resolve("stateMachine")
        )
    );
    c.register(
      "stage.purification",
      (ctr) => new PurificationStage(ctr.resolve("logger"))
    );
    c.register(
      "stage.reconciliation",
      (ctr) => new ReconciliationStage(ctr.resolve("logger"))
    );
    c.register(
      "stage.audit",
      (ctr) =>
        new AuditStage(
          ctr.resolve("logger"),
          ctr.resolve("blockchainLedger"),
          ctr.resolve("config")
        )
    );

    // ── Pipeline assembly ────────────────────────────────────────────────
    c.register(
      "pipeline",
      (ctr) =>
        new TextProcessingPipeline(
          [
            ctr.resolve("stage.tokenization"),
            ctr.resolve("stage.classification"),
            ctr.resolve("stage.threatAssessment"),
            ctr.resolve("stage.purification"),
            ctr.resolve("stage.reconciliation"),
            ctr.resolve("stage.audit"),
          ],
          ctr.resolve("logger")
        )
    );

    const logger = c.resolve("logger");
    logger.info(
      "Initializing AntiEm Enterprise Edition™ v1.0.0-ENTERPRISE"
    );
    logger.info(
      `IoC container provisioned with ${c.registeredServiceCount} registered service(s)`
    );
  }

  /**
   * Conducts a complete, audited remediation engagement against `text`.
   * @param {string} text the corpus to remediate
   * @returns {{
   *   input: string,
   *   output: string,
   *   metrics: object,
   *   purgeOperations: object[],
   *   ledger: (object|null),
   *   stateMachine: object,
   *   eventsEmitted: number
   * }}
   */
  remediate(text) {
    const logger = this._container.resolve("logger");
    const eventBus = this._container.resolve("eventBus");
    eventBus.publish("remediation:started", { length: text.length });
    logger.info(
      `Remediation engagement commenced for corpus of ${text.length} character(s)`
    );

    const context = new RemediationContext(text, this._config);
    const pipeline = this._container.resolve("pipeline");
    const result = pipeline.run(context);

    eventBus.publish("remediation:completed", {
      neutralized: result.metrics.threatsNeutralized,
    });
    logger.info(
      `Engagement concluded: ${result.metrics.threatsNeutralized} em dash ` +
        `threat(s) eliminated with extreme prejudice`
    );

    return {
      input: text,
      output: result.output,
      metrics: result.metrics,
      purgeOperations: result.purgeOperations,
      ledger: this._config.blockchainAuditingEnabled
        ? this._container.resolve("blockchainLedger")
        : null,
      stateMachine: this._container.resolve("stateMachine"),
      eventsEmitted: eventBus.totalEventsEmitted,
    };
  }

  /** Exposes the IoC container for advanced introspection and zero good reasons. */
  get container() {
    return this._container;
  }
}

module.exports = { EmDashRemediationOrchestrator, LEVELS };
