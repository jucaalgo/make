
import type { IModuleShim, Bundle, ExecutionContext } from './types';

/**
 * GENERIC MODULE DRIVER
 * This class is the "Universal Soldier". It takes a static JSON definition
 * (URL, Method, Headers) and executes it for any App.
 */
export class GenericApiDriver implements IModuleShim {
    public metadata: IModuleShim['metadata'];
    private _definition: any; // The registry entry

    constructor(metadata: IModuleShim['metadata'], definition: any) {
        this.metadata = metadata;
        this._definition = definition;
    }

    public async execute(inputBundles: Bundle[], config: any, context: ExecutionContext): Promise<Bundle[]> {
        // Universal Logic:
        // 1. Loop through Input Bundles (The "Transaction")
        const results: Bundle[] = [];

        for (const bundle of inputBundles) {
            try {
                // 2. Hydrate Configuration (Map {{variables}})
                const hydratedConfig = this.hydrate(config, bundle, context);

                // 3. Prepare Execution (Mock or Real)
                context.logger('info', `   > Processing Bundle for ${this.metadata.label}`, { bundle });

                // SIMULATION LOGIC (Placeholder for Real HTTP)
                // If it's a "Passthrough" (Sleep, Flow Control), return input.
                if (this.metadata.app === 'builtin' || this.metadata.app === 'util') {
                    results.push(bundle); // Passthrough by default
                    continue;
                }

                // If it's an Action (Create Row, Send Email), return a "Result Bundle"
                // Construct output based on Registry "mapper" definition if available
                const output = this.generateOutput(hydratedConfig);
                results.push(output);

            } catch (e: any) {
                context.logger('error', `   x Failed processing bundle: ${(e as Error).message}`);
                // Continue or Throw? Make default is Stop.
                throw e;
            }
        }

        return results;
    }

    private hydrate(config: any, _bundle: Bundle, _context: ExecutionContext): any {
        // TODO: Implement Real interpolation ({{1.value}}).
        // For Alpha, we just return config as is, assuming inputs are pre-mapped.
        return config;
    }

    private generateOutput(config: any): Bundle {
        // Generate a mock output based on the module type.
        // In Step 3 (Integration), this will be replaced by the REAL API response.
        return {
            id: 'gen_' + Math.floor(Math.random() * 10000),
            ...config, // Echo back input configuration as output for verification
            timestamp: new Date().toISOString()
        };
    }
}

/**
 * FACTORY
 * Creates the appropriate driver for a given module name.
 */
export class ModuleDriverFactory {
    private registry: Record<string, any>;

    constructor(registry: Record<string, any>) {
        this.registry = registry;
    }

    public createDriver(moduleName: string): IModuleShim {
        const def = this.registry[moduleName];

        if (!def) {
            throw new Error(`Module definition not found in registry: ${moduleName}`);
        }

        // In the future, we can return Specialized Drivers (GoogleDriveDriver)
        // For now, we return Universal Generic Driver for everything.
        return new GenericApiDriver(
            {
                id: moduleName, // Use module name as ID for shim
                app: def.app,
                label: def.label,
                version: 1
            },
            def
        );
    }
}
