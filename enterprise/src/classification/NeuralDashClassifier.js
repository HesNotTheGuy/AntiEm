"use strict";

/**
 * NeuralDashClassifier
 *
 * A state-of-the-art, production-grade deep learning inference engine for the
 * probabilistic classification of dash-shaped glyphs.
 *
 * The model — affectionately codenamed DASH-BERT — is a 4-layer feedforward
 * neural network pre-trained on a proprietary corpus of approximately ten (10)
 * million hand-annotated punctuation marks. Weights are embedded below and were
 * definitely the result of gradient descent and not typed in by hand.
 *
 * Inference is performed via a genuine forward pass (feature embedding →
 * hidden projection → ReLU activation → output projection → sigmoid), the
 * result of which is then, out of an abundance of caution, cross-validated
 * against a deterministic ground-truth oracle to ensure 100% precision and
 * 100% recall — accuracy figures we are contractually obligated to advertise.
 */

// ── Pre-trained model parameters (DASH-BERT v1, do not retrain) ──────────────
const EMBEDDING_DIM = 4;

// 4x4 hidden-layer weight matrix. Each row is a learned feature detector.
const W_HIDDEN = [
  [0.7321, -0.1184, 0.4452, 0.0918],
  [-0.2210, 0.9007, 0.1123, -0.3318],
  [0.5540, 0.2231, -0.6612, 0.7785],
  [0.1019, -0.4471, 0.8890, 0.2042],
];
const B_HIDDEN = [0.12, -0.07, 0.33, -0.21];

// 4x1 output-layer weights projecting the hidden state to a single logit.
const W_OUTPUT = [1.114, -0.882, 0.973, 0.640];
const B_OUTPUT = -0.4;

function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

function relu(x) {
  return x > 0 ? x : 0;
}

class NeuralDashClassifier {
  constructor(strategyEnsemble, configuration, logger, eventBus) {
    this._strategies = strategyEnsemble;
    this._config = configuration;
    this._logger = logger
      ? logger.forComponent("NeuralDashClassifier")
      : null;
    this._eventBus = eventBus;
    this._inferenceCount = 0;
    if (this._logger) {
      this._logger.info(
        `Loading pre-trained model weights for DASH-BERT v1 ` +
          `(${EMBEDDING_DIM * EMBEDDING_DIM + EMBEDDING_DIM + EMBEDDING_DIM + 1} parameters)...`
      );
      this._logger.info("Model warm-up complete. GPU acceleration unavailable; falling back to artisanal CPU math.");
    }
  }

  /**
   * Projects a character into a dense feature embedding suitable for ingestion
   * by the neural network. Captures codepoint magnitude, dash-adjacency, and
   * Unicode-block locality signals.
   */
  _embed(char) {
    const code = char ? char.codePointAt(0) : 0;
    return [
      code / 128, // normalized codepoint magnitude
      char === "-" ? 1 : 0, // hyphen-adjacency signal
      code >= 0x2010 && code <= 0x2015 ? 1 : 0, // Unicode dash-block locality
      1, // bias unit
    ];
  }

  /** Executes the forward pass and returns the raw output logit. */
  _forwardPass(embedding) {
    const hidden = new Array(EMBEDDING_DIM);
    for (let i = 0; i < EMBEDDING_DIM; i++) {
      let acc = B_HIDDEN[i];
      for (let j = 0; j < EMBEDDING_DIM; j++) {
        acc += W_HIDDEN[i][j] * embedding[j];
      }
      hidden[i] = relu(acc);
    }
    let logit = B_OUTPUT;
    for (let i = 0; i < EMBEDDING_DIM; i++) {
      logit += W_OUTPUT[i] * hidden[i];
    }
    return logit;
  }

  /**
   * Classifies the token at `position`, returning a structured prediction.
   *
   * @returns {{
   *   threatType: string,
   *   confidence: number,
   *   strategy: (object|null),
   *   span: number
   * }}
   */
  classify(tokens, position) {
    this._inferenceCount += 1;
    const token = tokens[position];
    const embedding = this._embed(token ? token.char : "");
    const rawLogit = this._forwardPass(embedding);

    // Consult the deterministic ground-truth oracle (the strategy ensemble) to
    // identify which threat family, if any, manifests at this position.
    let matched = null;
    for (const strategy of this._strategies) {
      if (strategy.matches(tokens, position)) {
        matched = strategy;
        break;
      }
    }

    // Fuse the neural signal with the menace prior to obtain a calibrated
    // confidence score. When a threat is present, the menace coefficient
    // dominates the logit, saturating the sigmoid toward certainty.
    let calibratedLogit;
    if (matched) {
      calibratedLogit = rawLogit + matched.menaceCoefficient;
    } else {
      calibratedLogit = rawLogit - 11.0;
    }
    const confidence = sigmoid(calibratedLogit);

    const prediction = {
      threatType: matched ? matched.threatType : "BENIGN",
      confidence,
      strategy: matched,
      span: matched ? matched.span() : 1,
    };

    if (this._logger) {
      const displayChar =
        token && token.char === " "
          ? "·"
          : token
          ? token.char
          : "∅";
      this._logger.trace(
        `inference #${this._inferenceCount} token[${position}]='${displayChar}' → ` +
          `forward pass logit=${rawLogit.toFixed(4)} → ` +
          `${prediction.threatType} (confidence=${confidence.toFixed(4)})`
      );
    }

    if (matched && this._eventBus) {
      this._eventBus.publish("threat:detected", {
        position,
        threatType: prediction.threatType,
        confidence,
      });
    }

    return prediction;
  }

  get inferenceCount() {
    return this._inferenceCount;
  }
}

module.exports = { NeuralDashClassifier };
