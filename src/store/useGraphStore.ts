import { create } from 'zustand';
import {
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
} from '@xyflow/react';
import type {
    Connection,
    EdgeChange,
    NodeChange,
} from '@xyflow/react';
import type { AntigravityNode, AntigravityEdge, RegistryModule } from '../types/graph';
import { v4 as uuidv4 } from 'uuid';

// ----------------------------------------------------------------------
// State Definition
// ----------------------------------------------------------------------

interface GraphState {
    // Data
    nodes: AntigravityNode[];
    edges: AntigravityEdge[];

    // UI State
    sidebarOpen: boolean;
    selectedNodeId: string | null;
    themeColor: string;
    isRunning: boolean; // Defaults to purple (#a855f7)

    // Actions
    onNodesChange: (changes: NodeChange[]) => void;
    onEdgesChange: (changes: EdgeChange[]) => void;
    onConnect: (connection: Connection) => void;

    addModule: (module: RegistryModule, position: { x: number, y: number }) => void;
    selectNode: (id: string | null) => void;
    setThemeColor: (color: string) => void;
    setRunning: (isRunning: boolean) => void;
    toggleSidebar: () => void;
    setGraph: (graph: { nodes: AntigravityNode[], edges: AntigravityEdge[] }) => void;
    removeModule: (nodeId: string) => void;
    updateNodeData: (id: string, data: Partial<AntigravityNode['data']>) => void;

    // History (Todo: Implement temporal)
}

// ----------------------------------------------------------------------
// Store Implementation
// ----------------------------------------------------------------------

export const useGraphStore = create<GraphState>((set, get) => ({
    nodes: [],
    edges: [],
    sidebarOpen: true,
    selectedNodeId: null,
    themeColor: '#a855f7',
    isRunning: false,

    onNodesChange: (changes) => {
        set({
            nodes: applyNodeChanges(changes, get().nodes) as AntigravityNode[],
        });
    },

    onEdgesChange: (changes) => {
        set({
            edges: applyEdgeChanges(changes, get().edges) as AntigravityEdge[],
        });
    },

    onConnect: (connection) => {
        // Smart Edge logic would go here
        const edge: AntigravityEdge = {
            ...connection,
            id: uuidv4(),
            type: 'smart', // We will build this custom edge
            data: { isSmart: true }
        };
        set({
            edges: addEdge(edge, get().edges) as AntigravityEdge[],
        });
    },

    addModule: (module, position) => {
        const newNode: AntigravityNode = {
            id: uuidv4(),
            type: 'richNode', // Our V2 Component
            position,
            data: {
                label: module.label,
                app: module.app,
                module: module.name,
                isValid: false,
                isConfigured: false,
                config: {}
            },
        };

        set((state) => ({
            nodes: [...state.nodes, newNode],
            selectedNodeId: newNode.id // Auto-select on drop
        }));
    },

    selectNode: (id) => set({ selectedNodeId: id }),

    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

    setGraph: (graph) => set({ nodes: graph.nodes, edges: graph.edges }),
    setThemeColor: (color) => set({ themeColor: color }),
    setRunning: (isRunning) => set({ isRunning }),

    removeModule: (nodeId) => {
        set((state) => ({
            nodes: state.nodes.filter((node) => node.id !== nodeId),
            edges: state.edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
            selectedNodeId: state.selectedNodeId === nodeId ? null : state.selectedNodeId
        }));
    },

    updateNodeData: (id, data) => {
        set((state) => ({
            nodes: state.nodes.map((node) => {
                if (node.id === id) {
                    return { ...node, data: { ...node.data, ...data } };
                }
                return node;
            })
        }));
    },
}));
