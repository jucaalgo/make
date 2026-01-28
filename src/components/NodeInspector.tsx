import { X, Play, Settings, Database, Trash2 } from 'lucide-react';
import { useGraphStore } from '../store/useGraphStore';
import { useShallow } from 'zustand/react/shallow';
import type { RegistryModule } from '../types/graph';
import { FormBuilder } from './ui/FormBuilder';
import { OutputTree } from './ui/OutputTree';
import { OutputMapper } from './ui/OutputMapper';
import { ErrorBouncer } from './ui/ErrorBouncer';
import { IconResolver } from './ui/IconResolver';
import { useState, useEffect } from 'react';
import registryData from '../../module_registry_backup.json'; // Restore backup



export const NodeInspector = () => {
    const { selectedNodeId, nodes, selectNode, onNodesChange } = useGraphStore(useShallow((s) => ({
        selectedNodeId: s.selectedNodeId,
        nodes: s.nodes,
        selectNode: s.selectNode,
        onNodesChange: s.onNodesChange
    })));

    const [localConfig, setLocalConfig] = useState<Record<string, string | number | boolean>>({});
    const [activeTab, setActiveTab] = useState<'settings' | 'output'>('settings');

    const node = nodes.find(n => n.id === selectedNodeId);

    // Sync local state when node changes
    useEffect(() => {
        if (node) {
            setLocalConfig(node.data.config || {});
            setActiveTab('settings'); // Reset tab on node switch
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [node?.id]);

    if (!selectedNodeId || !node) return null;

    // Fetch Registry Definition specifically for this module
    const registryModule = (registryData as unknown as Record<string, RegistryModule>)[node.data.module];

    const handleConfigChange = (key: string, value: string | number | boolean) => {
        const newConfig = { ...localConfig, [key]: value };
        setLocalConfig(newConfig);

        onNodesChange([{
            id: node.id,
            type: 'replace',
            item: {
                ...node,
                data: {
                    ...node.data,
                    config: newConfig,
                    isConfigured: true
                }
            }
        }]);
    };

    return (
        <aside className="absolute right-0 top-0 h-full w-[400px] bg-white/95 backdrop-blur-3xl border-l border-slate-200 shadow-2xl z-50 flex flex-col transition-transform duration-300 animate-in slide-in-from-right">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <IconResolver app={node.data.app} size={32} className="rounded-lg shadow-sm" />
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">{node.data.label}</h3>
                        <div className="text-xs text-slate-500 font-mono">{node.data.module}</div>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => {
                            if (node) {
                                useGraphStore.getState().removeModule(node.id);
                                selectNode(null);
                            }
                        }}
                        className="p-2 hover:bg-red-50 rounded-full text-slate-400 hover:text-red-500 transition-colors"
                        title="Delete Module"
                    >
                        <Trash2 size={20} />
                    </button>
                    <button
                        onClick={() => selectNode(null)}
                        className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-100 px-6 gap-6">
                <button
                    onClick={() => setActiveTab('settings')}
                    className={`py-3 flex items-center gap-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'settings'
                        ? 'border-purple-500 text-purple-600'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                        }`}
                >
                    <Settings size={14} /> Settings
                </button>
                <button
                    onClick={() => setActiveTab('output')}
                    className={`py-3 flex items-center gap-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'output'
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                        }`}
                >
                    <Database size={14} /> Output
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">

                {activeTab === 'settings' ? (
                    <div className="space-y-6">
                        {/* 0. Error Bouncer Status (Top) */}
                        <div className="p-1">
                            <ErrorBouncer node={node} registryModule={registryModule} />
                        </div>

                        {/* 1. Configuration Form */}
                        <div className="space-y-1">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Parameters</label>
                                <span className="text-[10px] text-slate-400 font-mono">Auto-Save On</span>
                            </div>

                            <div className="p-1">
                                <FormBuilder
                                    data={Object.keys(localConfig).length > 0 ? localConfig : {}}
                                    schema={registryModule?.parameters || {}}
                                    onChange={handleConfigChange}
                                    app={node.data.app}
                                />
                            </div>
                        </div>

                        {/* 2. Data Mapper (New Phase 2 Feature) */}
                        <div className="pt-4 border-t border-slate-100">
                            <OutputMapper currentNodeId={node.id} />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Output Bundle</label>
                            <span className="text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-mono border border-green-100">Live Schema</span>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 shadow-inner">
                            <OutputTree schema={registryModule?.mapper || {}} />
                        </div>
                    </div>
                )}

            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50">
                <button className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg shadow-sm shadow-purple-200 transition-all flex items-center justify-center gap-2">
                    <Play size={16} /> Run this module only
                </button>
            </div>
        </aside>
    );
};
