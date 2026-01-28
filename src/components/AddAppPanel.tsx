import { Search, Grip } from 'lucide-react';
import { clsx } from 'clsx';
import { useGraphStore } from '../store/useGraphStore';
import { useShallow } from 'zustand/react/shallow';

const APPS = [
    { id: 'google-sheets', name: 'Google Sheets', color: 'bg-green-500' },
    { id: 'telegram', name: 'Telegram Bot', color: 'bg-sky-500' },
    { id: 'google-drive', name: 'Google Drive', color: 'bg-amber-500' },
    { id: 'openai', name: 'OpenAI (GPT-4)', color: 'bg-emerald-600' },
    { id: 'webhook', name: 'Webhooks', color: 'bg-red-500' },
    { id: 'iterator', name: 'Iterator', color: 'bg-purple-500' },
    { id: 'router', name: 'Router', color: 'bg-indigo-500' },
];

export const AddAppPanel = () => {
    const addModule = useGraphStore(useShallow(state => state.addModule));

    const handleAdd = (appId: string) => {
        // Add to center of view (simplified)
        const position = { x: window.innerWidth / 2 - 300, y: window.innerHeight / 2 - 100 };

        addModule({
            name: appId,
            app: appId as any,
            label: APPS.find(a => a.id === appId)?.name || appId,
            description: 'Core Integration',
            parameters: {},
            mapper: { source: '', target: '' }
        } as any, position);
    };

    return (
        <div className="absolute top-20 right-8 z-40 w-72 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 overflow-hidden flex flex-col max-h-[80vh]">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 bg-white/50">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-slate-800">Add Application</h3>
                    <Grip className="w-4 h-4 text-slate-400 cursor-move" />
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search apps..."
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-make-purple/20 transition-all outline-none"
                    />
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {APPS.map((app) => (
                    <button
                        key={app.id}
                        onClick={() => handleAdd(app.id)}
                        className="w-full flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-all group text-left"
                    >
                        <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center text-white shadow-sm shrink-0", app.color)}>
                            {/* Simple initial letter for now if no specific icon */}
                            <span className="font-bold text-xs">{app.name[0]}</span>
                        </div>
                        <div className="flex-1">
                            <div className="text-sm font-semibold text-slate-700 group-hover:text-make-purple transition-colors">
                                {app.name}
                            </div>
                            <div className="text-xs text-slate-400">Core Integration</div>
                        </div>
                    </button>
                ))}
            </div>

            <div className="p-3 border-t border-slate-100 bg-slate-50/50 text-center">
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Antigravity Library</span>
            </div>
        </div>
    );
};
