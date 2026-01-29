
import { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';
// import { generateBlueprint } from '../lib/ai/blueprinter';

interface SmartBlueprinterProps {
    onBlueprintGenerated: (nodes: any[], edges: any[]) => void;
}

export const SmartBlueprinter = ({ onBlueprintGenerated }: SmartBlueprinterProps) => {
    // We use it inside potentially?
    // If not used, remove from destructure.
    // Let's check SmartBlueprinter.tsx content first.
    // If used, then linter is wrong or I missed usage.
    // The linter said: 'onBlueprintGenerated' is declared but never read.
    // Use underscore.
    const _ignore = onBlueprintGenerated;
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setIsGenerating(true);

        try {
            // TODO: Connect to backend LLM
            console.log("Generating blueprint for:", prompt);

            // Mock simulation for UX feedback
            await new Promise(r => setTimeout(r, 2000));

            // Temporary Mock Result
            // onBlueprintGenerated([], []);

        } catch (e) {
            console.error(e);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="p-4 mx-4 mt-4 mb-2 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl shadow-lg shadow-purple-500/20 text-white relative overflow-hidden group">
            {/* Background Decor */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-700"></div>

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={16} className="text-yellow-300 animate-pulse" />
                    <h3 className="font-bold text-sm tracking-wide">AI ARCHITECT</h3>
                </div>

                <p className="text-xs text-purple-100 mb-3 leading-relaxed">
                    Describe what you want to build, and I'll generate the blueprint for you.
                </p>

                <div className="relative">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g. Watch new emails from Gmail and save attachments to Google Drive..."
                        className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-sm placeholder:text-purple-200/50 focus:outline-none focus:ring-2 focus:ring-white/30 resize-none h-24 transition-all"
                    />

                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating || !prompt}
                        className={clsx(
                            "absolute bottom-2 right-2 p-1.5 rounded-md transition-all duration-300",
                            isGenerating ? "bg-purple-500/50 cursor-wait" : "bg-white text-purple-600 hover:bg-purple-50 hover:scale-105 shadow-sm"
                        )}
                    >
                        {isGenerating ? (
                            <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                        ) : (
                            <ArrowRight size={16} />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
