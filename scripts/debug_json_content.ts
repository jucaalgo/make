
import fs from 'fs/promises';
import path from 'path';

async function main() {
    const file = path.join(process.cwd(), 'db', 'knowledge_base', 'google-drive-modules.json');
    const content = await fs.readFile(file, 'utf-8');
    const doc = JSON.parse(content);

    // Check if doc.data.nodes exists
    if (!doc.data || !doc.data.nodes) {
        console.log("Structure mismatch. Keys:", Object.keys(doc));
        if (doc.data) console.log("Data keys:", Object.keys(doc.data));
        return;
    }

    const nodes = doc.data.nodes;
    console.log(`Analyzing ${nodes.length} nodes.`);

    // Print first 2 nodes fully
    console.log(JSON.stringify(nodes.slice(0, 5), null, 2));
}

main();
