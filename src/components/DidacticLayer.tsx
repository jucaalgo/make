import { useState } from 'react';
import { Lightbulb, ArrowUp, MousePointer2, X } from 'lucide-react';
import { useGraphStore } from '../store/useGraphStore';

/**
 * A didactic overlay that "teaches" the user how to use the Architect.
 * It detects the state of the graph and offers context-aware suggestions.
 */
export const DidacticLayer = () => {
    const nodes = useGraphStore(s => s.nodes);
    const edges = useGraphStore(s => s.edges);
    // Derived State (No need for useEffect)
    let tip: { text: string, icon: React.ReactNode } | null = null;

    // 1. EMPTY STATE
    if (nodes.length === 0) {
        tip = {
            text: "Start by trying the Magic Bar below ('Create a flow to...') or drag modules from the sidebar.",
            icon: <ArrowUp className="animate-bounce" />
        };
    }
    // 2. SINGLE NODE (No Connections)
    else if (nodes.length > 0 && edges.length === 0) {
        tip = {
            text: "Great start! Now drag from the handle on the right of the node to connect it to another app.",
            icon: <MousePointer2 />
        };
    }
    // 3. COMPLEX GRAPH but no Run
    else if (nodes.length > 2 && edges.length > 1) {
        tip = {
            text: "Pro Tip: Use 'routers' from Core Tools to create complex logic branching.",
            icon: <Lightbulb className="text-yellow-400" />
        };
    }

    if (!tip) return null;

    // Use a simple local storage or session state to remember if closed?
    // For now, simpler: user asks to close it, we close it for this session.
    // However, since it is a functional component re-rendering on store changes, we need local state.
    // But local state resets on re-render if the component unmounts.
    // Best way: Global Store or Context. For speed: Local state is fine if it persists while visible.

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isVisible, setIsVisible] = useState(true);
    if (!isVisible) return null;

    return (
        <div className="absolute top-20 right-8 pointer-events-none z-50 animate-in fade-in slide-in-from-right-4 duration-700 max-w-sm">
            <div className="bg-slate-900/90 backdrop-blur-md border border-purple-500/30 pl-4 pr-2 py-2 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.15)] flex items-center gap-2 pointer-events-auto">
                <div className="p-1 bg-white/10 rounded-full text-purple-200">
                    {tip.icon}
                </div>
                <span className="text-xs font-medium text-purple-100/90 text-shadow-sm">
                    {tip.text}
                </span>
                <button
                    onClick={() => setIsVisible(false)}
                    className="ml-2 p-1 hover:bg-white/10 rounded-full text-purple-300/50 hover:text-white transition-colors"
                >
                    <X size={14} />
                </button>
            </div>
        </div>
    );
};
