"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmartBlueprinter = void 0;
const KnowledgeLazyLoader_1 = require("../engine/KnowledgeLazyLoader");
class SmartBlueprinter {
    knowledgeLoader;
    constructor() {
        this.knowledgeLoader = new KnowledgeLazyLoader_1.KnowledgeLazyLoader();
    }
    async init() {
        await this.knowledgeLoader.init();
    }
    /**
     * The Main AI Method.
     * In a production environment, this would call an LLM (Gemini/OpenAI)
     * with the prompt + checks against the Knowledge Base.
     *
     * For this PoC, we implement a "Heuristic Parser" that detects keywords
     * and maps them to known good modules, simulating the AI's decision making.
     */
    async generateFromPrompt(prompt) {
        console.log(`🤖 AI Processing Prompt: "${prompt}"`);
        // 1. Intent Detection (Mocking High-Level Logic)
        // Heuristic: If prompt contains "drive" and "watch", assume Google Drive Watch Files
        // Heuristic: If prompt contains "slack" and "message", assume Slack Create Message
        const detectedApps = [];
        const promptLower = prompt.toLowerCase();
        if (promptLower.includes('drive') && (promptLower.includes('watch') || promptLower.includes('monitor'))) {
            detectedApps.push({ app: 'google-drive', module: 'watch-files-in-a-folder' });
        }
        if (promptLower.includes('slack') && promptLower.includes('message')) {
            detectedApps.push({ app: 'slack', module: 'create-message' });
        }
        if (promptLower.includes('slack') && promptLower.includes('reminder')) {
            detectedApps.push({ app: 'slack', module: 'create-a-reminder' });
        }
        if ((promptLower.includes('sheets') || promptLower.includes('spreadsheet')) && (promptLower.includes('row') || promptLower.includes('add'))) {
            detectedApps.push({ app: 'google-sheets', module: 'add-a-row' });
        }
        if (detectedApps.length === 0) {
            throw new Error("AI could not detect any known intents in the prompt. Try 'watch drive files' or 'send slack message'.");
        }
        console.log(`🧠 AI Detected Logic:`, detectedApps);
        // 2. Knowledge Validaton (Lazy Loading)
        for (const item of detectedApps) {
            const hasKnowledge = await this.knowledgeLoader.ensureAppKnowledge(item.app);
            if (!hasKnowledge) {
                console.warn(`⚠️ Warning: Could not download specs for ${item.app}. Blueprint might be generic.`);
            }
        }
        // 3. Schema-Aware Blueprint Construction
        // We load the specs we just ensured exist to build the proper parameters
        const modules = [];
        let previousModuleId = 0;
        for (const [index, item] of detectedApps.entries()) {
            const moduleId = index + 1;
            // Minimal Spec Lookup
            // In a real AI, we would read the JSON spec to find the exact "name" field 
            // and parameter list. Here we use the knowledge to "validate" existence.
            modules.push({
                id: moduleId,
                module: `${item.app}:${item.module}`, // Convention
                version: 1,
                parameters: {}, // AI would fill this based on prompt context (e.g. "folder_id")
                mapper: {}, // AI would fill this mapping (e.g. text: "{{1.name}}")
                metadata: {
                    designer: {
                        x: index * 300,
                        y: 0
                    }
                }
            });
            previousModuleId = moduleId;
        }
        return {
            name: "AI Generated Flow",
            modules: modules,
            connections: [] // Logical associations
        };
    }
}
exports.SmartBlueprinter = SmartBlueprinter;
