import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Bot, FileSpreadsheet, HardDrive, Webhook, Zap, type LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';
import { memo } from 'react';
import type { AntigravityNode } from '../types/graph';

// Map of app IDs to Icons and Colors
const APP_CONFIG: Record<string, { icon: LucideIcon; color: string; bg: string }> = {
    'google-sheets': { icon: FileSpreadsheet, color: 'text-white', bg: 'bg-app-sheets' },
    'telegram': { icon: Bot, color: 'text-white', bg: 'bg-app-telegram' }, // Telegram is a bot mostly
    'google-drive': { icon: HardDrive, color: 'text-white', bg: 'bg-app-google' },
    'openai': { icon: Zap, color: 'text-white', bg: 'bg-app-openai' }, // Using Zap for AI for now
    'webhook': { icon: Webhook, color: 'text-white', bg: 'bg-app-webhook' },
    'default': { icon: Zap, color: 'text-white', bg: 'bg-app-default' }
};

const MakeNode = ({ data, selected }: NodeProps<AntigravityNode>) => {
    // Determine App Style
    const appKey = (data.app as string) || 'default';
    const config = APP_CONFIG[appKey] || APP_CONFIG['default'];
    const Icon = config.icon;

    return (
        <div className="group relative">
            {/* Hover/Selection Halo */}
            <div
                className={clsx(
                    "absolute -inset-3 rounded-full transition-all duration-300",
                    selected ? "bg-make-purple/20 scale-100" : "bg-transparent scale-90 group-hover:bg-slate-200/50 group-hover:scale-100"
                )}
            />

            {/* Main Node Bubble */}
            <div
                className={clsx(
                    "relative w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 border-4 border-white",
                    config.bg
                )}
            >
                {/* Icon */}
                <Icon size={32} className={config.color} />

                {/* Badge (Modifications) - Only show if pending changes or special status */}
                {(data as any).badge && (
                    <div className="absolute top-0 right-0 w-6 h-6 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                        {(data as any).badge}
                    </div>
                )}
            </div>

            {/* Floating Label */}
            <div className="absolute top-24 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <span className="px-3 py-1 bg-white/90 backdrop-blur text-xs font-semibold text-slate-700 rounded-full shadow-sm border border-slate-100">
                    {data.label as string}
                </span>
            </div>

            {/* Connection Handles - Hidden but functional */}
            <Handle
                type="target"
                position={Position.Left}
                className="!bg-transparent !border-none !w-4 !h-4 -left-2"
            />
            <Handle
                type="source"
                position={Position.Right}
                className="!bg-transparent !border-none !w-4 !h-4 -right-2"
            />
        </div>
    );
};

export default memo(MakeNode);
