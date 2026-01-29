"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SmartBlueprinter_1 = require("../src/ai/SmartBlueprinter");
const ExecutionCore_1 = require("../src/engine/ExecutionCore");
const ModuleDriverFactory_1 = require("../src/engine/ModuleDriverFactory");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
async function main() {
    console.log("🚀 DEMO START: MONITORING GOOGLE DRIVE & SLACK\n");
    try {
        // 1. Loading
        process.stdout.write("📦 Loading Knowledge Base... ");
        const registryPath = path_1.default.join(process.cwd(), 'src', 'data', 'module_registry.json');
        const registryRaw = await promises_1.default.readFile(registryPath, 'utf-8');
        const registry = JSON.parse(registryRaw);
        console.log(`OK (${Object.keys(registry).length} modules ready)`);
        // 2. Initialize
        const ai = new SmartBlueprinter_1.SmartBlueprinter();
        await ai.init();
        const factory = new ModuleDriverFactory_1.ModuleDriverFactory(registry);
        const engine = new ExecutionCore_1.ExecutionEngine(factory, (lvl, msg) => console.log(`   [${lvl}] ${msg}`));
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
    }
    catch (error) {
        console.error("\n❌ ERROR:", error.message);
    }
}
main();
