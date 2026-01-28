const fs = require('fs');
const path = require('path');

const REGISTRY_PATH = path.join(__dirname, '../src/data/module_registry.json');
const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));

// ------------------------------------------------------------------
// 1. DEFINITIONS (Corrected Keys + Missing Modules)
// ------------------------------------------------------------------

const SCHEMAS = {
    // --- GOOGLE SHEETS ---
    'google-sheets:addRow': {
        app: 'google-sheets',
        label: 'Add a Row',
        parameters: {
            spreadsheetId: { type: 'string', label: 'Spreadsheet ID', required: true, description: 'Select from list or enter ID' },
            sheetName: { type: 'string', label: 'Sheet Name', required: true },
            values: { type: 'array', label: 'Values', description: 'Array of values for the row' },
            valueInputOption: { type: 'select', label: 'Value Input Option', options: ['RAW', 'USER_ENTERED'], default: 'USER_ENTERED' }
        }
    },
    'google-sheets:watchRows': {
        app: 'google-sheets',
        label: 'Watch Rows',
        parameters: {
            spreadsheetId: { type: 'string', label: 'Spreadsheet ID', required: true },
            sheetName: { type: 'string', label: 'Sheet Name', required: true },
            limit: { type: 'number', label: 'Limit', default: 10 }
        }
    },

    // --- GMAIL (NEWLY ADDED) ---
    'gmail:sendEmail': {
        app: 'gmail',
        label: 'Send an Email',
        name: 'gmail:sendEmail',
        description: 'Sends an email to specified recipients',
        parameters: {
            to: { type: 'array', label: 'To', required: true, description: 'Email addresses' },
            subject: { type: 'string', label: 'Subject', required: true },
            content: { type: 'string', label: 'Content', multiline: true },
            attachments: { type: 'array', label: 'Attachments' }
        }
    },
    'gmail:watchEmail': {
        app: 'gmail',
        label: 'Watch Emails',
        name: 'gmail:watchEmail',
        description: 'Triggers when a new email is received',
        parameters: {
            folder: { type: 'string', label: 'Folder', default: 'INBOX' },
            criteria: { type: 'string', label: 'Query', description: 'e.g. is:unread' },
            markAsRead: { type: 'boolean', label: 'Mark as Read', default: false }
        }
    },

    // --- SLACK ---
    'slack:postMessage': {
        app: 'slack',
        label: 'Create a Message',
        parameters: {
            channelId: { type: 'string', label: 'Channel ID / User ID', required: true },
            text: { type: 'string', label: 'Text', multiline: true, required: true }
        }
    },

    // --- OPENAI ---
    'openai-gpt-3:createCompletion': {
        app: 'openai-gpt-3',
        label: 'Create a Completion',
        parameters: {
            model: { type: 'select', label: 'Model', options: ['gpt-4-turbo', 'gpt-3.5-turbo'], default: 'gpt-4-turbo', required: true },
            messages: {
                type: 'array',
                label: 'Messages',
                spec: [
                    { name: 'role', type: 'select', options: ['system', 'user', 'assistant'] },
                    { name: 'content', type: 'string', multiline: true }
                ],
                required: true
            },
            temperature: { type: 'number', label: 'Temperature', default: 0.7, min: 0, max: 2 },
            max_tokens: { type: 'number', label: 'Max Tokens' }
        }
    },

    // --- BUILT-IN TOOLS ---
    'builtin:BasicRouter': {
        parameters: {
            routes: { type: 'array', label: 'Routes', description: 'Define conditions for each path' }
        }
    },
    'builtin:Iterator': {
        app: 'builtin',
        label: 'Iterator',
        parameters: {
            array: { type: 'array', label: 'Array', required: true, description: 'The array to iterate over' }
        }
    },
    'builtin:BasicAggregator': {
        parameters: {
            sourceModule: { type: 'string', label: 'Source Module', required: true },
            targetField: { type: 'string', label: 'Target Field' }
        }
    }
};

// ------------------------------------------------------------------
// 2. PATCHING OR CREATING
// ------------------------------------------------------------------

let patchCount = 0;
let createCount = 0;

Object.entries(SCHEMAS).forEach(([key, schema]) => {
    let targetKey = key;

    // Fuzzy search first
    if (!registry[key]) {
        if (schema.app) {
            // Only try fuzzy if we have an app hint, but mostly we rely on explicit keys now
            const [app, mod] = key.split(':');
            const fuzzy = Object.values(registry).find(r => r.app === app && r.name.includes(mod || ''));
            if (fuzzy) targetKey = fuzzy.name;
        }
    }

    if (registry[targetKey]) {
        // PATCH
        registry[targetKey].parameters = schema.parameters;
        if (!registry[targetKey].mapper) registry[targetKey].mapper = {};
        console.log(`✅ Patched ${targetKey}`);
        patchCount++;
    } else {
        // CREATE
        if (schema.app && schema.label) {
            registry[key] = {
                name: key,
                app: schema.app,
                label: schema.label,
                description: schema.description || `Action: ${schema.label}`,
                parameters: schema.parameters,
                mapper: {}
            };
            console.log(`✨ Created ${key}`);
            createCount++;
        } else {
            console.warn(`⚠️ Could not find or create ${key} (Missing definitions)`);
        }
    }
});

// ------------------------------------------------------------------
// 3. SAVE
// ------------------------------------------------------------------

fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2));
console.log(`\n🎉 Results: Patched ${patchCount}, Created ${createCount}, Total Active: ${Object.keys(registry).length}`);
