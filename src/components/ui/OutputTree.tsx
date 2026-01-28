import React from 'react';
import { ChevronRight, ChevronDown, Box, Type, Hash, Calendar, List, CheckSquare } from 'lucide-react';

interface SchemaField {
    type: string;
    label: string;
    spec?: SchemaField[]; // For collections/arrays
    name?: string; // Key name
}

interface OutputTreeProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: Record<string, any>;
    className?: string;
}

const TypeIcon = ({ type }: { type: string }) => {
    switch (type) {
        case 'string': return <Type size={12} className="text-green-400" />;
        case 'number': return <Hash size={12} className="text-blue-400" />;
        case 'boolean': return <CheckSquare size={12} className="text-orange-400" />;
        case 'date': return <Calendar size={12} className="text-yellow-400" />;
        case 'array': return <List size={12} className="text-purple-400" />;
        case 'collection': return <Box size={12} className="text-purple-400" />;
        default: return <Box size={12} className="text-slate-400" />;
    }
};

const SchemaItem = ({ name, field, depth = 0 }: { name: string, field: SchemaField | any, depth?: number }) => {
    const [isOpen, setIsOpen] = React.useState(true);
    const hasChildren = field.spec || (field.type === 'collection' && field.spec);

    // Normalize field data (sometimes simplified in registry)
    const type = field.type || 'any';
    const label = field.label || name;

    return (
        <div className="select-none">
            <div
                className={`flex items-center gap-2 py-1 px-2 hover:bg-white/5 rounded cursor-pointer transition-colors`}
                style={{ paddingLeft: `${depth * 12 + 8}px` }}
                onClick={() => setIsOpen(!isOpen)}
            >
                {hasChildren ? (
                    isOpen ? <ChevronDown size={12} className="text-slate-500" /> : <ChevronRight size={12} className="text-slate-500" />
                ) : <span className="w-3" />}

                <TypeIcon type={type} />

                <span className="text-xs font-medium text-slate-300">{label}</span>
                <span className="text-[10px] text-slate-600 font-mono ml-auto">{name}</span>
            </div>

            {hasChildren && isOpen && (
                <div className="border-l border-white/5 ml-3">
                    {Array.isArray(field.spec) ? (
                        field.spec.map((child: any, i: number) => (
                            <SchemaItem key={i} name={child.name} field={child} depth={depth + 1} />
                        ))
                    ) : (
                        // Handle object-style spec if defined that way
                        Object.entries(field.spec).map(([key, val]) => (
                            <SchemaItem key={key} name={key} field={val} depth={depth + 1} />
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export const OutputTree = ({ schema }: OutputTreeProps) => {
    if (!schema || Object.keys(schema).length === 0) {
        return (
            <div className="p-4 text-center text-xs text-slate-500 border border-dashed border-white/10 rounded-lg">
                No output schema defined for this module.
            </div>
        );
    }

    return (
        <div className="space-y-1 font-mono">
            {Object.entries(schema).map(([key, field]) => (
                <SchemaItem key={key} name={key} field={field} />
            ))}
        </div>
    );
};
