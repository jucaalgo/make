import { useState } from 'react';
import { Canvas } from './components/Canvas';
import { Sidebar } from './components/Sidebar';
import { MagicBar } from './components/MagicBar';
import { DidacticLayer } from './components/DidacticLayer';
import { NodeInspector } from './components/NodeInspector';
import { downloadBlueprint } from './lib/export';
import { useGraphStore } from './store/useGraphStore';
import { useShallow } from 'zustand/react/shallow';
import { LoginOverlay } from './components/LoginOverlay';
import { HeroRunButton } from './components/HeroRunButton';

function App() {
    const { nodes } = useGraphStore(useShallow(s => ({ nodes: s.nodes })));
    const themeColor = useGraphStore(state => state.themeColor);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    if (!isAuthenticated) {
        return <LoginOverlay onLogin={() => setIsAuthenticated(true)} />;
    }

    return (
        <div
            className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans selection:bg-purple-500/30"
            style={{
                '--theme-color': themeColor,
                '--theme-color-glow': `${themeColor}40`, // 25% opacity
            } as React.CSSProperties}
        >
            <Sidebar />
            <main className="flex-1 relative h-full">
                <Canvas />
                <MagicBar />
                <NodeInspector />

                {/* Overlay Tools */}
                <div className="absolute top-4 right-4 flex gap-2">
                    <button
                        onClick={() => downloadBlueprint(nodes)}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-purple-900/20 transition-all active:scale-95"
                    >
                        Publish Scenario
                    </button>
                </div>
                <DidacticLayer /> {/* Added DidacticLayer here */}
                <HeroRunButton />
            </main>
        </div>
    )
}

export default App

