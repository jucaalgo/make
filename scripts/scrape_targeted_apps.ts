
import fs from 'fs/promises';
import { existsSync } from 'fs';
import axios from 'axios';
import * as cheerio from 'cheerio';
import path from 'path';

const CONCURRENCY = 10; // Higher concurrency for targeted list

async function main() {
    try {
        console.log("📂 Loading registry...");
        const registryRaw = await fs.readFile('src/data/module_registry.json', 'utf-8');
        const registry = JSON.parse(registryRaw);

        // Extract unique app slugs
        const requestedApps = new Set<string>();
        for (const key in registry) {
            const entry = registry[key];
            if (entry.app && entry.app !== 'builtin') {
                requestedApps.add(entry.app);
            }
        }

        console.log(`🎯 Targeted Apps found in Registry: ${requestedApps.size}`);
        console.log([...requestedApps].slice(0, 5));

        console.log("📂 Loading apps_index.json...");
        const rawIndex = await fs.readFile('apps_index.json', 'utf-8');
        const allApps = JSON.parse(rawIndex);

        // Build download queue
        const queue: any[] = [];
        const seen = new Set<string>();

        for (const targetSlug of requestedApps) {
            // Find related pages in the index
            // Priority 1: Exact match with -modules suffix (e.g. google-sheets-modules)
            // Priority 2: Exact match (e.g. google-sheets)

            const modulePage = allApps.find((a: any) => a.slug === `${targetSlug}-modules`);
            if (modulePage) {
                if (!seen.has(modulePage.slug)) {
                    queue.push(modulePage);
                    seen.add(modulePage.slug);
                }
            } else {
                // Try to find exact match if no module page exists
                const mainPage = allApps.find((a: any) => a.slug === targetSlug);
                if (mainPage && !seen.has(mainPage.slug)) {
                    queue.push(mainPage);
                    seen.add(mainPage.slug);
                }
            }
        }

        console.log(`📋 Queue size: ${queue.length} documents to download.`);

        const dbDir = path.join(process.cwd(), 'db', 'knowledge_base');
        await fs.mkdir(dbDir, { recursive: true });

        async function worker() {
            while (queue.length > 0) {
                const app = queue.shift();
                if (!app) break;

                const filePath = path.join(dbDir, `${app.slug}.json`);

                if (existsSync(filePath)) {
                    // Check if it's empty or valid? For now assume existence is enough
                    // But if it's small, maybe retry?
                    // console.log(`⏩ Skipping ${app.slug} (already exists)`);
                    continue;
                }

                try {
                    console.log(`⬇️ Fetching ${app.slug}...`);
                    const { data: html } = await axios.get(app.url, { timeout: 15000 });
                    const $ = cheerio.load(html);
                    const nextDataScript = $('#__NEXT_DATA__').html();

                    if (nextDataScript) {
                        const nextData = JSON.parse(nextDataScript);
                        const doc = nextData.props?.pageProps?._doc;

                        if (doc) {
                            await fs.writeFile(filePath, JSON.stringify(doc, null, 2));
                            console.log(`   ✅ Saved ${app.slug}`);
                        } else {
                            console.warn(`   ⚠️ No _doc found for ${app.slug}`);
                        }
                    } else {
                        console.warn(`   ⚠️ No __NEXT_DATA__ for ${app.slug}`);
                    }

                    // Politeness delay
                    await new Promise(r => setTimeout(r, 200));

                } catch (err: any) {
                    console.error(`   ❌ Failed ${app.slug}: ${err.message}`);
                }
            }
        }

        const workers = Array(CONCURRENCY).fill(null).map(() => worker());
        await Promise.all(workers);

        console.log("🏁 Targeted scraping finished.");

    } catch (error) {
        console.error("Critical Error:", error);
    }
}

main();
