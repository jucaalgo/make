
import fs from 'fs/promises';
import path from 'path';

async function analyze() {
    const registryPath = path.join(process.cwd(), 'src', 'data', 'module_registry.json');
    const data = await fs.readFile(registryPath, 'utf-8');
    const registry = JSON.parse(data);

    const counts: Record<string, number> = {};

    Object.values(registry).forEach((mod: any) => {
        // Normalize app name to handle casing issues if any
        const appName = mod.app;
        counts[appName] = (counts[appName] || 0) + 1;
    });

    console.log("--- Module Distribution ---");
    // Sort by count descending
    Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .forEach(([app, count]) => {
            console.log(`${app}: ${count}`);
        });
}

analyze();
