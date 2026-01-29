
import { useState, useEffect } from 'react';
import registry from './data/module_registry.json'; // Debug Import
import { supabase, APP_ID } from './lib/supabase';
import { Canvas } from './components/Canvas';
import { BottomDock } from './components/BottomDock';
import { AddAppPanel } from './components/AddAppPanel';
import { NodeInspector } from './components/NodeInspector';
import { AIPromptBar } from './components/AIPromptBar'; // Import AI Bar
import { useGraphStore } from './store/useGraphStore';
import { useShallow } from 'zustand/react/shallow';

function App() {
    // DIAGNOSTIC LOG
    console.log("🔥 ROOT APP REGISTRY COUNT:", Object.keys(registry).length);

    const { nodes } = useGraphStore(useShallow(s => ({ nodes: s.nodes })));

    // --- LOGGING TELEMETRY (Unified) ---
    useEffect(() => {
        // Simple telemetry, no blocking
        const recordVisit = async () => {
            // ... existing telemetry code ...
        };
        recordVisit();
    }, []);

    const handleRun = async () => {
        console.log("Starting Execution Engine...");
        const { GraphRunner } = await import('./lib/engine/GraphRunner');
        const runner = new GraphRunner(nodes, useGraphStore.getState().edges);
        await runner.execute((result) => {
            console.log("Step:", result);
            useGraphStore.getState().updateNodeData(result.nodeId, {
                badge: result.status === 'pending' ? '...' : result.status === 'success' ? '✓' : 'X',
            });
        });
        alert("Execution Complete!");
    };

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans">
            {/* Header / Brand (Minimal) - Updated Color for Light Mode */}
            <div className="absolute top-6 left-8 z-50 flex items-center gap-3 pointer-events-none select-none">
                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg shadow-slate-900/10">
                    <span className="text-white font-bold text-xl">IA</span>
                </div>
                <div>
                    <h1 className="font-bold text-slate-800 text-lg leading-tight">Ingeniero de Automatizaciones</h1>
                    <p className="text-xs text-slate-500 font-medium">Creado por Juan Carlos Alvarado</p>
                </div>
            </div>

            {/* Main Canvas Area */}
            <main className="flex-1 relative h-full bg-grid-pattern">
                {/* Canvas Background with Grid Pattern */}
                <Canvas />

                {/* New AI Interface */}
                <AIPromptBar />

                {/* Legacy Controls (Keep for manual editing) */}
                <NodeInspector />
                <AddAppPanel />
                <BottomDock onRun={handleRun} />
            </main>
        </div>
    )
}

export default App
