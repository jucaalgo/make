import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { clsx } from 'clsx';
import { IconResolver, APP_COLORS } from '../ui/IconResolver';
import type { AntigravityNode } from '../../types/graph';
import { useGraphStore } from '../../store/useGraphStore';
import { useSonic } from '../../hooks/useSonic';
import { SmartBlueprinter } from '../../lib/SmartBlueprinter';
import registryData from '../../data/module_registry.json';
import type { RegistryModule } from '../../types/graph';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export const RichNode = memo(({ data, selected, id }: NodeProps<AntigravityNode>) => {
    const selectedNodeId = useGraphStore((s) => s.selectedNodeId);
    const selectNode = useGraphStore((s) => s.selectNode);
    const setThemeColor = useGraphStore((s) => s.setThemeColor);
    const addModule = useGraphStore((s) => s.addModule);
    const { playSelect, playHover, playConnect } = useSonic();

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        playSelect(); // SONIC HIT
        selectNode(id);

        // CHAMELEON MODE: Extract brand color
        // Try to handle "google-sheets" and "google-sheets:trigger" etc
        const appKey = data.app.split(':')[0];
        const brandColor = APP_COLORS[appKey] || APP_COLORS[Object.keys(APP_COLORS).find(k => appKey.includes(k)) || ''] || '#a855f7';
        setThemeColor(brandColor);
    };

    const handleGhostClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        playConnect();

        // GHOST PREDICTION
        const suggestion = SmartBlueprinter.suggestNext(data.app);
        if (suggestion) {
            // Add next to this node. Offset position would need to be calculated in real app.
            // For now, we rely on Canvas drop logic or store logic, but 'addModule' needs position.
            // We'll hack a rough position relative to current.
            // (In a real app, we'd pass current x/y from props or store)
            // Since we don't have x/y in props here easily without `data` hygiene,
            // We will just add it at a fixed offset or let user drag.
            // Wait, we need position. Let's assume store handles layout or we pass it? 
            // Actually RichNode receives xPos/yPos? No, only data.
            // Let's just add it at center screen for now or random near.
            addModule(suggestion, { x: Math.random() * 100 + 500, y: Math.random() * 100 + 200 });
        }
    };

    // Focus Mode Logic: If *some* node is selected, but not *this* one, dim this one.
    const isDimmed = selectedNodeId && selectedNodeId !== id;

    // VALIDATION LOGIC
    const registryModule = (registryData as unknown as Record<string, RegistryModule>)[data.module];
    const schema = registryModule?.parameters || {};
    const config = data.config || {};

    // Check if all required fields are present
    const isMissingRequired = Object.entries(schema).some(([key, param]) => {
        return param.required && (config[key] === undefined || config[key] === '');
    });

    const isValid = !isMissingRequired;
    const isAiGenerated = isValid; // Re-using this prop for now or just ignoring it

    return (

        <div
            onClick={handleClick}
            onMouseEnter={playHover}
            style={{
                borderColor: selected ? 'var(--theme-color)' : undefined,
            } as React.CSSProperties}
            className={clsx(
                "group relative w-72 rounded-2xl border transition-all duration-300 ease-out",
                // Focus Mode Styles
                isDimmed && "opacity-40 grayscale-[0.5] blur-[1px] hover:opacity-100 hover:blur-none hover:grayscale-0",

                // Liquid Spatial Styles (Light/Glass)
                // Base State: Frosted glass, soft shadow, thin border
                "bg-white/80 backdrop-blur-xl border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] ring-1 ring-slate-900/5",

                // Hover State: Lift up, deepen shadow
                !selected && "hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:bg-white/95",

                // Selected State: Brand color glow, solid
                selected && "ring-2 ring-purple-500 ring-offset-2 ring-offset-purple-50 shadow-[0_0_40px_rgba(168,85,247,0.15)] bg-white z-50 transform scale-[1.02]"
            )}
        >
            {/* Soft Gradient Overlay for Depth */}
            <div className={clsx(
                "absolute inset-0 -z-10 rounded-2xl bg-gradient-to-b from-white/80 to-transparent opacity-80",
            )} />

            {/* Genius Badge (Top Right Float) - Updated for Light Mode */}
            {isAiGenerated && (
                <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-purple-100 animate-bounce-slow">
                    <div className="h-4 w-4 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full" />
                </div>
            )}

            {/* Header Content */}
            <div className="p-4 flex items-start gap-4 z-10 relative">
                {/* Dynamic Icon Container */}
                <div className={clsx(
                    "p-2.5 rounded-xl shadow-sm transition-all duration-300 ring-1 ring-slate-900/5",
                    selected ? "bg-purple-100/50" : "bg-white"
                )}>
                    <IconResolver app={data.app} size={28} />
                </div>

                <div className="flex-1 min-w-0 pt-0.5">
                    {/* Title */}
                    <div className="flex items-center justify-between">
                        <h3 className={clsx(
                            "text-[15px] font-bold tracking-tight truncate",
                            selected ? "text-slate-900" : "text-slate-800"
                        )}>
                            {data.label}
                        </h3>
                    </div>

                    {/* Subtitle / App Name */}
                    <p className="text-[11px] font-medium text-slate-500 flex items-center gap-1.5 mt-0.5 uppercase tracking-wide">
                        {data.app.split(':')[0].replace('-', ' ')}
                    </p>
                </div>
            </div>

            {/* Status Integration (Bottom Bar) */}
            {(isValid || !isValid) && (
                <div className="px-4 pb-4">
                    <div className={clsx(
                        "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border transition-colors",
                        isValid
                            ? "bg-slate-50 text-slate-600 border-slate-100"
                            : "bg-red-50 text-red-600 border-red-100 animate-pulse"
                    )}>
                        {isValid ? <CheckCircle2 size={14} className="text-emerald-500" /> : <AlertCircle size={14} />}
                        <span>{isValid ? "Ready" : "Configuration Missing"}</span>
                    </div>
                </div>
            )}
            {/* Controls / Inputs Area */}
            <div className="p-4 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Operation</span>
                    <span className="font-mono text-[10px] text-slate-300 bg-slate-950/50 px-2 py-0.5 rounded border border-white/5 truncate max-w-[120px]">
                        {data.module.split(':')[1] || 'default'}
                    </span>
                </div>
            </div>

            {/* GHOST PLUS BUTTON (Suggest Next) */}
            {selected && (
                <>
                    <div
                        onClick={handleGhostClick}
                        className="absolute -right-5 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-white text-purple-600 shadow-xl cursor-pointer hover:bg-slate-100 transition-colors z-50 ring-2 ring-purple-100"
                        title="AI Auto-Complete Next Step"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                    </div>
                </>
            )}

            {/* DELETE BUTTON (Top Right, visibly disjointed) */}
            {selected && (
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        // Assuming removeModule is available in store and mapped. 
                        // We need to fetch it from store above.
                        useGraphStore.getState().removeModule(id);
                    }}
                    className="absolute -top-3 -left-3 flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 text-slate-400 border border-slate-600 shadow-lg cursor-pointer hover:bg-red-500 hover:text-white hover:border-red-400 transition-all z-50"
                    title="Delete Module"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                </div>
            )}

            {/* Handles */}
            <Handle
                type="target"
                position={Position.Left}
                className={clsx(
                    "!h-3 !w-3 !-translate-x-1.5 !border-2 transition-all duration-300",
                    selected ? "!bg-purple-500 !border-white shadow-[0_0_10px_purple]" : "!bg-slate-400 !border-slate-900 group-hover:!bg-purple-400"
                )}
            />
            <Handle
                type="source"
                position={Position.Right}
                className={clsx(
                    "!h-3 !w-3 !translate-x-1.5 !border-2 transition-all duration-300",
                    selected ? "!bg-purple-500 !border-white shadow-[0_0_10px_purple]" : "!bg-slate-400 !border-slate-900 group-hover:!bg-purple-400"
                )}
            />
        </div>
    );
});
