
import { SmartBlueprinter } from '../src/ai/SmartBlueprinter';

async function main() {
    console.log("🧪 Testing AI Blueprint Generator...");

    const ai = new SmartBlueprinter();
    await ai.init();

    const prompt = "Please monitor my Google Drive for new files and then send a message to Slack.";

    try {
        console.log(`\n🗣️ Prompt: "${prompt}"`);
        const blueprint = await ai.generateFromPrompt(prompt);

        console.log("\n✨ Generated Blueprint Structure:");
        console.log(JSON.stringify(blueprint, null, 2));

        // Basic Assertions
        if (blueprint.modules.length === 2) {
            console.log("✅ Correct number of modules generated.");
        } else {
            console.error("❌ Expected 2 modules, got " + blueprint.modules.length);
        }

        const driveModule = blueprint.modules.find(m => m.module.includes('google-drive'));
        if (driveModule) {
            console.log("✅ Google Drive module present.");
        } else {
            console.error("❌ Google Drive module missing.");
        }

    } catch (error) {
        console.error("❌ Test Failed:", error);
    }
}

main();
