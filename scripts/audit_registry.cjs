const fs = require('fs');
const path = require('path');

const registryPath = path.join(__dirname, '../src/data/module_registry.json');
const rawData = fs.readFileSync(registryPath, 'utf8');

// We use a regex based parser to avoid crashing on duplicate keys
// and to detect them
const moduleRegex = /"([^"]+)":\s*{/g;
let match;
const modules = [];
const keys = new Set();
const duplicates = [];

while ((match = moduleRegex.exec(rawData)) !== null) {
    const key = match[1];
    // We only care about top-level keys (modules), roughly check indentation or context if needed
    // But simplified: assume top level keys start the blocks
    if (keys.has(key)) {
        duplicates.push(key);
    } else {
        keys.add(key);
        modules.push(key);
    }
}

// Group by App
const modulesByApp = {};
modules.forEach(mod => {
    const app = mod.split(':')[0];
    if (!modulesByApp[app]) modulesByApp[app] = [];
    modulesByApp[app].push(mod);
});

console.log('--- REGISTRY AUDIT REPORT ---');
console.log(`Total Modules Found: ${modules.length}`);
console.log(`Duplicate Keys Found: ${duplicates.length}`);
if (duplicates.length > 0) {
    console.log('Duplicates:', duplicates);
}

console.log('\n--- MODULES PER APP ---');
Object.entries(modulesByApp).forEach(([app, mods]) => {
    console.log(`${app}: ${mods.length} modules`);
    // List them if count is low (< 10) to easily spot gaps
    if (mods.length < 15) {
        mods.forEach(m => console.log(`  - ${m}`));
    }
});
