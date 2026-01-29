
import fs from 'fs/promises';
import path from 'path';

async function verifyCounts() {
    console.log("🔍 INSPECCIONANDO REGISTRO DE MÓDULOS...\n");

    const registryPath = path.join(process.cwd(), 'src', 'data', 'module_registry.json');

    try {
        const data = await fs.readFile(registryPath, 'utf-8');
        const registry = JSON.parse(data);

        const totalModules = Object.keys(registry).length;
        const uniqueApps = new Set(Object.values(registry).map((m: any) => m.app));

        console.log(`📊 REPORTE DE DATOS:`);
        console.log(`   -----------------`);
        console.log(`   📦 MÓDULOS TOTALES (Acciones/Triggers): ${totalModules}`);
        console.log(`   📱 APPS ÚNICAS (ActiveCampaign, Drive, etc): ${uniqueApps.size}`);
        console.log(`   -----------------\n`);

        console.log("📝 Ejemplo de Apps encontradas:");
        console.log(Array.from(uniqueApps).slice(0, 5).join(', ') + '...');

    } catch (error) {
        console.error("❌ Error leyendo el registro:", error);
    }
}

verifyCounts();
