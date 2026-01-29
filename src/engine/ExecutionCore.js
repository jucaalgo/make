"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
resolveInputBundles(_currentId, string, results, (Record));
types_1.Bundle[];
{
    import { ModuleDriverFactory } from './ModuleDriverFactory';
    /**
     * THE UNIVERSAL ENGINE
     * Executes a flow by orchestrating data movement between modules.
     */
    class ExecutionEngine {
        context;
        factory;
        constructor(factory, logger) {
            this.factory = factory;
            this.context = {
                scenarioId: 'scen_' + Date.now(),
                executionId: 'exec_' + Date.now(),
                scope: {},
                globals: {},
                logger: logger
            };
        }
        /**
         * Runs a full scenario flow.
         * @param orderedNodes - Topology sorted list of nodes to execute
         * @param mappings - Configuration with {{variables}} for each node
         */
        async runFlow(orderedNodes, mappings) {
            const results = {};
            this.context.logger('info', `🚀 Starting Flow Execution with ${orderedNodes.length} nodes.`);
            for (const node of orderedNodes) {
                let driver;
                try {
                    driver = this.factory.createDriver(node.module);
                }
                catch (e) {
                    this.context.logger('error', `❌ Missing Driver for module: ${node.module}. Error: ${e.message}`);
                    continue;
                }
                this.context.logger('info', `⚡ Executing Node ${node.id} (${node.module})...`);
                // 1. RESOLVE INPUTS (The Magic)
                const inputBundles = this.resolveInputBundles(node.id, results);
                // 2. TIMING
                const startTime = Date.now();
                let outputBundles = [];
                try {
                    // EXECUTE (The Universal Call)
                    outputBundles = await driver.execute(inputBundles, mappings[node.id], this.context);
                    // 3. STORE RESULT
                    this.context.scope[node.id] = outputBundles;
                    results[node.id] = {
                        nodeId: node.id,
                        status: 'success',
                        outputBundles: outputBundles,
                        metrics: {
                            durationMs: Date.now() - startTime,
                            inputCount: inputBundles.length,
                            outputCount: outputBundles.length
                        }
                    };
                    this.context.logger('info', `✅ Node ${node.id} finished. Out: ${outputBundles.length} bundles.`);
                }
                catch (err) {
                    this.context.logger('error', `🔥 Node ${node.id} Failed: ${err.message}`);
                    results[node.id] = {
                        nodeId: node.id,
                        status: 'error',
                        outputBundles: [],
                        metrics: { durationMs: Date.now() - startTime, inputCount: inputBundles.length, outputCount: 0 },
                        error: err
                    };
                    break;
                }
            }
            return results;
        }
        resolveInputBundles(currentId, results) {
            // Fallback: If no scope, it's a trigger -> [ {} ]
            const executedIds = Object.keys(results);
            if (executedIds.length === 0)
                return [{}];
            const lastNodeId = executedIds[executedIds.length - 1]; // Linearity assumption
            return results[lastNodeId].outputBundles;
        }
    }
    exports.ExecutionEngine = ExecutionEngine;
}
