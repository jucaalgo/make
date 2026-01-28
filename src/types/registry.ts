export type ParameterType = 'string' | 'number' | 'boolean' | 'bool' | 'select' | 'array' | 'json';

export interface RegistryParameter {
    type: ParameterType;
    label: string;
    required?: boolean;
    default?: string | number | boolean;
    options?: string[]; // For static dropdowns
}

export interface RegistryParameter {
    type: ParameterType;
    label: string;
    required?: boolean;
    default?: string | number | boolean;
    options?: string[]; // For static dropdowns
    multiline?: boolean;
    rpc?: {
        method: string;
        label: string; // Button label e.g. "Load Sheets"
    };
}

export interface RegistrySchema {
    [key: string]: RegistryParameter;
}

export interface RegistryField {
    type: string;
    label: string;
    spec?: RegistryField[] | Record<string, RegistryField>; // For collections/arrays
    name?: string;
}

export interface RegistryMapper {
    [key: string]: RegistryField;
}

export interface RegistryModule {
    id: string; // "google-sheets-watch-rows"
    app: string; // "google-sheets"
    module: string; // "watch-rows"
    label: string; // "Watch Rows"
    description: string;
    icon?: string;
    archetype: 'watcher' | 'action' | 'router' | 'iterator' | 'aggregator';
    parameters: RegistrySchema;
    mapper: RegistryMapper; // Output schema
}

export interface RegistryApp {
    app: string;
    name: string;
    icon: string;
    color: string;
    modules: RegistryModule[];
}
