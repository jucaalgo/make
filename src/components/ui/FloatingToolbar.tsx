import { Play, Save, LayoutGrid, Zap, MousePointer2 } from 'lucide-react';

import { useSonic } from '../../hooks/useSonic';
import { useState } from 'react';
import { clsx } from 'clsx';

export const FloatingToolbar = () => {
    const { playSelect } = useSonic();
    const [isRunning, setIsRunning] = useState(false);

    // Mock Actions
    const handleRun = () => {
        setIsRunning(true);
        playSelect();
        setTimeout(() => setIsRunning(false), 2000);
    };

    const handleSave = () => {
        playSelect();
        console.log('Saving Blueprint...');
        // Hook into store persistence later
    };

    return (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md rounded-full shadow-xl border border-white/20 ring-1 ring-black/5 p-1.5 flex items-center gap-2 z-[60] animate-in slide-in-from-top-4 duration-500">

            <div className="flex items-center gap-1 border-r border-slate-200 pr-2 mr-1">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Architect</span>
            </div>

            <ActionButton
                onClick={handleRun}
                icon={isRunning ? <Zap size={16} className="text-yellow-500 fill-yellow-500" /> : <Play size={16} className="fill-current" />}
                label={isRunning ? "Running..." : "Run"}
                active={isRunning}
                color="purple"
            />

            <div className="w-px h-6 bg-slate-200 mx-1" />

            <ActionButton
                onClick={handleSave}
                icon={<Save size={16} />}
                label="Save"
                color="blue"
            />

            <ActionButton
                onClick={() => { }}
                icon={<LayoutGrid size={16} />}
                label="Layout"
                color="slate"
            />

            <ActionButton
                onClick={() => { }}
                icon={<MousePointer2 size={16} />}
                label="Select"
                color="slate"
                active // Default tool
            />

        </div>
    );
};

const ActionButton = ({ icon, label, onClick, active, color = 'slate' }: any) => {
    const colors: Record<string, string> = {
        purple: "bg-purple-100 text-purple-700 hover:bg-purple-200",
        blue: "bg-blue-100 text-blue-700 hover:bg-blue-200",
        slate: "bg-slate-100 text-slate-700 hover:bg-slate-200"
    };
    const activeClass = colors[color] || colors['slate'];

    const inactiveClass = "hover:bg-slate-50 text-slate-500 hover:text-slate-900";

    return (
        <button
            onClick={onClick}
            className={clsx(
                "flex items-center gap-2 px-3 py-1.5 rounded-full transition-all text-sm font-medium",
                active ? activeClass : inactiveClass
            )}
        >
            {icon}
            <span className={clsx("hidden md:inline-block", !active && "md:hidden lg:inline-block")}>{label}</span>
        </button>
    );
};
