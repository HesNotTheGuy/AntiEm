"use strict";

const crypto = require("crypto");
const {
  BlockchainIntegrityException,
} = require("../exceptions/EmDashExceptions");

/**
 * BlockchainAuditLedger
 *
 * An immutable, cryptographically-chained, tamper-evident distributed ledger
 * providing a permanent and irrefutable audit trail of every em dash ever
 * neutralized by this system.
 *
 * Each neutralization event is committed as a Block, sealed with a SHA-256
 * digest that incorporates the hash of its predecessor, forming an unbroken
 * cryptographic chain of custody from the Genesis Block to the present moment.
 * Blocks are sealed via Proof-of-Work to ensure that destroying an em dash
 * carries an appropriate computational cost, as it should.
 *
 * Should regulators, historians, or future civilizations wish to verify the
 * provenance of any given em dash removal, the full chain may be exported and
 * independently validated. We have prepared for this eventuality.
 */

class Block {
  constructor(index, previousHash, payload) {
    this.index = index;
    this.timestamp = new Date().toISOString();
    this.payload = payload;
    this.previousHash = previousHash;
    this.nonce = 0;
    this.hash = this.computeHash();
  }

  computeHash() {
    const material =
      String(this.index) +
      this.previousHash +
      this.timestamp +
      JSON.stringify(this.payload) +
      String(this.nonce);
    return crypto.createHash("sha256").update(material).digest("hex");
  }

  /**
   * Seals this block via Proof-of-Work, iterating the nonce until the resulting
   * digest exhibits the required number of leading zeroes. This is the same
   * mechanism that secures several major cryptocurrencies, now repurposed for
   * the far worthier cause of punctuation enforcement.
   */
  mine(difficulty) {
    const target = "0".repeat(difficulty);
    while (this.hash.substring(0, difficulty) !== target) {
      this.nonce += 1;
      this.hash = this.computeHash();
    }
    return this;
  }
}

class BlockchainAuditLedger {
  constructor(configuration, logger, eventBus) {
    this._difficulty = configuration.proofOfWorkDifficulty;
    this._logger = logger
      ? logger.forComponent("BlockchainAuditLedger")
      : null;
    this._eventBus = eventBus;
    this._chain = [this._createGenesisBlock()];
    if (this._logger) {
      this._logger.info(
        `Genesis block forged. Ledger initialized with Proof-of-Work ` +
          `difficulty ${this._difficulty}.`
      );
    }
  }

  _createGenesisBlock() {
    const genesis = new Block(0, "0".repeat(64), {
      event: "GENESIS",
      decree:
        "In the beginning there was the hyphen, and the hyphen was good.",
    });
    // The genesis block is mined at difficulty 0 by fiat; it answers to no one.
    return genesis;
  }

  get latestBlock() {
    return this._chain[this._chain.length - 1];
  }

  /**
   * Commits a neutralization event to the ledger as a freshly-mined block.
   * @param {object} payload structured record of the neutralized threat
   */
  commit(payload) {
    const block = new Block(
      this._chain.length,
      this.latestBlock.hash,
      payload
    );
    block.mine(this._difficulty);
    this._chain.push(block);
    if (this._logger) {
      this._logger.info(
        `Block #${block.index} mined: ${block.hash.substring(0, 16)}… ` +
          `(nonce=${block.nonce}, threat=${payload.threatType || "n/a"})`
      );
    }
    if (this._eventBus) {
      this._eventBus.publish("block:mined", {
        index: block.index,
        hash: block.hash,
        nonce: block.nonce,
      });
    }
    return block;
  }

  /**
   * Validates the cryptographic integrity of the entire chain, recomputing each
   * digest and verifying each back-reference. Throws on the first sign of
   * tampering, because trust, once cryptographically broken, cannot be patched.
   */
  validateIntegrity() {
    for (let i = 1; i < this._chain.length; i++) {
      const current = this._chain[i];
      const previous = this._chain[i - 1];
      if (current.hash !== current.computeHash()) {
        throw new BlockchainIntegrityException(
          `Block #${current.index} has been tampered with. The chain is compromised.`,
          { index: current.index }
        );
      }
      if (current.previousHash !== previous.hash) {
        throw new BlockchainIntegrityException(
          `Block #${current.index} does not honor its predecessor. The chain is broken.`,
          { index: current.index }
        );
      }
    }
    if (this._logger) {
      this._logger.info(
        `Chain integrity verified across ${this._chain.length} block(s). ` +
          `The historical record is immutable and beyond reproach.`
      );
    }
    return true;
  }

  get chain() {
    return this._chain.slice();
  }

  get blockCount() {
    return this._chain.length;
  }
}

module.exports = { BlockchainAuditLedger, Block };
