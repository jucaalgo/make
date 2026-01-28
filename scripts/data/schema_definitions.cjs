// schema_definitions.js
// DICTIONARY OF INFERRED SCHEMAS FOR 70 APP CATEGORIES
// Created by @Investigador (Pattern Inference)

module.exports = {
    // --- ARCHETYPE: GOOGLE SUITE ---
    // High fidelity schemas for Google Apps
    'google-sheets': {
        'addRow': { parameters: { spreadsheetId: { type: 'string', label: 'Spreadsheet ID', required: true }, sheetName: { type: 'string', label: 'Sheet Name', required: true }, values: { type: 'array', label: 'Values' } } },
        'watchRows': { parameters: { spreadsheetId: { type: 'string', label: 'Spreadsheet ID', required: true }, limit: { type: 'number', label: 'Limit', default: 10 } } },
        'default': { parameters: { spreadsheetId: { type: 'string', label: 'Spreadsheet ID', required: true } } }
    },
    'google-drive': {
        'uploadFile': { parameters: { fileData: { type: 'buffer', label: 'File Data', required: true }, fileName: { type: 'string', label: 'File Name', required: true }, folderId: { type: 'string', label: 'Folder ID' } } },
        'default': { parameters: { fileId: { type: 'string', label: 'File ID', required: true } } }
    },
    'gmail': {
        'sendEmail': { parameters: { to: { type: 'array', label: 'To', required: true }, subject: { type: 'string', label: 'Subject', required: true }, content: { type: 'string', label: 'Content', multiline: true } } },
        'default': { parameters: { messageId: { type: 'string', label: 'Message ID', required: true } } }
    },
    'google-calendar': {
        'createAnEvent': { parameters: { calendarId: { type: 'string', label: 'Calendar ID', required: true }, summary: { type: 'string', label: 'Summary', required: true }, start: { type: 'date', label: 'Start Time' }, end: { type: 'date', label: 'End Time' } } },
        'default': { parameters: { calendarId: { type: 'string', label: 'Calendar ID', required: true } } }
    },

    // --- ARCHETYPE: MESSAGING / SOCIAL ---
    'slack': {
        'postMessage': { parameters: { channelId: { type: 'string', label: 'Channel ID', required: true }, text: { type: 'string', label: 'Text', multiline: true } } },
        'default': { parameters: { channelId: { type: 'string', label: 'Channel ID' } } }
    },
    'discord': {
        'postMessage': { parameters: { channelId: { type: 'string', label: 'Channel ID', required: true }, content: { type: 'string', label: 'Content', multiline: true } } },
        'default': { parameters: { guildId: { type: 'string', label: 'Guild ID' } } }
    },
    'telegram': {
        'sendMessage': { parameters: { chatId: { type: 'string', label: 'Chat ID', required: true }, text: { type: 'string', label: 'Text', multiline: true } } },
        'default': { parameters: { chatId: { type: 'string', label: 'Chat ID', required: true } } }
    },
    'twitter-v2': {
        'createTweet': { parameters: { text: { type: 'string', label: 'Tweet Text', required: true, multiline: true } } },
        'default': { parameters: { tweetId: { type: 'string', label: 'Tweet ID' } } }
    },
    'whatsapp-business': {
        'sendMessage': { parameters: { to: { type: 'string', label: 'Phone Number', required: true }, body: { type: 'string', label: 'Message Body' } } },
        'default': { parameters: { messageId: { type: 'string', label: 'Message ID' } } }
    },

    // --- ARCHETYPE: CRM / SALES ---
    'hubspotcrm': {
        'createDeal': { parameters: { dealName: { type: 'string', label: 'Deal Name', required: true }, amount: { type: 'number', label: 'Amount' }, pipeline: { type: 'string', label: 'Pipeline' } } },
        'createOrUpdateContact': { parameters: { email: { type: 'string', label: 'Email', required: true }, firstname: { type: 'string', label: 'First Name' }, lastname: { type: 'string', label: 'Last Name' } } },
        'default': { parameters: { objectId: { type: 'string', label: 'Object ID' }, properties: { type: 'collection', label: 'Properties' } } }
    },
    'salesforce': {
        'createRecord': { parameters: { object: { type: 'string', label: 'Object Type', required: true }, fields: { type: 'collection', label: 'Fields' } } },
        'default': { parameters: { recordId: { type: 'string', label: 'Record ID', required: true } } }
    },
    'pipedrive': {
        'createDeal': { parameters: { title: { type: 'string', label: 'Title', required: true }, value: { type: 'number', label: 'Value' } } },
        'default': { parameters: { id: { type: 'number', label: 'ID', required: true } } }
    },
    'zoho-crm': {
        'default': { parameters: { module: { type: 'string', label: 'Module Name', required: true }, data: { type: 'collection', label: 'Data', required: true } } }
    },

    // --- ARCHETYPE: PROJECT MANAGEMENT ---
    'trello': {
        'createCard': { parameters: { listId: { type: 'string', label: 'List ID', required: true }, name: { type: 'string', label: 'Card Name', required: true }, desc: { type: 'string', label: 'Description', multiline: true } } },
        'default': { parameters: { boardId: { type: 'string', label: 'Board ID' } } }
    },
    'notion': {
        'createDatabaseItem': { parameters: { databaseId: { type: 'string', label: 'Database ID', required: true }, properties: { type: 'collection', label: 'Properties', required: true } } },
        'default': { parameters: { pageId: { type: 'string', label: 'Page ID' } } }
    },
    'asana': {
        'createTask': { parameters: { projectId: { type: 'string', label: 'Project ID' }, name: { type: 'string', label: 'Task Name', required: true } } },
        'default': { parameters: { taskId: { type: 'string', label: 'Task ID' } } }
    },
    'clickup': {
        'createTask': { parameters: { listId: { type: 'string', label: 'List ID', required: true }, name: { type: 'string', label: 'Task Name', required: true } } },
        'default': { parameters: { taskId: { type: 'string', label: 'Task ID' } } }
    },
    'monday': {
        'createItem': { parameters: { boardId: { type: 'string', label: 'Board ID', required: true }, itemName: { type: 'string', label: 'Item Name', required: true } } },
        'default': { parameters: { itemId: { type: 'string', label: 'Item ID' } } }
    },

    // --- ARCHETYPE: AI / ML ---
    'openai-gpt-3': {
        'createCompletion': { parameters: { model: { type: 'select', options: ['gpt-4', 'gpt-3.5-turbo'], required: true }, messages: { type: 'array', label: 'Messages', required: true } } },
        'default': { parameters: { prompt: { type: 'string', label: 'Prompt' } } }
    },
    'gemini-ai': {
        'default': { parameters: { model: { type: 'string', default: 'gemini-pro' }, prompt: { type: 'string', label: 'Prompt', multiline: true } } }
    },
    'anthropic-claude': {
        'default': { parameters: { model: { type: 'string', default: 'claude-3-opus' }, messages: { type: 'array', label: 'Messages' } } }
    },

    // --- ARCHETYPE: E-COMMERCE ---
    'shopify': {
        'createProduct': { parameters: { title: { type: 'string', label: 'Title', required: true }, price: { type: 'number', label: 'Price' } } },
        'default': { parameters: { id: { type: 'number', label: 'ID' } } }
    },
    'woocommerce': {
        'createOrder': { parameters: { lineItems: { type: 'array', label: 'Line Items' } } },
        'default': { parameters: { id: { type: 'number', label: 'ID' } } }
    },
    'magento2': {
        'default': { parameters: { searchCriteria: { type: 'collection', label: 'Search Criteria' } } }
    },

    // --- ARCHETYPE: UTILITIES / DEV ---
    'http': {
        'request': { parameters: { url: { type: 'string', label: 'URL', required: true }, method: { type: 'select', options: ['GET', 'POST', 'PUT', 'DELETE'], default: 'GET' }, body: { type: 'string', label: 'Body' } } },
        'default': { parameters: { url: { type: 'string', label: 'URL', required: true } } }
    },
    'json': {
        'ParseJSON': { parameters: { json: { type: 'string', label: 'JSON String', required: true, multiline: true } } },
        'CreateJSON': { parameters: { dataObject: { type: 'collection', label: 'Data Object' } } },
        'default': { parameters: {} }
    },
    'xml': {
        'ParseXML': { parameters: { xml: { type: 'string', label: 'XML String', required: true } } },
        'default': { parameters: {} }
    },
    'builtin': {
        'BasicRouter': { parameters: { routes: { type: 'array', label: 'Routes' } } },
        'Iterator': { parameters: { array: { type: 'array', label: 'Array', required: true } } },
        'Sleep': { parameters: { delay: { type: 'number', label: 'Delay (s)', required: true } } },
        'SetVariable': { parameters: { name: { type: 'string', label: 'Name' }, value: { type: 'any', label: 'Value' } } },
        'GetVariable': { parameters: { name: { type: 'string', label: 'Name' } } },
        'default': { parameters: {} }
    }
};
