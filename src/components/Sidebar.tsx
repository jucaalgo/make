
import { useState, useMemo } from 'react';
import {
    Grid,
    Search,
    ChevronDown,
    ChevronRight,
    Database
} from 'lucide-react';
import { clsx } from 'clsx';
import registry from '../data/module_registry.json';
import { IconResolver } from './ui/IconResolver';

export const Sidebar = () => {
    const [search, setSearch] = useState('');
    const [expandedApps, setExpandedApps] = useState<Record<string, boolean>>({});
    const modules = Object.values(registry);

    // Filter modules
    const filteredModules = modules.filter(mod => {
        const query = search.toLowerCase();
        return mod.name.toLowerCase().includes(query) ||
            mod.label.toLowerCase().includes(query) ||
            mod.app.toLowerCase().includes(query);
    });

    // Group by App
    const groupedModules = useMemo(() => {
        const groups: Record<string, typeof modules> = {};
        filteredModules.forEach(mod => {
            let groupKey = mod.app;
            if (mod.app === 'builtin' || mod.app === 'util' || mod.app === 'tools') {
                groupKey = ' 🛠️ Core Tools'; // Space to force sorting to top
            }
            if (!groups[groupKey]) groups[groupKey] = [];
            groups[groupKey].push(mod);
        });
        return groups;
    }, [filteredModules]);

    const sortedApps = Object.keys(groupedModules).sort();

    const toggleApp = (app: string) => {
        setExpandedApps(prev => ({
            ...prev,
            [app]: !prev[app]
        }));
    };





    const onDragStart = (event: React.DragEvent, module: typeof modules[0]) => {
        event.dataTransfer.setData('application/antigravity-module', JSON.stringify(module));
        event.dataTransfer.effectAllowed = 'move';

        // Custom Drag Ghost
        const ghost = document.createElement('div');
        ghost.classList.add(
            'fixed', 'top-[-1000px]', 'left-[-1000px]', // Off-screen
            'flex', 'items-center', 'gap-2', 'p-3', 'rounded-lg',
            'bg-white', 'shadow-xl', 'border', 'border-purple-200', 'z-[9999]'
        );
        ghost.innerHTML = `
            <div class="p-1 bg-purple-50 rounded">
                 <!-- Simple placeholder, ideally we clone the icon but this is fast and indicative -->
                 <span class="text-lg">📦</span> 
            </div>
            <div class="flex flex-col">
                <span class="text-sm font-bold text-slate-800">${module.label}</span>
                <span class="text-[10px] text-slate-500 font-mono">${module.app}</span>
            </div>
        `;
        document.body.appendChild(ghost);
        event.dataTransfer.setDragImage(ghost, 20, 20);

        // Cleanup
        setTimeout(() => {
            document.body.removeChild(ghost);
        }, 0);
    };

    return (
        <aside className="w-80 h-[96%] my-auto ml-4 flex flex-col glass-panel rounded-2xl z-10 transition-all duration-500 ease-out border-r-0 ring-1 ring-white/50">
            {/* Header */}
            <div className="p-5 border-b border-slate-100/50 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xs font-bold tracking-widest text-slate-400 uppercase bg-slate-50/50 px-2 py-1 rounded-md">App Registry</h2>
                    <div className="flex gap-1 text-slate-400">
                        <Grid size={14} className="hover:text-purple-600 cursor-pointer transition-colors" />
                    </div>
                </div>

                {/* Search */}
                <div className="relative group">
                    <Search className="absolute left-3 top-2.5 text-slate-400 group-focus-within:text-purple-500 transition-colors" size={16} />
                    <input
                        type="text"
                        placeholder="Search modules..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-slate-50/50 border border-slate-200/60 rounded-xl pl-10 pr-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-purple-200 focus:ring-4 focus:ring-purple-500/5 transition-all font-medium text-balance shadow-inner"
                    />
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                {sortedApps.map((app) => {
                    const isExpanded = expandedApps[app] || !!search; // Auto-expand on search
                    const appModules = groupedModules[app];
                    const isCore = app === ' 🛠️ Core Tools';

                    return (
                        <div key={app} className="mb-1">
                            {/* App Header (Click to Expand) */}
                            <div
                                onClick={() => toggleApp(app)}
                                className={clsx(
                                    "w-full flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-300 group select-none",
                                    isExpanded ? "bg-white/60 shadow-sm ring-1 ring-slate-900/5" : "hover:bg-white/40"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    {isCore ? (
                                        <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-gradient-to-br from-purple-100 to-indigo-50 text-purple-600 shadow-sm ring-1 ring-purple-100">
                                            <Database size={16} />
                                        </div>
                                    ) : (
                                        <IconResolver app={app} size={32} className="shrink-0 rounded-lg shadow-sm ring-1 ring-slate-900/5 bg-white p-0.5" />
                                    )}
                                    <div className="flex flex-col">
                                        <span className={clsx(
                                            "font-semibold text-sm transition-colors tracking-tight",
                                            isCore ? "text-purple-700" : "text-slate-700 group-hover:text-slate-900"
                                        )}>
                                            {app.replace(/-/g, ' ')}
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-medium">{appModules.length} modules</span>
                                    </div>
                                </div>
                                {isExpanded ? (
                                    <ChevronDown size={14} className="text-purple-400" />
                                ) : (
                                    <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-400" />
                                )}
                            </div>

                            {/* Dropdown Content */}
                            {isExpanded && (
                                <div className="ml-4 pl-4 border-l border-slate-200/60 mt-2 space-y-1 pb-2">
                                    {appModules.map(mod => {
                                        const isTrig = mod.name.toLowerCase().includes('trigger') || mod.name.toLowerCase().includes('watch');
                                        return (
                                            <div
                                                key={mod.name}
                                                draggable
                                                onDragStart={(e) => onDragStart(e, mod)}
                                                className="group/item flex items-center gap-2 p-2.5 rounded-lg hover:bg-white hover:shadow-sm hover:ring-1 hover:ring-slate-900/5 cursor-grab active:cursor-grabbing transition-all relative overflow-hidden"
                                            >
                                                <div className={clsx(
                                                    "w-1 h-8 rounded-full transition-all duration-300",
                                                    isTrig ? "bg-emerald-400/80 group-hover/item:bg-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.4)]" : "bg-slate-200 group-hover/item:bg-purple-500 group-hover/item:shadow-[0_0_8px_rgba(168,85,247,0.4)]"
                                                )} />
                                                <div className="flex flex-col min-w-0 z-10">
                                                    <span className="text-[13px] text-slate-600 group-hover/item:text-slate-900 truncate font-medium">
                                                        {mod.label}
                                                    </span>
                                                    {isTrig && (
                                                        <span className="text-[9px] text-emerald-600 font-bold tracking-wider opacity-0 group-hover/item:opacity-100 transition-opacity -mt-3 group-hover/item:mt-0">TRIGGER</span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </aside>
    );
};
