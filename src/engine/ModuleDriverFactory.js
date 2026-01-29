"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleDriverFactory = exports.GenericApiDriver = void 0;
/**
 * GENERIC MODULE DRIVER
 * This class is the "Universal Soldier". It takes a static JSON definition
 * (URL, Method, Headers) and executes it for any App.
 */
class GenericApiDriver {
    metadata;
    _definition; // The registry entry
    constructor(metadata, definition) {
        this.metadata = metadata;
        this._definition = definition;
    }
    async execute(inputBundles, config, context) {
        // Universal Logic:
        // 1. Loop through Input Bundles (The "Transaction")
        const results = [];
        for (const bundle of inputBundles) {
            try {
                // 2. Hydrate Configuration (Map {{variables}})
                const hydratedConfig = this.hydrate(config, bundle, context);
                // 3. Prepare Execution (Mock or Real)
                context.logger('info', `   > Processing Bundle for ${this.metadata.label}`, { bundle });
                // SIMULATION LOGIC (Placeholder for Real HTTP)
                // If it's a "Passthrough" (Sleep, Flow Control), return input.
                if (this.metadata.app === 'builtin' || this.metadata.app === 'util') {
                    results.push(bundle); // Passthrough by default
                    continue;
                }
                // If it's an Action (Create Row, Send Email), return a "Result Bundle"
                // Construct output based on Registry "mapper" definition if available
                const output = this.generateOutput(hydratedConfig);
                results.push(output);
            }
            catch (e) {
                context.logger('error', `   x Failed processing bundle: ${e.message}`);
                // Continue or Throw? Make default is Stop.
                throw e;
            }
        }
        return results;
    }
    hydrate(config, _bundle, _context) {
        // TODO: Implement Real interpolation ({{1.value}}).
        // For Alpha, we just return config as is, assuming inputs are pre-mapped.
        return config;
    }
    generateOutput(config) {
        // Generate a mock output based on the module type.
        // In Step 3 (Integration), this will be replaced by the REAL API response.
        return {
            id: 'gen_' + Math.floor(Math.random() * 10000),
            ...config, // Echo back input configuration as output for verification
            timestamp: new Date().toISOString()
        };
    }
}
exports.GenericApiDriver = GenericApiDriver;
/**
 * FACTORY
 * Creates the appropriate driver for a given module name.
 */
class ModuleDriverFactory {
    registry;
    constructor(registry) {
        this.registry = registry;
    }
    createDriver(moduleName) {
        const def = this.registry[moduleName];
        if (!def) {
            throw new Error(`Module definition not found in registry: ${moduleName}`);
        }
        // In the future, we can return Specialized Drivers (GoogleDriveDriver)
        // For now, we return Universal Generic Driver for everything.
        return new GenericApiDriver({
            id: moduleName, // Use module name as ID for shim
            app: def.app,
            label: def.label,
            version: 1
        }, def);
    }
}
exports.ModuleDriverFactory = ModuleDriverFactory;
