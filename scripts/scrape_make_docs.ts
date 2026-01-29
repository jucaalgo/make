
import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs/promises';
import path from 'path';

const BASE_URL = 'https://apps.make.com';
const OUT_DIR = path.join(process.cwd(), 'db', 'knowledge_base');

// Concurrency Limit
const CONCURRENCY = 5;

async function main() {
    console.log("📚 Starting Universal Knowledge Scraper...");
    await fs.mkdir(OUT_DIR, { recursive: true });

    // 1. Fetch Categories / Main Index
    console.log("Fetching Main Index...");
    const { data: indexHtml } = await axios.get(BASE_URL);
    await fs.writeFile('debug_index.html', indexHtml); // DEBUG
    const $ = cheerio.load(indexHtml);

    // Extract Categories based on the sidebar or main content links
    // From inspection: Links to categories usually in nav or main body
    // Let's grab all links that look like /category-name or /app-name
    // Heuristic: Links inside the main integration list

    // Actually, let's look for the sidebar links which seem to be categories
    // Or just grab ALL links and filter for apps.

    // Better strategy based on findings:
    // The main page lists Categories. Clicking a Category lists Apps.

    // Heuristic: Links to /communication, /productivity, etc.
    const categoryLinks: string[] = [];
    $('a').each((i, el) => {
        const href = $(el).attr('href');
        if (href && !href.startsWith('http')) {
            // Relative link, good candidate
            categoryLinks.push(href);
        }
    });

    // Dedupe and Filter
    const uniqueLinks = [...new Set(categoryLinks)].filter(l =>
        l.length > 2 &&
        !l.includes('introduction') &&
        !l.includes('ai') // strictly categories?
    );

    console.log(`Found ${uniqueLinks.length} potential categories/apps.`);

    // 2. Crawl Categories to find Apps
    // Or maybe these ARE the apps if the structure is flat?
    // Let's assume some are apps.

    let allAppLinks: string[] = [];

    // Simple BFS: Deep Crawl 1 Level
    // If page contains "Modules" link, it's an App.
    // If page contains list of other links, it's a category.

    // To be safe and massive: Let's fetch ALL unique links found.
    // Optimizing: Let's assume the user provided 'https://www.make.com/en/integrations' is the better index
    // But we are on apps.make.com.

    // Let's fetch the first level links.
    for (const link of uniqueLinks) {
        // Queue validation
        // We will just add them to queue
    }

    // Since we want "All", and we can't easily distinguish without visiting,
    // let's create a queue.

    const queue = [...uniqueLinks];
    const visited = new Set<string>();
    const appsFound: any[] = [];

    // Worker Function
    const processUrl = async (urlSuffix: string) => {
        if (visited.has(urlSuffix)) return;
        visited.add(urlSuffix);

        const fullUrl = `${BASE_URL}${urlSuffix}`;
        try {
            // console.log(`Crawling ${fullUrl}...`);
            const { data } = await axios.get(fullUrl);
            const $page = cheerio.load(data);

            // Check if it is an App Page
            // App Pages usually have a link to "[App Name] modules"
            const modulesLink = $page('a').filter((i, el) => {
                return $page(el).text().toLowerCase().includes('modules');
            }).first().attr('href');

            if (modulesLink) {
                // It is an App!
                const appName = $page('h1').first().text().trim();
                console.log(`   > Found APP: ${appName} -> Fetching Modules...`);

                // Fetch Modules Page
                const modUrl = modulesLink.startsWith('http') ? modulesLink : `${BASE_URL}${modulesLink}`;
                const { data: modHtml } = await axios.get(modUrl);
                const $mod = cheerio.load(modHtml);

                // Scrape Content
                // Usually structured as H2 (Module Name) -> Table (Params) or Paragraphs
                // Let's dump the text content of the main article for RAG
                const content = $mod('article').text() || $mod('body').text();

                // Save to DB
                const safeName = appName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
                await fs.writeFile(
                    path.join(OUT_DIR, `${safeName}.txt`),
                    `SOURCE: ${modUrl}\nAPP: ${appName}\n\n${content}`
                );
                appsFound.push(appName);
            } else {
                // It might be a category, find more links?
                // For safety to avoid infinite loop, we mostly rely on index.
            }

        } catch (e) {
            // Ignore 404s etc
        }
    };

    // Run Batch
    console.log("Processing batch...");
    const chunks = [];
    for (let i = 0; i < queue.length; i += CONCURRENCY) {
        const batch = queue.slice(i, i + CONCURRENCY);
        await Promise.all(batch.map(url => processUrl(url)));
        process.stdout.write('.');
    }

    console.log(`\n✅ Ingested knowledge for ${appsFound.length} apps.`);
}

main();
