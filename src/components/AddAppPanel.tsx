import { Search, Grip, ChevronLeft, ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';
import { useGraphStore } from '../store/useGraphStore';
import { useShallow } from 'zustand/react/shallow';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import registryData from '../../module_registry_backup.json';
import knowledgeData from '../data/static-knowledge.json';
import { useState, useMemo } from 'react';

// Merge Registries
const RAW_REGISTRY = { ...registryData, ...knowledgeData } as Record<string, any>;

// Aggregate Apps
const UNIQUE_APPS = Object.values(RAW_REGISTRY).reduce((acc: any[], module: any) => {
    if (!acc.find((a: any) => a.id === module.app)) {
        const isKnowledge = module.app === 'knowledge-base';
        let color = 'bg-indigo-500';
        if (isKnowledge) color = 'bg-amber-500';
        else if (module.app === 'google-sheets') color = 'bg-green-600';
        else if (module.app === 'google-drive') color = 'bg-blue-600';
        else if (module.app === 'slack') color = 'bg-purple-600';
        else if (module.app === 'gmail') color = 'bg-red-500';

        acc.push({
            id: module.app,
            name: isKnowledge ? 'Knowledge Base' : (module.app.charAt(0).toUpperCase() + module.app.slice(1).replace(/-/g, ' ')),
            icon: module.app.charAt(0).toUpperCase(),
            color,
            moduleCount: Object.values(RAW_REGISTRY).filter((m: any) => m.app === module.app).length
        });
    }
    return acc;
}, []).sort((a: any, b: any) => a.name.localeCompare(b.name));

export const AddAppPanel = () => {
    const addModule = useGraphStore(useShallow(state => state.addModule));
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedApp, setSelectedApp] = useState<string | null>(null);

    // Filter Step 1: Apps
    const filteredApps = useMemo(() => {
        if (!searchTerm) return UNIQUE_APPS;
        return UNIQUE_APPS.filter((app: any) => app.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [searchTerm]);

    // Filter Step 2: Modules of Selected App
    const appModules = useMemo(() => {
        if (!selectedApp) return [];
        return Object.values(RAW_REGISTRY).filter((m: any) => m.app === selectedApp);
    }, [selectedApp]);

    const handleAddModule = (moduleDef: any) => {
        const position = { x: window.innerWidth / 2 - 300, y: window.innerHeight / 2 - 100 };

        addModule({
            name: moduleDef.name,
            app: moduleDef.app as any,
            label: moduleDef.label,
            description: moduleDef.description || 'Integration Module',
            parameters: moduleDef.parameters || {},
            mapper: moduleDef.mapper || {}
        } as any, position);

        // Reset after add ? No, keep open for multiple maybe. Or close.
        // setSelectedApp(null); 
    };

    return (
        <div className="absolute top-20 right-8 z-40 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 overflow-hidden flex flex-col max-h-[80vh] transition-all">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 bg-white/50">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        {selectedApp && (
                            <button
                                onClick={() => setSelectedApp(null)}
                                className="p-1 -ml-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
                            >
                                <ChevronLeft size={18} />
                            </button>
                        )}
                        <h3 className="font-bold text-slate-800">
                            {selectedApp ? UNIQUE_APPS.find((a: any) => a.id === selectedApp)?.name : 'Add Application'}
                        </h3>
                    </div>
                    {!selectedApp && <Grip className="w-4 h-4 text-slate-400 cursor-move" />}
                </div>

                {!selectedApp && (
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search apps..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-make-purple/20 transition-all outline-none"
                        />
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">

                {/* VIEW 1: APPLICATIONS LIST */}
                {!selectedApp ? (
                    filteredApps.map((app: any) => (
                        <button
                            key={app.id}
                            onClick={() => setSelectedApp(app.id)}
                            className="w-full flex items-center gap-3 p-2.5 hover:bg-slate-50 rounded-xl transition-all group text-left border border-transparent hover:border-slate-100"
                        >
                            <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md shadow-slate-200 shrink-0 text-lg font-bold", app.color)}>
                                {app.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-slate-700 group-hover:text-make-purple transition-colors truncate">
                                    {app.name}
                                </div>
                                <div className="text-xs text-slate-400 font-medium">
                                    {app.moduleCount} modules available
                                </div>
                            </div>
                            <ArrowRight size={14} className="text-slate-300 group-hover:text-make-purple transform group-hover:translate-x-1 transition-all" />
                        </button>
                    ))
                ) : (
                    /* VIEW 2: MODULES LIST */
                    <div className="space-y-1 animate-in slide-in-from-right duration-200">
                        {appModules.map((mod: any) => {
                            const isTrigger = mod.name.toLowerCase().includes('watch') || mod.name.toLowerCase().includes('trigger') || mod.name.toLowerCase().includes('listener'); // Simple heuristics
                            return (
                                <button
                                    key={mod.name}
                                    onClick={() => handleAddModule(mod)}
                                    className="w-full flex items-center gap-3 p-2 hover:bg-indigo-50/50 rounded-lg transition-all group text-left border border-transparent hover:border-indigo-100"
                                >
                                    <div className={clsx(
                                        "w-1 h-8 rounded-full",
                                        isTrigger ? "bg-emerald-400" : "bg-slate-300 group-hover:bg-make-purple"
                                    )} />

                                    <div className="flex-1">
                                        <div className="text-xs font-semibold text-slate-700 group-hover:text-make-purple">
                                            {mod.label}
                                        </div>
                                        {mod.description && (
                                            <div className="text-[10px] text-slate-400 line-clamp-1">{mod.description}</div>
                                        )}
                                        {isTrigger && (
                                            <span className="text-[9px] text-emerald-600 font-mono font-bold tracking-wider mt-0.5 block">TRIGGER</span>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="p-3 border-t border-slate-100 bg-slate-50/50 text-center">
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                    {selectedApp ? `${appModules.length} Modules` : 'Antigravity Library'}
                </span>
            </div>
        </div>
    );
};
