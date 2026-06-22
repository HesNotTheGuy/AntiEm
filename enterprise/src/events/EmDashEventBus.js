"use strict";

/**
 * EmDashEventBus
 *
 * A loosely-coupled, publish/subscribe event distribution backbone enabling
 * fully decoupled, event-driven choreography between remediation subsystems.
 *
 * By emitting domain events rather than invoking collaborators directly, we
 * achieve maximal architectural decoupling, ensuring that no component need
 * ever know which other components care that a hyphen got too long.
 *
 * Canonical event topics:
 *   - remediation:started
 *   - token:tokenized
 *   - threat:detected
 *   - threat:confirmed
 *   - threat:neutralized
 *   - block:mined
 *   - remediation:completed
 */

class EmDashEventBus {
  constructor(logger) {
    this._subscribers = new Map();
    this._logger = logger ? logger.forComponent("EmDashEventBus") : null;
    this._emittedCount = 0;
  }

  subscribe(topic, handler) {
    if (!this._subscribers.has(topic)) {
      this._subscribers.set(topic, []);
    }
    this._subscribers.get(topic).push(handler);
    if (this._logger) {
      this._logger.trace(
        `Registered subscriber for topic '${topic}' (total: ${
          this._subscribers.get(topic).length
        })`
      );
    }
    return this;
  }

  publish(topic, payload) {
    this._emittedCount += 1;
    const handlers = this._subscribers.get(topic) || [];
    if (this._logger) {
      this._logger.trace(
        `Publishing event '${topic}' to ${handlers.length} subscriber(s)`
      );
    }
    for (const handler of handlers) {
      // Defensive isolation: a misbehaving subscriber must not be permitted to
      // jeopardize the integrity of the broader remediation initiative.
      try {
        handler(payload, topic);
      } catch (err) {
        if (this._logger) {
          this._logger.error(
            `Subscriber for '${topic}' threw and was quarantined: ${err.message}`
          );
        }
      }
    }
    return this;
  }

  get totalEventsEmitted() {
    return this._emittedCount;
  }
}

module.exports = { EmDashEventBus };
