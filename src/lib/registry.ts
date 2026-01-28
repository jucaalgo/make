import registryData from '../data/module_registry.json';
import type { RegistryModule, AppId } from '../types/graph';

// Cast the raw JSON to our Strict Type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const REGISTRY = registryData as Record<string, any>;

export const Registry = {
    /**
     * Get all available modules as an array
     */
    getAllModules: (): RegistryModule[] => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return Object.values(REGISTRY).map((mod: any) => ({
            name: mod.name,
            label: mod.label,
            app: mod.app,
            description: mod.description || '',
            parameters: mod.parameters || {},
            mapper: mod.mapper || {}
        }));
    },

    /**
     * Get all unique Apps (for the sidebar category list)
     */
    getAllApps: (): AppId[] => {
        const apps = new Set<string>();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Object.values(REGISTRY).forEach((mod: any) => {
            if (mod.app) apps.add(mod.app);
        });
        return Array.from(apps).sort();
    },

    /**
     * Find a specific module by ID
     */
    getModule: (id: string): RegistryModule | undefined => {
        const mod = REGISTRY[id];
        if (!mod) return undefined;
        return {
            name: mod.name,
            label: mod.label,
            app: mod.app,
            description: mod.description || '',
            parameters: mod.parameters || {},
            mapper: mod.mapper || {}
        };
    }
};
