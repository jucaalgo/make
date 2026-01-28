import { useRef, useEffect } from 'react';
import { Plus, LayoutGrid, Zap, Copy } from 'lucide-react';
import { useGraphStore } from '../../store/useGraphStore';
import registryData from '../../data/module_registry.json';


interface ContextMenuProps {
    top: number;
    left: number;
    right: number | undefined;
    bottom: number | undefined;
    onClose: () => void;
    position: { x: number; y: number }; // Flow Position
}

export const ContextMenu = ({ top, left, right, bottom, onClose, position }: ContextMenuProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const addModule = useGraphStore(s => s.addModule);

    // Close on click outside
    useEffect(() => {
        const handleClick = () => onClose();
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, [onClose]);

    // Quick Add Actions
    const handleAdd = (role: string) => {
        // Find a module that matches this role broadly
        // This is a naive heuristic for the prototype
        let moduleId = '';
        if (role === 'trigger') moduleId = 'webhook:customWebhook';
        if (role === 'action') moduleId = 'openai:createCompletion';
        if (role === 'helper') moduleId = 'google-sheets:watchRows';

        const moduleDef = (registryData as any)[moduleId];
        if (moduleDef) {
            addModule(moduleDef, position);
        }
    };

    return (
        <div
            ref={ref}
            style={{ top, left, right, bottom }}
            className="fixed z-[100] w-56 bg-white/90 backdrop-blur-md rounded-lg shadow-2xl border border-white/20 ring-1 ring-black/5 flex flex-col p-1 text-sm animate-in fade-in zoom-in-95 duration-100"
            onClick={(e) => e.stopPropagation()} // Prevent closing immediately
        >
            <div className="px-2 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Quick Actions
            </div>

            <button
                onClick={() => { handleAdd('trigger'); onClose(); }}
                className="flex items-center gap-3 px-2 py-2 hover:bg-purple-50 hover:text-purple-700 rounded-md transition-colors text-slate-700 text-left"
            >
                <div className="p-1 bg-purple-100 rounded text-purple-600"><Zap size={14} /></div>
                <span>Add Trigger</span>
            </button>

            <button
                onClick={() => { handleAdd('action'); onClose(); }}
                className="flex items-center gap-3 px-2 py-2 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors text-slate-700 text-left"
            >
                <div className="p-1 bg-blue-100 rounded text-blue-600"><Plus size={14} /></div>
                <span>Add Action</span>
            </button>

            <div className="h-px bg-slate-100 my-1" />

            <button className="flex items-center gap-3 px-2 py-2 hover:bg-slate-100 rounded-md transition-colors text-slate-600 text-left">
                <Copy size={14} className="text-slate-400" />
                <span>Paste</span>
                <span className="ml-auto text-[10px] text-slate-400 font-mono">⌘V</span>
            </button>
            <button className="flex items-center gap-3 px-2 py-2 hover:bg-slate-100 rounded-md transition-colors text-slate-600 text-left">
                <LayoutGrid size={14} className="text-slate-400" />
                <span>Auto Layout</span>
            </button>

        </div>
    );
};
