
import { SmartBlueprinter } from '../src/ai/SmartBlueprinter';
import { ExecutionEngine } from '../src/engine/ExecutionCore';
import { ModuleDriverFactory } from '../src/engine/ModuleDriverFactory';
import fs from 'fs/promises';
import path from 'path';

async function main() {
    console.log("🚀 DEMO START: MONITORING GOOGLE DRIVE & SLACK\n");

    try {
        // 1. Loading
        process.stdout.write("📦 Loading Knowledge Base... ");
        const registryPath = path.join(process.cwd(), 'src', 'data', 'module_registry.json');
        const registryRaw = await fs.readFile(registryPath, 'utf-8');
        const registry = JSON.parse(registryRaw);
        console.log(`OK (${Object.keys(registry).length} modules ready)`);

        // 2. Initialize
        const ai = new SmartBlueprinter();
        await ai.init();
        const factory = new ModuleDriverFactory(registry);
        const engine = new ExecutionEngine(factory, (lvl, msg) => console.log(`   [${lvl}] ${msg}`));

        // 3. User Prompt
        const prompt = "Monitor my Google Drive for new files and create a reminder in Slack.";
        console.log(`\n👤 User says: "${prompt}"`);

        // 4. AI Process
        console.log("🤖 AI is thinking...");
        const blueprint = await ai.generateFromPrompt(prompt);
        console.log(`   > Plan: Connect ${blueprint.modules.map(m => m.module).join(' -> ')}`);

        // Inject Params for Demo
        blueprint.modules[0].parameters = { folderId: "/docs", watch_type: "new" };
        blueprint.modules[1].parameters = { text: "Review file", time: "tomorrow" };

        // 5. Execution
        console.log("\n⚡ System executing plan...");
        const mappedNodes = blueprint.modules.map(m => ({ id: String(m.id), module: m.module }));
        const mappedConfig = { "1": blueprint.modules[0].parameters, "2": blueprint.modules[1].parameters };

        await engine.runFlow(mappedNodes, mappedConfig);

        console.log("\n✅ OPERATION SUCCESSFUL.");

    } catch (error: any) {
        console.error("\n❌ ERROR:", error.message);
    }
}

main();
