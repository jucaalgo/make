import { AlertTriangle, CheckCircle } from 'lucide-react';
import type { RegistryModule } from '../../types/graph';

interface ErrorBouncerProps {
    node: any;
    registryModule: RegistryModule;
}

export const ErrorBouncer = ({ node, registryModule }: ErrorBouncerProps) => {
    // 1. Validate Required Fields
    const config = node.data.config || {};
    const schema = registryModule?.parameters || {};
    const errors: string[] = [];

    Object.entries(schema).forEach(([key, param]) => {
        if (param.required && (config[key] === undefined || config[key] === '')) {
            errors.push(`${param.label || key} is required.`);
        }
    });

    const isValid = errors.length === 0;

    // Update Node State in Background (This is a side effect, might move to a hook eventually)
    // For now, we just render the visual feedback

    if (isValid) {
        return (
            <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-700 text-xs font-medium">
                <CheckCircle size={14} />
                <span>Configuration Valid</span>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-100 rounded-lg text-red-700 text-xs font-medium">
                <AlertTriangle size={14} />
                <span>Configuration Issues</span>
            </div>
            <ul className="list-disc list-inside text-[10px] text-red-600 pl-1 space-y-0.5">
                {errors.map((err, i) => (
                    <li key={i}>{err}</li>
                ))}
            </ul>
        </div>
    );
};
