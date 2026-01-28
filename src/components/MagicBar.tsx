import { useState } from 'react';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { useGraphStore } from '../store/useGraphStore';
import { SmartBlueprinter } from '../lib/SmartBlueprinter';
import { useSonic } from '../hooks/useSonic';

export const MagicBar = () => {
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const setGraph = useGraphStore(s => s.setGraph);
    const { playGenerate } = useSonic();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        setIsGenerating(true);
        playGenerate(); // SONIC MAGIC

        // Artificial "Reasoning" Delay to feel like premium AI
        await new Promise(resolve => setTimeout(resolve, 800));

        if (prompt.trim() === '/clear') {
            setGraph({ nodes: [], edges: [] });
            setPrompt('');
            setIsGenerating(false);
            return;
        }

        // STRESS TEST COMMAND
        if (prompt.trim() === '/stress') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const stressNodes: any[] = [];
            for (let i = 0; i < 50; i++) {
                stressNodes.push({
                    id: `stress-${i}`,
                    type: 'richNode',
                    position: { x: (i % 10) * 300, y: Math.floor(i / 10) * 150 },
                    data: {
                        label: `Stress Node ${i}`,
                        app: i % 2 === 0 ? 'google-sheets' : 'slack',
                        module: 'test:module',
                        description: 'Load Test Node',
                        isValid: true,
                        isConfigured: true,
                        config: {}
                    }
                });
            }
            setGraph({ nodes: stressNodes, edges: [] });
            setPrompt('');
            setIsGenerating(false);
            return;
        }

        // Use the new Smart Engine
        const { nodes: newNodes, edges: newEdges } = SmartBlueprinter.generate(prompt);

        if (newNodes.length > 0) {
            setGraph({
                nodes: newNodes,
                edges: newEdges
            });
            setPrompt('');
        }

        setIsGenerating(false);
    };

    return (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 px-4">
            <form
                onSubmit={handleSubmit}
                className={clsx(
                    "relative flex items-center gap-3 p-2 rounded-2xl border transition-all duration-300",
                    "bg-slate-900/90 backdrop-blur-xl border-purple-500/30 shadow-[0_0_50px_-10px_rgba(168,85,247,0.3)]",
                    "focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500/50 focus-within:scale-105"
                )}
            >
                <div className="pl-3 text-purple-400 animate-pulse">
                    <Sparkles size={24} />
                </div>

                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe your automation (e.g., 'Save Gmail attachments to Drive and notify Slack')"
                    className="flex-1 bg-transparent border-none text-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-0 font-light"
                    autoFocus
                />

                <button
                    type="submit"
                    disabled={isGenerating}
                    className="p-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isGenerating ? <Loader2 size={20} className="animate-spin" /> : <ArrowRight size={20} />}
                </button>
            </form>

            <div className="text-center mt-2 text-[10px] text-slate-500 font-mono">
                Press <span className="text-slate-400">Enter</span> to generate blueprint
            </div>
        </div>
    );
};
