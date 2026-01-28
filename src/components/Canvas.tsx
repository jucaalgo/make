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
import { RichNode } from './nodes/RichNode';
import type { RegistryModule } from '../types/graph';
import { SmartEdge } from './edges/SmartEdge';

import { ContextMenu } from './ui/ContextMenu';
import { FloatingToolbar } from './ui/FloatingToolbar';
import { useSonic } from '../hooks/useSonic';
import { useState, useRef } from 'react';

const nodeTypes: NodeTypes = {
    richNode: RichNode,
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

            // Project coordinates (simplified for now, ideally use useReactFlow().project)
            // Need access to React Flow instance for true projection
            const position = {
                x: event.clientX - 300, // Offset for sidebar approx
                y: event.clientY - 50,
            };

            addModule(module, position);
        },
        [addModule]
    );

    const { playConnect } = useSonic();

    // 3D Tilt Logic
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY, currentTarget } = e;
        const { width, height } = currentTarget.getBoundingClientRect();

        // Normalize -1 to 1
        const x = (clientX / width) * 2 - 1;
        const y = (clientY / height) * 2 - 1;

        // Max tilt 5 deg, inverted for "looking into" effect
        setTilt({ x: y * 5, y: -x * 5 });
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleConnect = useCallback((connection: any) => {
        playConnect(); // SONIC UI
        onConnect(connection);
    }, [onConnect, playConnect]);

    // Context Menu State
    const [menu, setMenu] = useState<{ top?: number, left?: number, bottom?: number, right?: number, position?: { x: number, y: number } } | null>(null);
    const flowRef = useRef<HTMLDivElement>(null);

    const onContextMenu = useCallback(
        (event: React.MouseEvent) => {
            event.preventDefault();

            // Calculate position relative to container for Flow projection? 
            // Or just use screen coords for the menu, and project for the node placement.
            // For node placement we need flow coords.
            // Typically: reactFlowInstance.project({ x: event.clientX, y: event.clientY })
            // But we don't have the instance easily here without `useReactFlow` hook inside a child or context.
            // Oh wait, `CanvasContent` is inside `ReactFlowProvider` so we can use `useReactFlow`.
            // Let's add that hook usage.

            const pane = flowRef.current?.getBoundingClientRect();
            if (!pane) return;

            setMenu({
                top: event.clientY < pane.height - 200 ? event.clientY : undefined,
                left: event.clientX < pane.width - 200 ? event.clientX : undefined,
                bottom: event.clientY >= pane.height - 200 ? pane.height - event.clientY : undefined,
                right: event.clientX >= pane.width - 200 ? pane.width - event.clientX : undefined,
                // We will defer projection to the menu's action or just do rough calc here
                position: { x: event.clientX - pane.left - 50, y: event.clientY - pane.top - 50 }
            });
        },
        [setMenu]
    );

    const onPaneClick = useCallback(() => setMenu(null), [setMenu]);

    return (
        <div
            ref={flowRef}
            className="w-full h-full bg-slate-50 perspective-[1000px] overflow-hidden"
            onMouseMove={handleMouseMove}
            onContextMenu={onContextMenu}
        >
            {/* 3D Transform Container */}
            <div
                className="w-full h-full transition-transform duration-75 ease-out will-change-transform"
                style={{
                    transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.02)`
                }}
            >
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={handleConnect}
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                    onDragOver={onDragOver}
                    onDrop={onDrop}
                    onPaneClick={onPaneClick}
                    onNodesDelete={(nodes) => {
                        nodes.forEach(n => useGraphStore.getState().removeModule(n.id));
                    }}
                    fitView
                    className="antigravity-flow"
                    defaultEdgeOptions={{
                        type: 'smart',
                        animated: true,
                        style: { stroke: '#94a3b8', strokeWidth: 2 }
                    }}
                    minZoom={0.1}
                    proOptions={{ hideAttribution: true }}
                >
                    <Background
                        variant={BackgroundVariant.Dots}
                        gap={20}
                        size={1}
                        color="#cbd5e1"
                    />
                    <Controls className="!bg-white !border-slate-200 !fill-slate-600 shadow-lg" />
                </ReactFlow>
            </div>

            {/* Context Menu Layer */}
            {menu && <ContextMenu {...menu as any} onClose={() => setMenu(null)} />}

            {/* Floating Toolbar */}
            <FloatingToolbar />

            {/* Vignette */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.05)_100%)] z-50 mix-blend-multiply" />
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
