import type { AntigravityNode } from '../types/graph';


export const generateMakeBlueprint = (nodes: AntigravityNode[]) => {
    // 1. Identify Flow
    // Naive approach: Find start node (usually webhook) or just dump all
    // Make requires a "flow" array where items are linked by "next" property logic (which resides in the router or simply order)

    // For MVP V2, we generate a valid JSON structure wrapping our nodes

    const modules = nodes.map((node, index) => {
        return {
            id: index + 1, // Make uses integer IDs usually starting 1
            uuid: node.id, // Keep our UUID for ref
            module: node.data.module,
            version: 1,
            parameters: node.data.config || {},
            mapper: {}, // Inputs mapped from previous steps
            metadata: {
                designer: {
                    x: Math.round(node.position.x),
                    y: Math.round(node.position.y)
                }
            }
        };
    });

    const blueprint = {
        name: "Antigravity V2 Export",
        flow: modules,
        metadata: {
            version: 1,
            scenario: {
                roundtrip: false,
                maxErrors: 3,
                autoCommit: true,
                sequential: false,
                confidential: false
            },
            designer: {
                orphans: []
            },
            zone: "eu1.make.com" // Default to EU
        }
    };

    return JSON.stringify(blueprint, null, 2);
};

export const downloadBlueprint = (nodes: AntigravityNode[]) => {
    const json = generateMakeBlueprint(nodes);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `blueprint-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};
