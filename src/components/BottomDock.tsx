import { Play, Calendar, Settings, History, Download } from 'lucide-react';
import { downloadBlueprint } from '../lib/export';
import { useGraphStore } from '../store/useGraphStore';
import { useShallow } from 'zustand/react/shallow';

export const BottomDock = ({ onRun }: { onRun: () => void }) => {
    const { nodes } = useGraphStore(useShallow(s => ({ nodes: s.nodes })));

    const handleExport = () => {
        downloadBlueprint(nodes);
    };

    return (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2">
            {/* Main Execution Control */}
            <div className="flex items-center gap-1 p-1 bg-white rounded-full shadow-2xl border border-slate-100/50">
                <button
                    onClick={onRun}
                    className="flex items-center gap-2 px-6 py-3 bg-make-purple hover:bg-indigo-600 text-white rounded-full font-bold transition-all active:scale-95 shadow-lg shadow-indigo-500/30 group"
                >
                    <Play className="fill-current w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>Run once</span>
                </button>

                <div className="w-px h-8 bg-slate-200 mx-1" />

                <button className="p-3 hover:bg-slate-100 rounded-full text-slate-500 hover:text-make-purple transition-colors tooltip" title="Scheduling">
                    <Calendar className="w-5 h-5" />
                </button>

                <button className="p-3 hover:bg-slate-100 rounded-full text-slate-500 hover:text-make-purple transition-colors" title="Settings">
                    <Settings className="w-5 h-5" />
                </button>
            </div>

            {/* Side Utilities */}
            <div className="flex items-center gap-1 p-2 bg-white rounded-full shadow-xl border border-slate-100/50 ml-2">
                <button className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 transition-colors">
                    <History className="w-4 h-4" />
                </button>
                <button
                    onClick={handleExport}
                    className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-green-600 transition-colors"
                    title="Export to JSON"
                >
                    <Download className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};
