
import fs from 'fs/promises';
import * as cheerio from 'cheerio';

async function main() {
    try {
        console.log("📂 Reading debug_index.html...");
        const html = await fs.readFile('debug_index.html', 'utf-8');
        const $ = cheerio.load(html);

        console.log("🔍 Extracting Next.js Data...");
        const nextDataScript = $('#__NEXT_DATA__').html();

        if (!nextDataScript) {
            console.error("❌ Could not find #__NEXT_DATA__ script!");
            return;
        }

        const nextData = JSON.parse(nextDataScript);

        console.log("Keys in props:", Object.keys(nextData.props || {}));
        if (nextData.props.pageProps) {
            console.log("Keys in pageProps:", Object.keys(nextData.props.pageProps));

            // Check specific known keys from visual inspection
            if (nextData.props.pageProps._doc) {
                console.log("Found _doc. Nodes count:", nextData.props.pageProps._doc.data?.nodes?.length);
            }
            if (nextData.props.pageProps.rightDoc) {
                console.log("Found rightDoc. Children count:", nextData.props.pageProps.rightDoc.children?.length);
            }
        }

        const apps: any[] = [];
        const seenUrls = new Set<string>();

        // ROBUST RECURSION
        function traverse(node: any, depth = 0) {
            if (!node || typeof node !== 'object') return;
            if (depth > 20) return; // Prevent stack overflow on circular refs or too deep

            // Heuristic for an App Node
            // Based on: {"name":"Affinity by Codex Solutions","urlKey":"affinity-f3xs5o"}
            if (node.name && node.urlKey && typeof node.urlKey === 'string') {
                // exclude categories or weird keys
                if (!node.urlKey.includes('introduction') && !node.isCategory) {
                    const url = `https://apps.make.com/${node.urlKey}`;
                    if (!seenUrls.has(url)) {
                        seenUrls.add(url);
                        apps.push({
                            name: node.name,
                            url: url,
                            slug: node.urlKey
                        });
                    }
                }
            }

            // Recurse
            if (Array.isArray(node)) {
                node.forEach(child => traverse(child, depth + 1));
            } else {
                Object.values(node).forEach(child => traverse(child, depth + 1));
            }
        }

        traverse(nextData.props);

        console.log(`✅ Found ${apps.length} unique apps.`);

        if (apps.length > 0) {
            console.log("Sample:", apps.slice(0, 5));
            await fs.writeFile('apps_index.json', JSON.stringify(apps, null, 2));
            console.log("💾 Saved to apps_index.json");
        } else {
            console.error("❌ No apps found via recursion. Inspecting keys manually might be needed.");
        }

    } catch (error) {
        console.error("Error:", error);
    }
}

main();
