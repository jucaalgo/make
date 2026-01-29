
import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs/promises';

async function main() {
    console.log("Restoring apps_index.json...");
    try {
        const { data: html } = await axios.get('https://apps.make.com');
        const $ = cheerio.load(html);
        const nextDataScript = $('#__NEXT_DATA__').html();
        if (!nextDataScript) return;

        const nextData = JSON.parse(nextDataScript);
        const apps: any[] = [];
        const seenUrls = new Set<string>();

        function traverse(node: any, depth = 0) {
            if (!node || typeof node !== 'object' || depth > 20) return;
            if (node.name && node.urlKey && typeof node.urlKey === 'string' && !node.isCategory) {
                const url = `https://apps.make.com/${node.urlKey}`;
                if (!seenUrls.has(url)) {
                    seenUrls.add(url);
                    apps.push({ name: node.name, url, slug: node.urlKey });
                }
            }
            if (Array.isArray(node)) node.forEach(c => traverse(c, depth + 1));
            else Object.values(node).forEach(c => traverse(c, depth + 1));
        }

        traverse(nextData.props);
        await fs.writeFile('apps_index.json', JSON.stringify(apps, null, 2));
        console.log(`✅ Restored ${apps.length} apps to apps_index.json`);
    } catch (e) {
        console.error(e);
    }
}
main();
