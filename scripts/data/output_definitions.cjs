// output_definitions.cjs
// DICTIONARY OF OUTPUT BUNDLES (MAPPERS)
// Created by @Architect & @Investigador

module.exports = {
    // --- HIGH FIDELITY (BASED ON SCREENSHOTS & API KNOWLEDGE) ---

    'instagram-business': {
        'getUserInsights': {
            mapper: {
                id: { type: 'string', label: 'ID' },
                name: { type: 'string', label: 'Name' },
                period: { type: 'string', label: 'Period' },
                title: { type: 'string', label: 'Title' },
                description: { type: 'string', label: 'Description' },
                total_value: {
                    type: 'collection', label: 'Total Value', spec: [
                        { name: 'value', type: 'number', label: 'Value' },
                        { name: 'end_time', type: 'date', label: 'End Time' }
                    ]
                },
                values: { type: 'array', label: 'Values' }
            }
        },
        'createPhotoPost': {
            mapper: {
                id: { type: 'string', label: 'Media ID' },
                ig_id: { type: 'string', label: 'Instagram ID' }
            }
        }
    },

    'google-sheets': {
        'addRow': {
            mapper: {
                spreadsheetId: { type: 'string', label: 'Spreadsheet ID' },
                tableRange: { type: 'string', label: 'Table Range' },
                updates: {
                    type: 'collection', label: 'Updates', spec: [
                        { name: 'spreadsheetId', type: 'string', label: 'Spreadsheet ID' },
                        { name: 'updatedRange', type: 'string', label: 'Updated Range' },
                        { name: 'updatedRows', type: 'number', label: 'Updated Rows' },
                        { name: 'updatedColumns', type: 'number', label: 'Updated Columns' },
                        { name: 'updatedCells', type: 'number', label: 'Updated Cells' }
                    ]
                }
            }
        },
        'watchRows': {
            mapper: {
                rowNumber: { type: 'number', label: 'Row Number' },
                data: { type: 'array', label: 'Row Data', description: 'Array of cell values' }
            }
        }
    },

    'openai-gpt-3': {
        'createCompletion': {
            mapper: {
                id: { type: 'string', label: 'ID' },
                object: { type: 'string', label: 'Object' },
                created: { type: 'number', label: 'Created At' },
                model: { type: 'string', label: 'Model' },
                choices: {
                    type: 'array', label: 'Choices', spec: [
                        { name: 'text', type: 'string', label: 'Text' },
                        { name: 'index', type: 'number', label: 'Index' },
                        { name: 'logprobs', type: 'any', label: 'Logprobs' },
                        { name: 'finish_reason', type: 'string', label: 'Finish Reason' }
                    ]
                },
                usage: {
                    type: 'collection', label: 'Usage', spec: [
                        { name: 'prompt_tokens', type: 'number', label: 'Prompt Tokens' },
                        { name: 'completion_tokens', type: 'number', label: 'Completion Tokens' },
                        { name: 'total_tokens', type: 'number', label: 'Total Tokens' }
                    ]
                }
            }
        }
    },

    'gmail': {
        'sendEmail': {
            mapper: {
                messageId: { type: 'string', label: 'Message ID' },
                threadId: { type: 'string', label: 'Thread ID' },
                labelIds: { type: 'array', label: 'Label IDs' }
            }
        },
        'watchEmail': {
            mapper: {
                id: { type: 'string', label: 'Message ID' },
                threadId: { type: 'string', label: 'Thread ID' },
                snippet: { type: 'string', label: 'Snippet' },
                historyId: { type: 'string', label: 'History ID' },
                internalDate: { type: 'string', label: 'Internal Date' },
                payload: {
                    type: 'collection', label: 'Payload', spec: [
                        { name: 'headers', type: 'array', label: 'Headers' },
                        { name: 'body', type: 'string', label: 'Body' }
                    ]
                }
            }
        }
    },

    'slack': {
        'postMessage': {
            mapper: {
                ok: { type: 'boolean', label: 'OK' },
                channel: { type: 'string', label: 'Channel ID' },
                ts: { type: 'string', label: 'Timestamp' },
                message: {
                    type: 'collection', label: 'Message Object', spec: [
                        { name: 'text', type: 'string', label: 'Text' },
                        { name: 'user', type: 'string', label: 'User ID' },
                        { name: 'bot_id', type: 'string', label: 'Bot ID' }
                    ]
                }
            }
        }
    },

    // --- SCIENTIFIC ARCHETYPES (FOR LONG TAIL) ---

    // Archetype: CREATOR (Rest API POST response)
    // Used for: createRecord, addRow, sendEmail, uploadFile
    _ARCHETYPE_CREATOR: {
        mapper: {
            id: { type: 'string', label: 'ID' },
            createdAt: { type: 'date', label: 'Created At' },
            status: { type: 'string', label: 'Status' },
            link: { type: 'string', label: 'Link' } // Often a direct link to the new resource
        }
    },

    // Archetype: WATCHER (Webhook/Polling)
    // Used for: watchEvents, newEmail, newRow
    _ARCHETYPE_WATCHER: {
        mapper: {
            event: { type: 'string', label: 'Event Type' },
            id: { type: 'string', label: 'Resource ID' },
            timestamp: { type: 'date', label: 'Timestamp' },
            payload: { type: 'any', label: 'Full Payload (Raw)' }
        }
    },

    // Archetype: SEARCHER (GET List)
    // Used for: searchRows, listFiles, getContacts
    _ARCHETYPE_SEARCHER: {
        mapper: {
            total: { type: 'number', label: 'Total Results' },
            data: {
                type: 'array', label: 'Results', spec: [
                    { name: 'id', type: 'string', label: 'ID' },
                    { name: 'name', type: 'string', label: 'Name' },
                    { name: 'updatedAt', type: 'date', label: 'Updated At' }
                ]
            } // Array of objects
        }
    },

    // Archetype: GENERIC
    _ARCHETYPE_GENERIC: {
        mapper: {
            id: { type: 'string', label: 'ID' },
            data: { type: 'any', label: 'Output Data' },
            success: { type: 'boolean', label: 'Success' }
        }
    }
};
