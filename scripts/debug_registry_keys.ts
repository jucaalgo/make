
import fs from 'fs/promises';
import path from 'path';

async function main() {
    const registryPath = path.join(process.cwd(), 'src', 'data', 'module_registry.json');
    const registryRaw = await fs.readFile(registryPath, 'utf-8');
    const registry = JSON.parse(registryRaw);

    const keys = Object.keys(registry).sort();
    console.log(`Total Keys: ${keys.length}`);

    // Print keys that look like they came from hydration (kebab-case)
    const hydratedKeys = keys.filter(k => k.includes('-') && !k.includes('builtin'));
    console.log(`Hydrated-looking Keys: ${hydratedKeys.length}`);

    // Print generic watch keys
    const watchKeys = keys.filter(k => k.includes('watch'));
    console.log("Watch Keys:", watchKeys);
}

main();
