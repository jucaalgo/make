
/**
 * ANTIGRAVITY UNIVERSAL ENGINE TYPES
 * ----------------------------------
 * This file defines the strict data contracts that allow the engine
 * to execute ANY module regardless of its specific logic.
 * 
 * The Core Axiom: "Everything is a Bundle."
 */

// 1. DATA STRUCTURES ( The Atoms )

/**
 * A Bundle is the atomic unit of data in the system.
 * It represents a single "record" (e.g. one Row, one Email, one File).
 * Equivalent to Make.com's Bundle.
 */
export type Bundle<T = Record<string, any>> = T;

/**
 * A Collection is a structured object typically found inside a Bundle.
 * e.g. Bundle = { id: 1, data: Collection }
 */
export type Collection = Record<string, any>;

/**
 * Context passed to every module execution.
 * Contains the "Memory" of the entire flow.
 */
export interface ExecutionContext {
    scenarioId: string;
    executionId: string;
    // The Input Data available from ALL previous modules
    // Keys are NodeIDs. Values are the OUTPUT Bundles of that node.
    scope: Record<string, Bundle[]>;
    // Global variables accessible by Set/Get Variable tools
    globals: Record<string, any>;
    // Logger interface
    logger: (level: 'info' | 'warn' | 'error', msg: string, data?: any) => void;
}

// 2. MODULE CONTRACT ( The Universal Interface )

/**
 * Every module in the system (Sheets, Telegram, AI...) MUST implement this interface.
 * This guarantees that the Engine can run "Anything" as long as it respects this contract.
 */
export interface IModuleShim {
    /**
     * The Universal Execute Function.
     * @param inputBundles - The data flowing INTO this node (e.g. 5 emails)
     * @param config - The user's static configuration for this node (e.g. spreadsheetId)
     * @param context - The global State/Memory
     * 
     * @returns A Promise resolving to the OUTPUT Bundles (e.g. 5 replies)
     */
    execute(
        inputBundles: Bundle[],
        config: any,
        context: ExecutionContext
    ): Promise<Bundle[]>;

    /**
     * Metadata describing the module capabilities (extracted from Registry)
     */
    metadata: {
        name: string; // e.g. "google-sheets:addRow"
        app: string;
        label: string;
    }
}

// 3. FLOW CONTROL ( The Traffic Cops )

/**
 * Result of a single node execution step.
 */
export interface StepResult {
    nodeId: string;
    status: 'success' | 'error' | 'ignored';
    outputBundles: Bundle[]; // This is what goes into the Scope[NodeId]
    metrics: {
        durationMs: number;
        inputCount: number;
        outputCount: number;
    }
    error?: Error;
}
