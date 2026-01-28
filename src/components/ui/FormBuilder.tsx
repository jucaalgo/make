import { useState } from 'react';
import { clsx } from 'clsx';
import { ToggleLeft, ToggleRight, ChevronDown, RefreshCw, Loader2, Sparkles } from 'lucide-react';
import type { RegistrySchema } from '../../types/registry';
import { useMockRpc } from '../../hooks/useMockRpc';

interface FormBuilderProps {
    data: Record<string, string | number | boolean>;
    schema?: RegistrySchema;
    onChange: (key: string, value: string | number | boolean) => void;
    app?: string;
}

// Mock Options for Dropdowns (Static Fallback)
const MOCK_OPTIONS: Record<string, string[]> = {
    'drive': ['My Drive', 'Shared With Me', 'Team Drives'],
    'folder': ['/Projects', '/Assets', '/Invoices'],
    'file_types': ['All', 'Images', 'PDFs', 'Spreadsheets'],
    'mode': ['Created Time', 'Modified Time'],
    'limit': ['1', '5', '10', '50']
};

export const FormBuilder = ({ data, schema = {}, onChange, app }: FormBuilderProps) => {
    // Mock Connection state
    const [connection, setConnection] = useState('My Google Account');

    // RPC Hook
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { loading, callRpc } = useMockRpc();
    const [dynamicOptions, setDynamicOptions] = useState<Record<string, string[]>>({});

    // Combine Keys: Schema Keys (Definitions) + Data Keys (Existing Values)
    const allKeys = Array.from(new Set([
        ...Object.keys(schema || {}),
        ...Object.keys(data || {})
    ]));

    // Filter out internal keys usually
    const visibleKeys = allKeys.filter(k => k !== '__IMTCONN__');

    const handleLoadOptions = async (key: string, method: string) => {
        try {
            const result = await callRpc(method);
            setDynamicOptions(prev => ({
                ...prev,
                [key]: result
            }));
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            // Error handled by hook mostly, but could show toast here
        }
    };

    if (visibleKeys.length === 0) {
        return <div className="text-xs text-slate-500 italic p-4 text-center">No configurable parameters.</div>;
    }

    return (
        <div className="space-y-6">

            {/* 1. Connection Section (Always visible for Apps) */}
            {app && app !== 'builtin' && app !== 'tools' && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                        <span>Connection</span>
                        <span className="text-purple-600 cursor-pointer flex items-center gap-1 hover:text-purple-700">
                            <RefreshCw size={10} /> Refresh
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <select
                                value={connection}
                                onChange={(e) => setConnection(e.target.value)}
                                className="w-full appearance-none bg-white border border-slate-300 rounded-md py-2 pl-3 pr-8 text-sm text-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all shadow-sm"
                            >
                                <option>My Google Account</option>
                                <option>Company Workspace</option>
                            </select>
                            <ChevronDown className="absolute right-2 top-2.5 text-slate-500 pointer-events-none" size={14} />
                        </div>
                        <button className="px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-md text-slate-700 font-medium text-xs transition-colors">
                            Add
                        </button>
                    </div>
                    <div className="text-[10px] text-slate-500">
                        Authorized as <strong>juancarlos@example.com</strong>
                    </div>
                </div>
            )}

            <hr className="border-slate-200" />

            {/* 2. Dynamic Fields */}
            <div className="space-y-4">
                {visibleKeys.map((key) => {
                    const fieldSchema = schema?.[key];
                    const value = data[key] ?? fieldSchema?.default ?? '';
                    const label = fieldSchema?.label || key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                    const type = fieldSchema?.type || typeof value;
                    const isRequired = fieldSchema?.required;

                    // RPC Handling
                    const rpcConfig = fieldSchema?.rpc;
                    const hasRpc = !!rpcConfig;
                    const currentOptions = dynamicOptions[key] || fieldSchema?.options || MOCK_OPTIONS[key.toLowerCase()] || [];
                    const isSelect = type === 'select' || (type === 'string' && (currentOptions.length > 0 || hasRpc));

                    return (
                        <div key={key} className="space-y-1.5 group">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-medium text-slate-600 flex items-center gap-1">
                                    {label}
                                    {isRequired && <span className="text-purple-500">*</span>}
                                </label>
                                {hasRpc && (
                                    <button
                                        onClick={() => handleLoadOptions(key, rpcConfig.method)}
                                        disabled={loading}
                                        className="text-[10px] text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 px-2 py-0.5 rounded flex items-center gap-1 transition-colors"
                                    >
                                        {loading ? <Loader2 size={10} className="animate-spin" /> : <RefreshCw size={10} />}
                                        {rpcConfig.label}
                                    </button>
                                )}
                            </div>

                            {/* RENDER LOGIC */}
                            {type === 'boolean' || type === 'bool' ? (
                                <button
                                    onClick={() => onChange(key, !value)}
                                    className={clsx(
                                        "flex items-center gap-2 px-3 py-2 rounded-md border w-full transition-all text-sm font-medium shadow-sm",
                                        value
                                            ? "bg-emerald-50 border-emerald-500 text-emerald-600 shadow-emerald-100"
                                            : "bg-white border-slate-300 text-slate-500 hover:border-slate-400"
                                    )}
                                >
                                    {value ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                                    <span>{value ? 'Yes' : 'No'}</span>
                                </button>
                            ) : isSelect ? (
                                <div className="relative">
                                    <select
                                        value={String(value)}
                                        onChange={(e) => onChange(key, e.target.value)}
                                        className="w-full appearance-none bg-white border border-slate-300 text-slate-800 rounded-md py-2 px-3 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 outline-none transition-all cursor-pointer hover:border-slate-400 shadow-sm"
                                    >
                                        <option value="" disabled>Select...</option>
                                        {currentOptions.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-2.5 text-slate-500 pointer-events-none" size={14} />
                                </div>
                            ) : key === 'temperature' || key === 'frequency_penalty' ? (
                                // SLIDER Input for AI
                                <div className="flex items-center gap-3">
                                    <input
                                        type="range"
                                        min="0"
                                        max="2"
                                        step="0.1"
                                        value={Number(value) || 0}
                                        onChange={(e) => onChange(key, Number(e.target.value))}
                                        className="flex-1 accent-purple-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <span className="text-xs font-mono text-slate-500 w-8 text-right">{Number(value).toFixed(1)}</span>
                                </div>
                            ) : (
                                // DEFAULT TEXT INPUT
                                <div className="relative">
                                    <input
                                        type={key.includes('password') || key.includes('token') ? 'password' : 'text'}
                                        value={String(value)}
                                        onChange={(e) => onChange(key, e.target.value)}
                                        placeholder={`Enter ${label ? String(label).toLowerCase() : 'value'}...`}
                                        className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-800 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/20 transition-colors placeholder:text-slate-400 shadow-sm"
                                    />
                                    {/* Data Pill Insertion Hint */}
                                    <div className="absolute right-2 top-2 text-xs text-slate-300 pointer-events-none">
                                        <Sparkles size={14} />
                                    </div>
                                </div>
                            )}

                            {/* Helper Text (Mocked) */}
                            <div className="text-[10px] text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                Configure {label}.
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
