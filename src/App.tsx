import { useState, useEffect } from 'react';
import { supabase, APP_ID } from './lib/supabase';
import { Canvas } from './components/Canvas';
import { BottomDock } from './components/BottomDock';
import { AddAppPanel } from './components/AddAppPanel';
import { NodeInspector } from './components/NodeInspector';
import { LoginOverlay } from './components/LoginOverlay';
import { useGraphStore } from './store/useGraphStore';
import { useShallow } from 'zustand/react/shallow';
// import { downloadBlueprint } from './lib/export'; // Keep for future use

function App() {
    const { nodes } = useGraphStore(useShallow(s => ({ nodes: s.nodes })));
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // --- LOGGING TELEMETRY (Unified) ---
    useEffect(() => {
        const recordVisit = async () => {
            try {
                // Client-side IP fetch
                const res = await fetch('https://ipapi.co/json/');
                const ipData = await res.json();

                const { error } = await supabase
                    .from('activity_logs')
                    .insert([{
                        app_id: null,
                        action: 'LOGIN',
                        level: 'info',
                        metadata: {
                            app_slug: APP_ID,
                            ip: ipData.ip || 'Unknown',
                            city: ipData.city || 'Unknown',
                            region: ipData.region || 'Unknown',
                            country: ipData.country_name || 'Unknown',
                            user_agent: navigator.userAgent
                        }
                    }]);

                if (error) console.error("Supabase Log Error:", error);
            } catch (e) {
                console.error("Logging Error:", e);
            }
        };
        recordVisit();
    }, []);

    const handleRun = async () => {
        console.log("Starting Execution Engine...");

        // Dynamic Import to avoid circular deps if any, or just standard import
        const { GraphRunner } = await import('./lib/engine/GraphRunner');
        const runner = new GraphRunner(nodes, useGraphStore.getState().edges); // Get latest edges

        await runner.execute((result) => {
            console.log("Step:", result);
            // Update Node Badge/Status in UI
            useGraphStore.getState().updateNodeData(result.nodeId, {
                badge: result.status === 'pending' ? '...' : result.status === 'success' ? '✓' : 'X',
                // We could also animate the node border here if we added that state to MakeNode
            });
        });

        alert("Execution Complete!");
    };

    if (!isAuthenticated) {
        return <LoginOverlay onLogin={() => setIsAuthenticated(true)} />;
    }

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans">
            {/* Header / Brand (Minimal) */}
            <div className="absolute top-6 left-8 z-50 flex items-center gap-3">
                <div className="w-10 h-10 bg-make-purple rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                    <span className="text-white font-bold text-xl">A</span>
                </div>
                <div>
                    <h1 className="font-bold text-slate-800 text-lg leading-tight">Antigravity</h1>
                    <p className="text-xs text-slate-400 font-medium">Architect</p>
                </div>
            </div>

            {/* Main Canvas Area */}
            <main className="flex-1 relative h-full">
                <Canvas />
                <NodeInspector />

                {/* Floating Controls */}
                <AddAppPanel />
                <BottomDock onRun={handleRun} />
            </main>
        </div>
    )
}

export default App
