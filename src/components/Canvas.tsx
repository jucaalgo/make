import { useCallback } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    BackgroundVariant,
    ReactFlowProvider,
} from '@xyflow/react';
import type { NodeTypes } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useGraphStore } from '../store/useGraphStore';
import { useShallow } from 'zustand/react/shallow';
import MakeNode from './MakeNode'; // Updated to MakeNode
import type { RegistryModule } from '../types/graph';
import { SmartEdge } from './edges/SmartEdge';

const nodeTypes: NodeTypes = {
    richNode: MakeNode, // Mapping 'richNode' type to MakeNode component for store compatibility
};

const edgeTypes = {
    smart: SmartEdge,
};

function CanvasContent() {
    const {
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        onConnect,
        addModule
    } = useGraphStore(useShallow((state) => ({
        nodes: state.nodes,
        edges: state.edges,
        onNodesChange: state.onNodesChange,
        onEdgesChange: state.onEdgesChange,
        onConnect: state.onConnect,
        addModule: state.addModule
    })));

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            const moduleDataStr = event.dataTransfer.getData('application/antigravity-module');
            if (!moduleDataStr) return;

            const module: RegistryModule = JSON.parse(moduleDataStr);

            const position = {
                x: event.clientX - 50,
                y: event.clientY - 50,
            };

            addModule(module, position);
        },
        [addModule]
    );

    return (
        <div className="w-full h-full bg-slate-50">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                onDragOver={onDragOver}
                onDrop={onDrop}
                fitView
                className="antigravity-flow"
                defaultEdgeOptions={{
                    type: 'smart',
                    animated: true,
                    style: { stroke: '#94a3b8', strokeWidth: 2, strokeDasharray: '5 5' }
                }}
                minZoom={0.2}
                proOptions={{ hideAttribution: true }}
            >
                <Background
                    variant={BackgroundVariant.Dots}
                    gap={24}
                    size={2}
                    color="#cbd5e1"
                />
                <Controls className="!bg-white !border-slate-200 !fill-slate-600 shadow-lg !m-4" />
            </ReactFlow>
        </div>
    );
}

export const Canvas = () => {
    return (
        <ReactFlowProvider>
            <CanvasContent />
        </ReactFlowProvider>
    );
};
