
import fs from 'fs/promises';
import path from 'path';

async function main() {
    const registryPath = path.join(process.cwd(), 'src', 'data', 'module_registry.json');
    const registryRaw = await fs.readFile(registryPath, 'utf-8');
    const registry = JSON.parse(registryRaw);

    // Find keys with 'watch' and 'files'
    const keys = Object.keys(registry).filter(k =>
        k.toLowerCase().includes('watch') && k.toLowerCase().includes('files')
    );
    console.log("Keys matching 'watch' and 'files':", keys);
}

main();
