
import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';

const API_BASE = 'https://us2.make.com/api/v2';
// Token provided by user
const TOKEN = process.env.MAKE_API_KEY || "ec1f1eb6-d26b-47ba-80a7-5273cbbb9b0c";
const REGISTRY_PATH = path.join(process.cwd(), 'src', 'data', 'module_registry.json');
const OUT_DIR = path.join(process.cwd(), 'db', 'make_api_apps');

async function main() {
    console.log("🦾 Starting App Metadata Discovery...");
    await fs.mkdir(OUT_DIR, { recursive: true });

    // 1. Load Registry
    const regContent = await fs.readFile(REGISTRY_PATH, 'utf-8');
    const registry = JSON.parse(regContent);
    const uniqueApps = [...new Set(Object.values(registry).map(m => m.app))];

    console.log(`📚 Registry contains ${uniqueApps.length} unique apps.`);

    // 2. Query API for each App
    // Endpoint: /apps?name=... or /apps (list)
    // Then /apps/{appId}

    // Let's first get a list of all public apps if possible, or search one by one
    // Note: /apps endpoint usually lists apps accessible to the user (private/custom + installed).
    // Public apps might not be listed unless "installed". 
    // But let's try searching.

    for (const appName of uniqueApps) {
        if (appName === 'builtin' || appName === 'tools') continue; // Skip internals

        try {
            process.stdout.write(`   > Searching info for '${appName}'... `);

            // Search by name (this is a guess on query param, standard is name or query)
            // Make API docs say: GET /apps Listing apps. Query params: query
            const searchRes = await axios.get(`${API_BASE}/apps?query=${appName}&limit=1`, {
                headers: { 'Authorization': `Token ${TOKEN}` }
            });

            const foundApp = searchRes.data.apps?.[0];

            if (foundApp) {
                process.stdout.write(`Found (${foundApp.name} v${foundApp.version}). `);

                // Get Full Details
                // GET /apps/{appId}/{version} or just /apps/{appId}
                // Try to get modules
                const detailRes = await axios.get(`${API_BASE}/apps/${foundApp.name}/${foundApp.version}`, {
                    headers: { 'Authorization': `Token ${TOKEN}` },
                    validateStatus: () => true // Don't throw on error yet
                });

                if (detailRes.status === 200) {
                    const appDef = detailRes.data;
                    await fs.writeFile(path.join(OUT_DIR, `${appName}_def.json`), JSON.stringify(appDef, null, 2));
                    console.log("✅ Saved Definition.");
                } else {
                    // Try just /apps/{appId}
                    // Or /sdk/apps if it's custom
                    console.log(`⚠️ Detail fetch failed (${detailRes.status}). Only basic info available.`);
                }

            } else {
                console.log("x Not found in API.");
            }

            await new Promise(r => setTimeout(r, 100)); // Rate limit

        } catch (e) {
            console.log(`Error: ${e.message}`);
        }
    }
}

main();
