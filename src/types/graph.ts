import type { Node, Edge } from '@xyflow/react';
import type { RegistryMapper, RegistrySchema } from './registry';

// ----------------------------------------------------------------------
// 1. Data Models (The Source of Truth)
// ----------------------------------------------------------------------

export type AppId = string; // e.g., "google-sheets", "slack"
export type ModuleId = string; // e.g., "google-sheets:watchRows"

export interface RegistryModule {
    name: ModuleId;
    label: string;
    app: AppId;
    description: string;
    parameters: RegistrySchema;
    mapper: RegistryMapper;
}

// ----------------------------------------------------------------------
// 2. Graph Models (The State)
// ----------------------------------------------------------------------

export interface AntigravityNodeData extends Record<string, unknown> {
    // Core
    label: string;
    app: AppId;
    module: ModuleId;

    // State
    isValid: boolean;
    isConfigured: boolean;

    // Configuration Values (The actual user inputs)
    config: Record<string, string | number | boolean>;
}

export type AntigravityNode = Node<AntigravityNodeData>;

export interface AntigravityEdgeData extends Record<string, unknown> {
    // Logic
    isSmart: boolean; // True if auto-connected
}

export type AntigravityEdge = Edge<AntigravityEdgeData>;

// ----------------------------------------------------------------------
// 3. User Actions
// ----------------------------------------------------------------------

export interface GraphHistory {
    past: { nodes: AntigravityNode[]; edges: AntigravityEdge[] }[];
    future: { nodes: AntigravityNode[]; edges: AntigravityEdge[] }[];
}
