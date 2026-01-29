
import fs from 'fs/promises';
import { existsSync } from 'fs';
import axios from 'axios';
import * as cheerio from 'cheerio';
import path from 'path';

const CONCURRENCY = 5;
const MAX_DOWNLOADS = 100; // PoC limit

async function main() {
    try {
        console.log("📂 Loading apps_index.json...");
        const rawIndex = await fs.readFile('apps_index.json', 'utf-8');
        const allApps = JSON.parse(rawIndex);

        console.log(`Total indexed pages: ${allApps.length}`);

        // Prioritize modules pages
        const modulePages = allApps.filter((a: any) => a.slug.endsWith('-modules'));
        const otherPages = allApps.filter((a: any) => !a.slug.endsWith('-modules'));

        const queue = [...modulePages, ...otherPages]; // Process modules first

        console.log(`Queue size: ${queue.length} (Modules pages: ${modulePages.length})`);

        // Create DB dir
        const dbDir = path.join(process.cwd(), 'db', 'knowledge_base');
        await fs.mkdir(dbDir, { recursive: true });

        let processed = 0;
        let active = 0;

        async function worker() {
            while (processed < MAX_DOWNLOADS && queue.length > 0) {
                const app = queue.shift();
                if (!app) break;

                const filePath = path.join(dbDir, `${app.slug}.json`);

                if (existsSync(filePath)) {
                    // console.log(`⏩ Skipping ${app.slug} (exists)`);
                    continue;
                }

                try {
                    console.log(`[${processed + 1}/${MAX_DOWNLOADS}] ⬇️ Fetching ${app.slug}...`);
                    const { data: html } = await axios.get(app.url, { timeout: 10000 });
                    const $ = cheerio.load(html);
                    const nextDataScript = $('#__NEXT_DATA__').html();

                    if (nextDataScript) {
                        const nextData = JSON.parse(nextDataScript);
                        const doc = nextData.props?.pageProps?._doc;

                        if (doc) {
                            await fs.writeFile(filePath, JSON.stringify(doc, null, 2));
                            console.log(`   ✅ Saved ${app.slug}`);
                            processed++;
                        } else {
                            console.warn(`   ⚠️ No _doc found for ${app.slug}`);
                        }
                    } else {
                        console.warn(`   ⚠️ No __NEXT_DATA__ for ${app.slug}`);
                    }

                    // Politeness delay
                    await new Promise(r => setTimeout(r, 500));

                } catch (err: any) {
                    console.error(`   ❌ Failed ${app.slug}: ${err.message}`);
                }
            }
        }

        const workers = Array(CONCURRENCY).fill(null).map(() => worker());
        await Promise.all(workers);

        console.log("🏁 Scraping session finished.");

    } catch (error) {
        console.error("Critical Error:", error);
    }
}

main();
