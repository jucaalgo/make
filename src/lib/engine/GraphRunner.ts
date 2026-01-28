import type { AntigravityNode, AntigravityEdge } from '../../types/graph';

export interface ExecutionResult {
    nodeId: string;
    status: 'success' | 'error' | 'pending';
    output?: any;
    error?: string;
    timestamp: number;
}

export class GraphRunner {
    private nodes: AntigravityNode[];
    private edges: AntigravityEdge[];

    constructor(nodes: AntigravityNode[], edges: AntigravityEdge[]) {
        this.nodes = nodes;
        this.edges = edges;
    }

    /**
     * Topologically sorts the graph to determine execution order.
     * Simplified for DAGs (Directed Acyclic Graphs).
     */
    private planExecutionOrder(): AntigravityNode[] {
        const adjacency = new Map<string, string[]>();
        const inDegree = new Map<string, number>();

        // Initialize
        this.nodes.forEach(n => {
            adjacency.set(n.id, []);
            inDegree.set(n.id, 0);
        });

        // Build Graph
        this.edges.forEach(edge => {
            const source = edge.source;
            const target = edge.target;

            if (adjacency.has(source) && adjacency.has(target)) {
                adjacency.get(source)?.push(target);
                inDegree.set(target, (inDegree.get(target) || 0) + 1);
            }
        });

        // Kahn's Algorithm
        const queue: string[] = [];
        inDegree.forEach((degree, id) => {
            if (degree === 0) queue.push(id);
        });

        const sorted: AntigravityNode[] = [];

        while (queue.length > 0) {
            const currentId = queue.shift()!;
            const node = this.nodes.find(n => n.id === currentId);
            if (node) sorted.push(node);

            const neighbors = adjacency.get(currentId) || [];
            neighbors.forEach(neighbor => {
                inDegree.set(neighbor, (inDegree.get(neighbor) || 0) - 1);
                if (inDegree.get(neighbor) === 0) {
                    queue.push(neighbor);
                }
            });
        }

        // Cycle detection? If sorted.length !== nodes.length, there's a cycle.
        // For now, we assume DAG or just run what we found.
        return sorted;
    }

    /**
     * Executes the graph step-by-step.
     * Returns a generator or promise for UI feedback.
     */
    async execute(onStep: (result: ExecutionResult) => void) {
        const executionPlan = this.planExecutionOrder();
        const context: Record<string, any> = {}; // Data passing context

        for (const node of executionPlan) {
            // Signal Start
            onStep({ nodeId: node.id, status: 'pending', timestamp: Date.now() });

            try {
                // SIMULATE EXECUTION DELAY
                await new Promise(resolve => setTimeout(resolve, 1000));

                // ACTUAL LOGIC WOULD GO HERE (API CALL / SKILL TRIGGER)
                console.log(`Executing Node [${node.data.label}] (${node.data.app})`);

                // Output Context Mock
                const output = { success: true, description: `Processed by ${node.data.app}` };
                context[node.id] = output;

                onStep({
                    nodeId: node.id,
                    status: 'success',
                    output,
                    timestamp: Date.now()
                });

            } catch (error) {
                onStep({
                    nodeId: node.id,
                    status: 'error',
                    error: String(error),
                    timestamp: Date.now()
                });
                break; // Stop on error
            }
        }
    }
}
