
import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';

// CONFIG
const API_BASE = 'https://us2.make.com/api/v2';
const TOKEN = process.env.MAKE_API_KEY;

async function main() {
    if (!TOKEN) {
        console.error("❌ Error: process.env.MAKE_API_KEY is missing.");
        process.exit(1);
    }

    console.log(`🔌 Connecting to Make API (US2) for Massive Ingestion...`);

    try {
        // 1. Auth Check
        const meRes = await axios.get(`${API_BASE}/users/me`, {
            headers: { 'Authorization': `Token ${TOKEN}` }
        });
        const userName = meRes.data.user?.name || "Unknown";
        console.log(`✅ Authenticated to US2 as: ${userName}`);

        // 2. Get Organization
        console.log("Fetching Organization ID...");
        const orgsRes = await axios.get(`${API_BASE}/organizations`, {
            headers: { 'Authorization': `Token ${TOKEN}` }
        });
        const orgId = orgsRes.data.organizations?.[0]?.id;
        if (!orgId) throw new Error("No Organization found.");
        console.log(`✅ Using Organization ID: ${orgId}`);

        // 3. List ALL Scenarios (High Limit)
        console.log("\n📥 Listing ALL Scenarios (Limit: 500) to find module usage...");
        const scenariosRes = await axios.get(`${API_BASE}/scenarios?organizationId=${orgId}&limit=500`, {
            headers: { 'Authorization': `Token ${TOKEN}` }
        });

        const scenarios = scenariosRes.data.scenarios;
        console.log(`✅ Found ${scenarios.length} scenarios.`);

        const outDir = path.join(process.cwd(), 'db/make_api_schemas');
        await fs.mkdir(outDir, { recursive: true });

        // 4. Download ALL Blueprints
        console.log("\n📥 Downloading Blueprints for verification...");
        let successCount = 0;

        for (const scen of scenarios) {
            const bpPath = path.join(outDir, `blueprint_${scen.id}.json`);

            // Skip if exists? No, user wants fresh data.
            try {
                process.stdout.write(`   > Fetching ${scen.name} (${scen.id})... `);
                const bpRes = await axios.get(`${API_BASE}/scenarios/${scen.id}/blueprint`, {
                    headers: { 'Authorization': `Token ${TOKEN}` }
                });
                await fs.writeFile(bpPath, JSON.stringify(bpRes.data, null, 2));
                successCount++;
                console.log("OK");
                await new Promise(r => setTimeout(r, 100)); // Rate limit kindness
            } catch (e) {
                console.log(`FAILED: ${e.message}`);
            }
        }

        console.log(`\n✨ Downloaded ${successCount}/${scenarios.length} Blueprints.`);

    } catch (error) {
        console.error("🔥 Fatal Error:", error.message);
    }
}

main();
