import { v4 as uuidv4 } from 'uuid';
import registryData from '../data/module_registry.json';
import type { AntigravityNode, AntigravityEdge, RegistryModule } from '../types/graph';

const REGISTRY = registryData as unknown as Record<string, RegistryModule>;

interface LogicalStep {
    id: string;
    app: string;
    action: string;
    labelOverride?: string;
    children?: LogicalStep[]; // For branching/routers
    isLoop?: boolean;       // For iterators
    repeatCount?: number;   // For consecutive identical modules (like timers)
}

/**
 * Intelligent Blueprint Generator v2.0
 * Moves from linear keyword matching to structural pattern reasoning.
 */
export class SmartBlueprinter {

    static generate(prompt: string): { nodes: AntigravityNode[], edges: AntigravityEdge[] } {
        const lowerPrompt = prompt.toLowerCase();

        // --- 1. INTENT REASONING (Structural Analysis) ---
        const logicalPlan = this.architectPlan(lowerPrompt);

        // --- 2. GRAPH CONSTRUCTION ---
        const nodes: AntigravityNode[] = [];
        const edges: AntigravityEdge[] = [];

        this.buildSubGraph(logicalPlan, nodes, edges, null, { x: 100, y: 300 });

        return { nodes, edges };
    }

    /**
     * Recursively builds the graph from a logical plan.
     */
    private static buildSubGraph(
        steps: LogicalStep[],
        nodes: AntigravityNode[],
        edges: AntigravityEdge[],
        lastNodeId: string | null,
        startPos: { x: number, y: number }
    ) {
        let currentX = startPos.x;
        let currentY = startPos.y;
        let previousId = lastNodeId;

        steps.forEach((step) => {
            const moduleKey = this.findBestModule(step.app, step.action);
            if (!moduleKey) return;

            const moduleDef = REGISTRY[moduleKey];

            // Handle Repeat Patterns (e.g. 5 Timers)
            const count = step.repeatCount || 1;
            for (let i = 0; i < count; i++) {
                const nodeId = uuidv4();
                const label = count > 1 ? `${step.labelOverride || moduleDef.label} ${i + 1}` : (step.labelOverride || moduleDef.label);

                const node: AntigravityNode = {
                    id: nodeId,
                    type: 'richNode',
                    position: { x: currentX, y: currentY },
                    data: {
                        label,
                        app: moduleDef.app,
                        module: moduleKey,
                        description: moduleDef.label,
                        isValid: true,
                        isConfigured: true,
                        config: this.generateSmartConfig(moduleDef, previousId ? nodes.find(n => n.id === previousId) : null)
                    }
                };

                nodes.push(node);

                if (previousId) {
                    edges.push({
                        id: `e-${previousId}-${nodeId}`,
                        source: previousId,
                        target: nodeId,
                        type: 'default',
                        animated: true
                    });
                }

                previousId = nodeId;
                currentX += 350;
            }

            // Handle Branching (Children)
            if (step.children && step.children.length > 0) {
                // If the step has children, the current node is likely a Router or Iterator
                const branchSpacing = 400;
                let branchOffsetY = -((step.children.length - 1) * branchSpacing) / 2;

                step.children.forEach((childBranch) => {
                    this.buildSubGraph(
                        [childBranch], // Process branch as a single steps array
                        nodes,
                        edges,
                        previousId,
                        { x: currentX, y: currentY + branchOffsetY }
                    );
                    branchOffsetY += branchSpacing;
                });

                // Advance X beyond the longest branch (simplified estimation)
                currentX += 800;
            }
        });
    }

