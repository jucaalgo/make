
import { useState } from 'react';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
// import { useGraphStore } from '../store/useGraphStore'; // To be connected

export const AIPromptBar = () => {
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        setIsGenerating(true);

        // TODO: Call SmartBlueprinter here
        console.log("🤖 AI Generating plan for:", prompt);

        // Mock delay
        setTimeout(() => {
            setIsGenerating(false);
            setPrompt('');
            alert("🪄 AI Magic would happen here! (Connected in next step)");
        }, 1500);
    };

    return (
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4">
            <form
                onSubmit={handleGenerate}
                className={clsx(
                    "relative group transition-all duration-300",
                    isGenerating ? "scale-[0.98] opacity-90" : "hover:scale-[1.01]"
                )}
            >
                {/* Glowing Backdrop */}
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />

                {/* Input Container */}
                <div className="relative bg-white rounded-xl shadow-2xl flex items-center p-2 border border-slate-100">

                    {/* Icon */}
                    <div className="w-10 h-10 flex items-center justify-center text-indigo-500 animate-pulse">
                        {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles />}
                    </div>

                    {/* Text Input */}
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Describe your automation (e.g., 'Monitor Gmail and save attachments to Drive')..."
                        className="flex-1 bg-transparent border-none outline-none text-slate-700 placeholder-slate-400 text-lg px-2 font-medium"
                        disabled={isGenerating}
                    />

                    {/* Action Button */}
                    <button
                        type="submit"
                        disabled={!prompt.trim() || isGenerating}
                        className="p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:hover:bg-slate-900 transition-all"
                    >
                        <ArrowRight size={20} />
                    </button>
                </div>
            </form>
        </div>
    );
};
