
import fs from 'fs/promises';
import path from 'path';

function extractText(node: any): string {
    if (!node) return "";
    if (typeof node === 'string') return node;
    if (node.text) return node.text;

    let text = "";
    if (node.children && Array.isArray(node.children)) {
        node.children.forEach((c: any) => {
            text += extractText(c);
        });
    }
    return text;
}

async function main() {
    const file = path.join(process.cwd(), 'db', 'knowledge_base', 'google-drive-modules.json');
    const content = await fs.readFile(file, 'utf-8');
    const doc = JSON.parse(content);
    const nodes = doc.data.nodes;

    for (let i = 0; i < nodes.length; i++) {
        const text = extractText(nodes[i]);
        if (text.includes('Watch Files')) {
            console.log(`FOUND at index ${i}`);
            console.log(`Type: ${nodes[i].type}`);
            console.log(JSON.stringify(nodes[i], null, 2));
        }
    }
}

main();
