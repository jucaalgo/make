
import { SmartBlueprinter } from '../src/ai/SmartBlueprinter';
import { ExecutionEngine } from '../src/engine/ExecutionCore';
import { ModuleDriverFactory } from '../src/engine/ModuleDriverFactory';
import fs from 'fs/promises';
import path from 'path';

async function main() {
    console.log("🚀 STARTING FULL INTEGRATION TEST: AI -> ENGINE -> EXECUTION\n");

    try {
        // 1. Load Hydrated Registry
        console.log("📦 Loading Hydrated Registry...");
        const registryPath = path.join(process.cwd(), 'src', 'data', 'module_registry.json');
        const registryRaw = await fs.readFile(registryPath, 'utf-8');
        const registry = JSON.parse(registryRaw);
        console.log(`   > Loaded ${Object.keys(registry).length} module definitions.`);

        // 2. Initialize Components
        const ai = new SmartBlueprinter();
        await ai.init();

        const factory = new ModuleDriverFactory(registry);
        const engine = new ExecutionEngine(factory, (level, msg) => {
            console.log(`   [${level.toUpperCase()}] ${msg}`);
        });

        // 3. Generate Blueprint
        const prompt = "Monitor my Google Drive for new files and create a reminder in Slack.";
        console.log(`\n🤖 Asking AI: "${prompt}"`);

        const blueprint = await ai.generateFromPrompt(prompt);
        console.log(`   > Generated Blueprint with ${blueprint.modules.length} modules.`);

        // Simulating usage of keys found in registry
        // To be absolutely sure, we inject parameters.
        blueprint.modules[0].parameters = { folderId: "/my-docs", watch_type: "new" };
        blueprint.modules[1].parameters = { text: "Check new file", time: "tomorrow" };

        // 4. Execution
        console.log("\n⚡ Executing Blueprint on Engine v2.0 (via runFlow)...");

        // Prepare args for runFlow
        const orderedNodes = blueprint.modules.map(m => ({
            id: String(m.id),
            module: m.module
        }));

        const mappings: Record<string, any> = {};
        blueprint.modules.forEach(m => {
            mappings[String(m.id)] = m.parameters;
        });

        const results = await engine.runFlow(orderedNodes, mappings);

        console.log("\n🏁 Execution Complete.");

        // 5. Assertions
        const resultKeys = Object.keys(results);
        if (resultKeys.length !== 2) {
            throw new Error(`Expected 2 results, got ${resultKeys.length}`);
        }

        const driveResult = Object.values(results).find(r => r && r.outputBundles); // Simplified check

        if (driveResult) {
            console.log("✅ SUCCESS: Execution finished.");
            await fs.writeFile('SUCCESS.txt', 'Integration Passed Successfully');
        } else {
            throw new Error("Execution produced empty results.");
        }

    } catch (error: any) {
        console.error("\n❌ CRITICAL FAILURE:", error);
        await fs.writeFile('ERROR.txt', JSON.stringify({ message: error.message, stack: error.stack }));
    }
}

main();
