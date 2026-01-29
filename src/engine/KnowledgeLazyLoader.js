"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnowledgeLazyLoader = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
// Lazy Loader for App Documentation
class KnowledgeLazyLoader {
    index = [];
    dbDir;
    constructor() {
        this.dbDir = path_1.default.join(process.cwd(), 'db', 'knowledge_base');
    }
    async init() {
        // Load the full index of 3500 apps if not loaded
        if (this.index.length === 0) {
            try {
                const raw = await promises_1.default.readFile('apps_index.json', 'utf-8');
                this.index = JSON.parse(raw);
            }
            catch (e) {
                console.error("⚠️ LazyLoader: Could not load apps_index.json");
            }
        }
    }
    async ensureAppKnowledge(appSlug) {
        const filePath = path_1.default.join(this.dbDir, `${appSlug}.json`);
        if ((0, fs_1.existsSync)(filePath)) {
            return true; // Knowledge exists
        }
        console.log(`🧠 Knowledge missing for '${appSlug}'. Initiating Lazy Load...`);
        // Find URL in index
        // Priority: *-modules > *
        let appEntry = this.index.find(a => a.slug === `${appSlug}-modules`);
        if (!appEntry) {
            appEntry = this.index.find(a => a.slug === appSlug);
        }
        if (!appEntry) {
            console.error(`❌ App '${appSlug}' not found in global index.`);
            return false;
        }
        // Scrape on demand
        try {
            console.log(`⬇️ Fetching specs from ${appEntry.url}...`);
            const { data: html } = await axios_1.default.get(appEntry.url, { timeout: 10000 });
            const $ = cheerio.load(html);
            const nextDataScript = $('#__NEXT_DATA__').html();
            if (nextDataScript) {
                const nextData = JSON.parse(nextDataScript);
                const doc = nextData.props?.pageProps?._doc;
                if (doc) {
                    await promises_1.default.mkdir(this.dbDir, { recursive: true });
                    await promises_1.default.writeFile(filePath, JSON.stringify(doc, null, 2));
                    console.log(`✅ Knowledge acquired for '${appSlug}'.`);
                    return true;
                }
            }
        }
        catch (error) {
            console.error(`❌ Lazy Load failed: ${error.message}`);
        }
        return false;
    }
}
exports.KnowledgeLazyLoader = KnowledgeLazyLoader;
