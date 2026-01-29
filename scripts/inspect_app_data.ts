
import fs from 'fs/promises';
import * as cheerio from 'cheerio';

async function main() {
    try {
        console.log("📂 Reading debug_modules.html...");
        const html = await fs.readFile('debug_modules.html', 'utf-8');
        const $ = cheerio.load(html);

        const nextDataScript = $('#__NEXT_DATA__').html();
        if (!nextDataScript) {
            console.error("❌ No #__NEXT_DATA__ found.");
            return;
        }

        const nextData = JSON.parse(nextDataScript);
        console.log("Keys in props.pageProps:", Object.keys(nextData.props.pageProps));

        const doc = nextData.props.pageProps._doc;
        if (doc) {
            console.log("📄 Doc Name:", doc.name);
            console.log("Keys in _doc.data:", Object.keys(doc.data || {}));

            // Check for nodes that look like headings or lists of modules
            if (doc.data.nodes) {
                console.log(`Found ${doc.data.nodes.length} nodes in doc.`);

                // Print first few nodes to see content
                console.log(JSON.stringify(doc.data.nodes.slice(0, 3), null, 2));

                // Check if any text/content mentions "Triggers" or "Actions" or specific module names
                const textContent = JSON.stringify(doc.data.nodes);
                console.log("Contains 'Add a Row'?", textContent.includes("Add a Row"));
                console.log("Contains 'Watch Rows'?", textContent.includes("Watch Rows"));
                console.log("Contains 'Triggers'?", textContent.includes("Triggers"));
                console.log("Contains 'Actions'?", textContent.includes("Actions"));
            }
        }

    } catch (error) {
        console.error("Error:", error);
    }
}
main();
