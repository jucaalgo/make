import { Search, Grip } from 'lucide-react';
import { clsx } from 'clsx';
import { useGraphStore } from '../store/useGraphStore';
import { useShallow } from 'zustand/react/shallow';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import registryData from '../../module_registry_backup.json';
import knowledgeData from '../data/static-knowledge.json';
import { useState, useMemo } from 'react';

// Extract unique apps from registry for the list
const RAW_REGISTRY = { ...registryData, ...knowledgeData } as Record<string, any>;
const UNIQUE_APPS = Object.values(RAW_REGISTRY).reduce((acc: any[], module: any) => {
    if (!acc.find((a: any) => a.id === module.app)) {
        const isKnowledge = module.app === 'knowledge-base';
        acc.push({
            id: module.app,
            name: isKnowledge ? '🧠 Knowledge Base' : (module.app.charAt(0).toUpperCase() + module.app.slice(1)),
            color: isKnowledge ? 'bg-amber-500' : 'bg-indigo-500' // Distinct color for knowledge
        });
    }
    return acc;
}, []);

export const AddAppPanel = () => {
    const addModule = useGraphStore(useShallow(state => state.addModule));
    const [searchTerm, setSearchTerm] = useState('');

    const filteredItems = useMemo(() => {
        if (!searchTerm) return UNIQUE_APPS; // Show Apps by default

        // If searching, show specific MODULES (Triggers/Actions)
        const lowerSearch = searchTerm.toLowerCase();
        return Object.values(RAW_REGISTRY).filter((mod: any) =>
            mod.label.toLowerCase().includes(lowerSearch) ||
            mod.app.toLowerCase().includes(lowerSearch)
        ).map((mod: any) => ({
            id: mod.name, // Use specific module key
            name: mod.label, // Use specific label (e.g. "Watch Rows")
            type: 'module',
            app: mod.app,
            color: UNIQUE_APPS.find((a: any) => a.id === mod.app)?.color || 'bg-slate-500'
        })).slice(0, 50); // Limit results
    }, [searchTerm]);

    const handleAdd = (item: any) => {
        let moduleDef;

        if (item.type === 'module') {
            moduleDef = RAW_REGISTRY[item.id];
        } else {
            // It's an App, find default
            const firstModuleKey = Object.keys(RAW_REGISTRY).find(key => RAW_REGISTRY[key].app === item.id);
            if (!firstModuleKey) return;
            moduleDef = RAW_REGISTRY[firstModuleKey];
        }

        const position = { x: window.innerWidth / 2 - 300, y: window.innerHeight / 2 - 100 };

        addModule({
            name: moduleDef.name,
            app: moduleDef.app as any,
            label: moduleDef.label,
            description: 'Core Integration',
            parameters: moduleDef.parameters || {},
            mapper: moduleDef.mapper || {}
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
                        placeholder={`Search ${Object.keys(registryData).length} modules...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-make-purple/20 transition-all outline-none"
                    />
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                {filteredItems.map((item: any) => (
                    <button
                        key={item.id}
                        onClick={() => handleAdd(item)}
                        className="w-full flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-all group text-left"
                    >
                        <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center text-white shadow-sm shrink-0", item.color)}>
                            <span className="font-bold text-xs">{item.name[0]}</span>
                        </div>
                        <div className="flex-1">
                            <div className="text-sm font-semibold text-slate-700 group-hover:text-make-purple transition-colors truncate">
                                {item.name}
                            </div>
                            <div className="text-xs text-slate-400">
                                {item.type === 'module' ? `Trigger/Action for ${item.app}` : 'Integration App'}
                            </div>
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
