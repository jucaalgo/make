import { useState } from 'react';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { useGraphStore } from '../store/useGraphStore';
import { SmartBlueprinter } from '../lib/SmartBlueprinter';

export const MagicBar = () => {
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const setGraph = useGraphStore(s => s.setGraph);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        setIsGenerating(true);

        // Artificial "Thinking" Delay
        await new Promise(resolve => setTimeout(resolve, 800));

        if (prompt.trim() === '/clear') {
            setGraph({ nodes: [], edges: [] });
            setPrompt('');
            setIsGenerating(false);
            return;
        }

        try {
            // Use the Smart Engine to generate nodes
            const { nodes: newNodes, edges: newEdges } = SmartBlueprinter.generate(prompt);

            if (newNodes.length > 0) {
                setGraph({
                    nodes: newNodes,
                    edges: newEdges
                });
                setPrompt('');
            }
        } catch (e) {
            console.error("Blueprint generation failed:", e);
        }

        setIsGenerating(false);
    };

    return (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-full max-w-xl z-40 px-4">
            <form
                onSubmit={handleSubmit}
                className={clsx(
                    "relative flex items-center gap-3 p-2 rounded-full border transition-all duration-300 group",
                    "bg-white/80 backdrop-blur-xl border-purple-200 shadow-xl shadow-purple-500/10",
                    "focus-within:border-purple-500 focus-within:ring-4 focus-within:ring-purple-500/10 focus-within:scale-105"
                )}
            >
                <div className="pl-3 text-make-purple animate-pulse">
                    <Sparkles size={20} />
                </div>

                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ask AI to build a workflow (e.g., 'Instagram to Sheets')"
                    className="flex-1 bg-transparent border-none text-base text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-0 font-medium"
                />

                <button
                    type="submit"
                    disabled={isGenerating}
                    className="p-2 bg-make-purple hover:bg-purple-700 text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-purple-500/20"
                >
                    {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
                </button>
            </form>
        </div>
    );
};
