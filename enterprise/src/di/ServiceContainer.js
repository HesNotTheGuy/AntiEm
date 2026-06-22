"use strict";

const {
  DependencyResolutionException,
} = require("../exceptions/EmDashExceptions");

/**
 * ServiceContainer
 *
 * A lightweight Inversion-of-Control (IoC) container providing constructor
 * dependency injection, lazy singleton instantiation, and transitive
 * dependency graph resolution with circular-dependency detection.
 *
 * Registering our nine (9) collaborating services through a central container,
 * rather than simply calling `new`, decouples construction from consumption and
 * allows us to claim, truthfully, that the system "uses dependency injection."
 */
class ServiceContainer {
  constructor(logger) {
    this._registry = new Map(); // token -> { factory, singleton, instance }
    this._resolving = new Set(); // for circular dependency detection
    this._logger = logger ? logger.forComponent("ServiceContainer") : null;
  }

  /**
   * Registers a service factory under a string token.
   * @param {string} token unique service identifier
   * @param {(c: ServiceContainer) => any} factory receives the container
   * @param {{singleton?: boolean}} options
   */
  register(token, factory, options = {}) {
    const singleton = options.singleton !== false; // default true
    this._registry.set(token, { factory, singleton, instance: undefined });
    if (this._logger) {
      this._logger.debug(
        `Registered service '${token}' (lifecycle: ${
          singleton ? "SINGLETON" : "TRANSIENT"
        })`
      );
    }
    return this;
  }

  /**
   * Resolves a service by token, recursively instantiating its dependency
   * graph on demand. Detects and rejects circular dependencies.
   */
  resolve(token) {
    const entry = this._registry.get(token);
    if (!entry) {
      throw new DependencyResolutionException(
        `No service registered under token '${token}'. The dependency graph ` +
          `is incomplete and the remediation initiative cannot proceed.`,
        { token, known: Array.from(this._registry.keys()) }
      );
    }

    if (entry.singleton && entry.instance !== undefined) {
      return entry.instance;
    }

    if (this._resolving.has(token)) {
      throw new DependencyResolutionException(
        `Circular dependency detected while resolving '${token}'. ` +
          `The architecture has folded in on itself.`,
        { token, chain: Array.from(this._resolving) }
      );
    }

    this._resolving.add(token);
    if (this._logger) {
      this._logger.trace(`Instantiating '${token}'...`);
    }
    let instance;
    try {
      instance = entry.factory(this);
    } finally {
      this._resolving.delete(token);
    }

    if (entry.singleton) {
      entry.instance = instance;
    }
    return instance;
  }

  has(token) {
    return this._registry.has(token);
  }

  get registeredServiceCount() {
    return this._registry.size;
  }
}

module.exports = { ServiceContainer };
