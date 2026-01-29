
import fs from 'fs/promises';

async function main() {
    const raw = await fs.readFile('apps_index.json', 'utf-8');
    const apps = JSON.parse(raw);

    const matches = apps.filter((a: any) => a.slug.toLowerCase().includes('google-sheets'));
    console.log(JSON.stringify(matches, null, 2));
}
main();
