
import fs from 'fs/promises';
import path from 'path';

const BLUEPRINTS_DIR = path.join(process.cwd(), 'db', 'make_api_schemas');
const REGISTRY_PATH = path.join(process.cwd(), 'src', 'data', 'module_registry.json');

async function main() {
    console.log("🦾 Starting Real Blueprint Ingestion...");

    // 1. Load Registry
    let registry = {};
    try {
        const content = await fs.readFile(REGISTRY_PATH, 'utf-8');
        registry = JSON.parse(content);
    } catch (e) {
        console.log("⚠️ Registry not found, starting empty.");
    }

    // 2. Find Blueprints
    const files = await fs.readdir(BLUEPRINTS_DIR);
    const bpFiles = files.filter(f => f.startsWith('blueprint_') && f.endsWith('.json'));

    console.log(`Found ${bpFiles.length} blueprints to process.`);

    let enrichedCount = 0;

    for (const file of bpFiles) {
        const bpPath = path.join(BLUEPRINTS_DIR, file);
        const bpContent = await fs.readFile(bpPath, 'utf-8');
        const blueprint = JSON.parse(bpContent);

        console.log(`\n📄 Processing ${file} (${blueprint.name || 'Scenario'})...`);

        // Make Scenarios have a 'scenario' object with 'modules' array
        // Or sometimes directly 'modules' if it's an export.
        // API response for /blueprint usually returns { "response": { "blueprint": { ... } } } or direct blueprint structure
        // Let's handle the structure I saw in previous steps or adapt.

        // Structure from API is usually: { "name": "...", "flow": [ ... modules ... ] }
        // or { "scenario": { "modules": [...] } }

        // We will traverse looking for "module" objects with "name" (app:method)

        const modules = findModulesInBlueprint(blueprint);
        console.log(`   > Found ${modules.length} modules in flow.`);

        for (const mod of modules) {
            const moduleName = mod.module; // e.g. "google-sheets:addRow"
            const label = mod.label || mod.module;

            // If we don't have it, create it
            if (!registry[moduleName]) {
                const [appName, method] = moduleName.split(':');
                registry[moduleName] = {
                    name: moduleName,
                    app: appName,
                    label: label, // Use the real label from user's scenario
                    parameters: mod.parameters || {}, // THE GOLD: Real params
                    mapper: mod.mapper || {}          // THE GOLD: Real mapping logic
                };
                enrichedCount++;
            } else {
                // Enrich existing
                // Merge parameters (prefer real over generic)
                // registry[moduleName].parameters = { ...registry[moduleName].parameters, ...mod.parameters };
                // Actually, let's trust the Blueprint more than our inference
                if (mod.parameters && Object.keys(mod.parameters).length > 0) {
                    registry[moduleName].parameters = mod.parameters;
                }
                if (mod.mapper && Object.keys(mod.mapper).length > 0) {
                    registry[moduleName].mapper = mod.mapper;
                }
                enrichedCount++;
            }
        }
    }

    // 3. Save
    await fs.writeFile(REGISTRY_PATH, JSON.stringify(registry, null, 2));
    console.log(`\n✅ Ingestion Complete. Updated/Created ${enrichedCount} modules.`);
}

function findModulesInBlueprint(obj) {
    let modules = [];

    // Check if current obj is a scenario wrapper
    if (obj.response && obj.response.blueprint) {
        obj = obj.response.blueprint;
    }

    // Make.com blueprint structure usually has a 'flow' array
    if (Array.isArray(obj.flow)) {
        modules = modules.concat(obj.flow);
    }

    return modules;
}

main();
