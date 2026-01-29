
import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import axios from 'axios';
import * as cheerio from 'cheerio';

// Lazy Loader for App Documentation
export class KnowledgeLazyLoader {
    private index: any[] = [];
    private dbDir: string;

    constructor() {
        this.dbDir = path.join(process.cwd(), 'db', 'knowledge_base');
    }

    async init() {
        // Load the full index of 3500 apps if not loaded
        if (this.index.length === 0) {
            try {
                const raw = await fs.readFile('apps_index.json', 'utf-8');
                this.index = JSON.parse(raw);
            } catch (e) {
                console.error("⚠️ LazyLoader: Could not load apps_index.json");
            }
        }
    }

    async ensureAppKnowledge(appSlug: string): Promise<boolean> {
        const filePath = path.join(this.dbDir, `${appSlug}.json`);

        if (existsSync(filePath)) {
            return true; // Knowledge exists
        }

        console.log(`🧠 Knowledge missing for '${appSlug}'. Initiating Lazy Load...`);

        // Find URL in index
        // Priority: *-modules > *
        let appEntry = this.index.find(a => a.slug === `${appSlug}-modules`);
        if (!appEntry) {
            appEntry = this.index.find(a => a.slug === appSlug);
        }

        if (!appEntry) {
            console.error(`❌ App '${appSlug}' not found in global index.`);
            return false;
        }

        // Scrape on demand
        try {
            console.log(`⬇️ Fetching specs from ${appEntry.url}...`);
            const { data: html } = await axios.get(appEntry.url, { timeout: 10000 });
            const $ = cheerio.load(html);
            const nextDataScript = $('#__NEXT_DATA__').html();

            if (nextDataScript) {
                const nextData = JSON.parse(nextDataScript);
                const doc = nextData.props?.pageProps?._doc;
                if (doc) {
                    await fs.mkdir(this.dbDir, { recursive: true });
                    await fs.writeFile(filePath, JSON.stringify(doc, null, 2));
                    console.log(`✅ Knowledge acquired for '${appSlug}'.`);
                    return true;
                }
            }
        } catch (error: any) {
            console.error(`❌ Lazy Load failed: ${error.message}`);
        }

        return false;
    }
}