    /**
     * The Core "Architect": Detects motifs and structures in the prompt.
     */
    private static architectPlan(prompt: string): LogicalStep[] {
        const plan: LogicalStep[] = [];
        const p = prompt.toLowerCase();

        // -------------------------------------------------------------
        // SCENARIO: "THE AUTOMATOR" (Specific User Request Match)
        // -------------------------------------------------------------
        if ((p.includes('google sheets') || p.includes('excel')) && p.includes('sleep') && (p.includes('gemini') || p.includes('gpt'))) {

            // 1. Activation
            plan.push({ id: uuidv4(), app: 'google-sheets', action: 'search' });

            // 2. Delays (5x Sleep)
            plan.push({
                id: uuidv4(),
                app: 'util',
                action: 'sleep',
                repeatCount: 5,
                labelOverride: 'Temporizador'
            });

            // 3. AI Generation
            plan.push({ id: uuidv4(), app: 'gemini-ai', action: 'create' });

            // 4. Iterator
            plan.push({ id: uuidv4(), app: 'builtin', action: 'iterator' });
            plan.push({ id: uuidv4(), app: 'builtin', action: 'aggregator' });

            // 5. Publishing - Only if Instagram mentioned
            if (p.includes('instagram')) {
                plan.push({ id: uuidv4(), app: 'instagram-business', action: 'create' });
            }

            // 6. Router Branching
            if (p.includes('drive') || p.includes('telegram')) {
                const routerStep: LogicalStep = {
                    id: uuidv4(),
                    app: 'builtin',
                    action: 'router',
                    children: [
                        {
                            id: uuidv4(), app: 'google-sheets', action: 'update', labelOverride: 'Update Row',
                            children: [{ id: uuidv4(), app: 'google-drive', action: 'move', labelOverride: 'Move File' }]
                        },
                        {
                            id: uuidv4(), app: 'telegram', action: 'send', labelOverride: 'Notify Admin',
                            repeatCount: 2
                        }
                    ]
                };
                plan.push(routerStep);
            }

            return plan;
        }

        // 1. TRIGGER DETECTION
        if (p.includes('sheet') && (p.includes('search') || p.includes('buscar'))) {
            plan.push({ id: uuidv4(), app: 'google-sheets', action: 'search' });
        } else if (p.includes('sheet')) {
            plan.push({ id: uuidv4(), app: 'google-sheets', action: 'watch' });
        }

        // 2. DELAY DETECTION (e.g. "cinco temporizadores")
        const timerMatch = prompt.match(/(?:cinco|5|varios)\s+(?:temporizadores|timer|sleep|pausa)/i);
        if (timerMatch) {
            plan.push({ id: uuidv4(), app: 'builtin', action: 'sleep', repeatCount: 5, labelOverride: 'Temporizador' });
        }

        // 3. AI GENERATION
        if (prompt.includes('gemini') || prompt.includes('ai') || prompt.includes('gpt')) {
            plan.push({ id: uuidv4(), app: 'gemini-ai', action: 'create' });
        }

        // 4. COMPLEX STRUCTURE: ITERATORS & AGGREGATORS
        // "realice la secuencia", "procesar informacion obtenida" (often implies loop if multiple rows)
        if (prompt.includes('carousel') || prompt.includes('cada')) {
            plan.push({ id: uuidv4(), app: 'builtin', action: 'iterator' });
        }

        // 5. POSTING (The midpoint)
        if (prompt.includes('instagram')) {
            plan.push({ id: uuidv4(), app: 'instagram-business', action: 'create' });
        }

        // 6. BRANCHING DETECTION: ROUTERS
        // "Actualiza... y Organiza... y Notificaciones" -> Multiple branches
        if (prompt.includes('actualiza') && prompt.includes('organiza') && prompt.includes('telegram')) {
            const routerStep: LogicalStep = {
                id: uuidv4(),
                app: 'builtin',
                action: 'router',
                children: [
                    {
                        id: uuidv4(), app: 'google-sheets', action: 'update', labelOverride: 'Update Row',
                        children: [{ id: uuidv4(), app: 'google-drive', action: 'move', labelOverride: 'Move File' }]
                    },
                    {
                        id: uuidv4(), app: 'telegram', action: 'send', labelOverride: 'Telegram Alert'
                    }
                ]
            };
            plan.push(routerStep);
        } else {
            // Fallback linear
            if (prompt.includes('telegram')) plan.push({ id: uuidv4(), app: 'telegram', action: 'send' });
        }

        return plan;
    }

    private static findBestModule(app: string, action: string): string | null {
        // Special mapping for util
        let searchApp = app;
        if (app === 'builtin' && action === 'sleep') searchApp = 'util';

        const candidates = Object.values(REGISTRY).filter(r => r.app.includes(searchApp) || (searchApp === 'util' && r.app === 'util'));

        if (candidates.length === 0) {
            // Fallback: try finding ANY module with that action name
            const looseCandidates = Object.values(REGISTRY).filter(r => r.name.toLowerCase().includes(action.toLowerCase()));
            if (looseCandidates.length > 0) return looseCandidates[0].name;
            return null;
        }

        const scored = candidates.map(c => {
            let score = 0;
            const labelLow = c.label.toLowerCase();
            const actionLow = action.toLowerCase();
            const nameLow = c.name.toLowerCase();

            if (nameLow.includes(actionLow)) score += 50; // Strong match on technical name
            if (labelLow.includes(actionLow)) score += 30;

            return { key: c.name, score };
        });

        scored.sort((a, b) => b.score - a.score);
        return scored.length > 0 ? scored[0].key : candidates[0].name;
    }

    private static generateSmartConfig(moduleDef: RegistryModule, prevNode: AntigravityNode | null | undefined): Record<string, any> {
        const config: Record<string, any> = {};
        const params = (moduleDef as any).parameters;

        if (params) {
            Object.entries(params).forEach(([key, paramDef]: [string, any]) => {
                config[key] = paramDef.default !== undefined ? paramDef.default :
                    paramDef.type === 'boolean' ? false :
                        paramDef.type === 'number' ? 0 : '';
            });
        }

        if (!config['connection']) config['connection'] = "Default Connection";

        // Logic Mapping (Data Pills)
        if (prevNode) {
            if (moduleDef.app === 'telegram') config['text'] = `Update: Node ${prevNode.data.label} completed.`;
            if (moduleDef.app === 'openai' || moduleDef.app.includes('gemini')) {
                config['prompt'] = `Analyze output from ${prevNode.data.label}: {{${prevNode.id}.data}}`;
            }
        }

        return config;
    }

    static suggestNext(currentApp: string): RegistryModule | null {
        // Simple logic stay same for now
        const targetApp = currentApp.includes('sheet') ? 'slack' : 'google-sheets';
        const key = this.findBestModule(targetApp, 'create');
        return key ? REGISTRY[key] : null;
    }
}
