import { useGraphStore } from '../../store/useGraphStore';
import { useShallow } from 'zustand/react/shallow';
import { IconResolver } from './IconResolver';

import type { RegistryModule } from '../../types/graph';
import registryData from '../../data/module_registry.json';
import { ChevronRight, ChevronDown, Database } from 'lucide-react';
import { useState } from 'react';



interface OutputMapperProps {
    currentNodeId: string;
}

export const OutputMapper = ({ currentNodeId }: OutputMapperProps) => {
    const { nodes } = useGraphStore(useShallow((s) => ({
        nodes: s.nodes,
        edges: s.edges
    })));

    // 1. Find ancestors (simple implementation: just direct incomers for now, or all previous nodes?)
    // For a real engine, we need topological sort or just "available nodes". 
    // Let's assume ANY node that is not the current one is potentially available for now (simplification for prototype), 
    // or better: filter to nodes that actually connect to this one? 
    // n8n allows referencing ANY previous node. Let's list all OTHER nodes for simplicity and power.
    const availableNodes = nodes.filter(n => n.id !== currentNodeId);

    return (
        <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Database size={12} />
                Available Data
            </h4>

            <div className="space-y-2">
                {availableNodes.length === 0 && (
                    <div className="text-xs text-slate-400 italic">No other nodes available.</div>
                )}

                {availableNodes.map(node => (
                    <NodeOutputGroup key={node.id} node={node} />
                ))}
            </div>
        </div>
    );
};

const NodeOutputGroup = ({ node }: { node: any }) => {
    const [expanded, setExpanded] = useState(false);

    // Fetch schema
    const registryModule = (registryData as unknown as Record<string, RegistryModule>)[node.data.module];
    const outputs = registryModule?.mapper || {};

    const createToken = (path: string) => `{{${node.id}.${path}}}`;

    const handleDragStart = (e: React.DragEvent, path: string) => {
        e.dataTransfer.setData('text/plain', createToken(path));
        e.dataTransfer.effectAllowed = 'copy';
    };

    const handleCopy = (path: string) => {
        navigator.clipboard.writeText(createToken(path));
        // Optional: Toast notification could go here
    };

    return (
        <div className="border border-slate-200 rounded-lg bg-white overflow-hidden">
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center justify-between p-2 hover:bg-slate-50 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <IconResolver app={node.data.app} size={16} />
                    <span className="text-xs font-semibold text-slate-700">{node.data.label}</span>
                    <span className="text-[10px] text-slate-400 font-mono">#{node.id}</span>
                </div>
                {expanded ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />}
            </button>

            {expanded && (
                <div className="p-2 border-t border-slate-100 bg-slate-50 space-y-1">
                    {Object.entries(outputs).map(([key, field]) => (
                        <div
                            key={key}
                            draggable
                            onDragStart={(e) => handleDragStart(e, key)}
                            onClick={() => handleCopy(key)}
                            title="Drag or click to copy"
                            className="group flex items-center gap-2 p-1.5 rounded cursor-grab active:cursor-grabbing hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 transition-all select-none"
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                            <span className="text-xs text-slate-600 font-mono">{field.label || key}</span>
                            <span className="text-[9px] text-slate-400 ml-auto opacity-0 group-hover:opacity-100">{field.type}</span>
                        </div>
                    ))}
                    {Object.keys(outputs).length === 0 && (
                        <div className="text-[10px] text-slate-400 italic pl-2">No outputs defined.</div>
                    )}
                </div>
            )}
        </div>
    );
};
