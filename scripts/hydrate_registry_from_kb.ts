
import fs from 'fs/promises';
import path from 'path';

// Types adapted from the project
interface RegistryParam {
    type: string;
    label: string;
    required?: boolean;
    options?: string[];
    default?: any;
    rpc?: {
        label: string;
        method: string;
        parameters: string[];
    };
}

interface RegistryModule {
    name: string;      // e.g. google-drive:watch-files
    app: string;       // e.g. google-drive
    label: string;     // e.g. Watch Files
    description?: string;
    parameters: Record<string, RegistryParam>;
    mapper?: Record<string, string>; // Default mappings
    configuration?: {
        requireAppConnection: boolean;
    };
}

// Helper for deep text extraction
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
    console.log("💧 Hydrating Registry from Knowledge Base (Precision Mode)...");

    const kbDir = path.join(process.cwd(), 'db', 'knowledge_base');
    const registryPath = path.join(process.cwd(), 'src', 'data', 'module_registry.json');

    // 1. Load existing registry
    const registryRaw = await fs.readFile(registryPath, 'utf-8');
    const registry: Record<string, RegistryModule> = JSON.parse(registryRaw);

    const initialSize = Object.keys(registry).length;
    console.log(`Current Registry Size: ${initialSize} modules.`);

    // 2. Iterate KB files
    const files = await fs.readdir(kbDir);
    let addedCount = 0;

    for (const file of files) {
        if (!file.endsWith('.json')) continue;

        try {
            const content = await fs.readFile(path.join(kbDir, file), 'utf-8');
            const doc = JSON.parse(content);
            const appSlug = file.replace('.json', '').replace('-modules', '');

            // Process "nodes" in the doc
            const nodes = doc.data?.nodes || [];

            let currentModule: Partial<RegistryModule> | null = null;

            for (let i = 0; i < nodes.length; i++) {
                const node = nodes[i];

                // Identify Module Header
                if (node.type === 'h2' || node.type === 'h3' || node.type === 'expandable-heading2' || node.type === 'expandable-heading3') {

                    let titleNode = node;
                    // For expandable headings, the FIRST child is usually the title trigger wrapper
                    // We grab text ONLY from the first child to avoid grabbing the whole body.
                    if (node.type.startsWith('expandable-')) {
                        titleNode = node.children?.[0];
                    }

                    const text = extractText(titleNode).trim();

                    // Keywords
                    const hasKeyword = ['Watch', 'Create', 'Update', 'Delete', 'Search', 'Get', 'Make', 'Upload', 'Download', 'List'].some(k => text.includes(k));

                    // Extra safety: Label shouldn't be too long
                    if (hasKeyword && text.length < 80 && text.length > 3) {
                        // Valid Module Found

                        // Save previous
                        if (currentModule && currentModule.name) {
                            if (!registry[currentModule.name]) {
                                registry[currentModule.name] = currentModule as RegistryModule;
                                addedCount++;
                            } else {
                                // Overwrite works too
                                registry[currentModule.name] = currentModule as RegistryModule;
                            }
                        }

                        const moduleLabel = text;
                        const safeLabel = moduleLabel.replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-').toLowerCase(); // Stricter safe label

                        const uniqueName = `${appSlug}:${safeLabel}`;

                        currentModule = {
                            name: uniqueName,
                            app: appSlug,
                            label: moduleLabel,
                            parameters: {
                                "__IMTCONN__": {
                                    type: "connection",
                                    label: "Connection",
                                    required: true
                                }
                            },
                            configuration: {
                                requireAppConnection: true
                            }
                        };
                    }
                }

                // Identify Parameters Table
                // If the table is INSIDE the expandable node, `nodes` loop won't see it?
                // WAIT. If I am only looking at `doc.data.nodes`, and `expandable-heading` contains children...
                // ... then the TABLE is likely a CHILD of the expandable heading!
                // My loop iterates `nodes`. It does NOT recurse into 'expandable-heading' children to find tables.
                // THIS IS WHY I MISSED PARAMETERS too.

                // I need to traverse the children of the current module node to find tables.
                // But my `currentModule` logic assumes flat list.

                // Quick Fix: Look for parameters inside `node` if it was a module header
                if (currentModule && node.type.startsWith('expandable-')) {
                    // Traverse children to find table
                    const findTable = (n: any) => {
                        if (n.type === 'table') processTable(n);
                        if (n.children) n.children.forEach(findTable);
                    }
                    findTable(node);
                } else if (currentModule && node.type === 'table') {
                    processTable(node);
                }
            }

            function processTable(tableNode: any) {
                if (!currentModule) return;
                const rows = tableNode.children || [];
                for (const row of rows) {
                    const cells = row.children || [];
                    if (cells.length >= 2) {
                        let label = extractText(cells[0]).trim();
                        if (label.toLowerCase() === 'field') continue;
                        const key = label.toLowerCase().replace(/[^a-z0-9]/g, '_');
                        if (key && key.length > 0) {
                            currentModule.parameters = currentModule.parameters || {};
                            currentModule.parameters[key] = {
                                type: 'string', // Default
                                label: label,
                                required: false
                            };
                        }
                    }
                }
            }

            // Save last module
            if (currentModule && currentModule.name) {
                registry[currentModule.name] = currentModule as RegistryModule;
                addedCount++;
            }

        } catch (e) {
            console.error(`Failed to parse ${file}:`, e);
        }
    }

    console.log(`✅ Precision Hydration Complete. Added/Updated ${addedCount} modules.`);
    console.log(`New Registry Size: ${Object.keys(registry).length} modules.`);

    await fs.writeFile(registryPath, JSON.stringify(registry, null, 2));
}

main();
