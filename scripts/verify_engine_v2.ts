
import fs from 'fs/promises';
import path from 'path';
import { ExecutionEngine } from '../src/engine/ExecutionCore';
import { ModuleDriverFactory } from '../src/engine/ModuleDriverFactory';

async function main() {
    console.log("🧪 Starting Engine v2.0 Verification Test...");

    // 1. Load Real Registry
    const REGISTRY_PATH = path.join(process.cwd(), 'src', 'data', 'module_registry.json');
    const registryContent = await fs.readFile(REGISTRY_PATH, 'utf-8');
    const registry = JSON.parse(registryContent);
    console.log(`📚 Loaded Registry with ${Object.keys(registry).length} modules.`);

    // 2. Setup Engine
    const factory = new ModuleDriverFactory(registry);
    // Create a shim registry for the engine (mapping string -> instance)
    // For this test, we instantiate drivers on demand or map them.
    // The ExecutionEngine expects a map of INSTANCES.
    // Let's modify ExecutionEngine usage slightly or prepopulate.

    // Quick fix: Populate the specific modules we need for the test
    const neededModules = [
        'google-drive:searchForFilesFolders',
        'builtin:BasicFeeder', // Iterator
        'google-drive:getAFile',
        'gemini-ai:createACompletionGeminiPro',
        'gemini-ai:uploadAFile',
        'builtin:BasicAggregator'
    ];

    const driverMap: any = {};
    for (const modName of neededModules) {
        if (registry[modName]) {
            driverMap[modName] = factory.createDriver(modName);
        } else {
            console.warn(`⚠️ Warning: Module ${modName} not in registry?`);
        }
    }

    const engine = new ExecutionEngine(driverMap, (level, msg, data) => {
        console.log(`[${level.toUpperCase()}] ${msg}`, data ? JSON.stringify(data).substring(0, 100) + '...' : '');
    });

    // 3. Define Flow (Mini Replication of "RevisionFotos")
    // Flow: Search Folders (Trigger) -> Iterator -> Get File -> Upload -> Gemini
    const flow = [
        { id: '1', module: 'google-drive:searchForFilesFolders' }, // Finds 2 folders
        { id: '23', module: 'google-drive:searchForFilesFolders' }, // Finds files inside folder 1
        // Simplified for test: 1 -> 23
    ];

    // 4. Mock Inputs/Mappings
    const mappings = {
        '1': { query: "mimeType = 'application/vnd.google-apps.folder'" },
        '23': { folderId: "{{1.id}}" } // Engine should handle this dependency
    };

    console.log("🚀 Running Simulation...");
    const results = await engine.runFlow(flow, mappings);

    // 5. Audit Results
    console.log("\n📊 Execution Results:");
    for (const [nodeId, res] of Object.entries(results)) {
        console.log(`Node ${nodeId}: ${res.status} (${res.metrics.outputCount} bundles)`);
    }
}

main();
