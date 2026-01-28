import { useState, useCallback } from 'react';

// Mock Data Database
const MOCK_DB: Record<string, string[]> = {
    'get_spreadsheets': ['Sales Data 2024', 'Employees Q1', 'Marketing Outreach', 'Inventory Master'],
    'get_sheets': ['Sheet1', 'Customers', 'Orders', 'Summary'],
    'get_models': ['gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo', 'gpt-3.5-turbo-16k'],
    'get_folders': ['Inbox', 'Sent', 'Spam', 'Drafts', 'Important'],
    'get_channels': ['#general', '#random', '#alerts', '#marketing', '#dev-team']
};

export const useMockRpc = () => {
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    const callRpc = useCallback(async (method: string) => {
        setLoading(true);
        setError(null);
        setOptions([]);

        // Simulate Network Delay (500ms - 1500ms)
        const delay = 500 + Math.random() * 1000;

        return new Promise<string[]>((resolve, reject) => {
            setTimeout(() => {
                const data = MOCK_DB[method];
                if (data) {
                    setOptions(data);
                    setLoading(false);
                    resolve(data);
                } else {
                    const err = `RPC Method '${method}' not found on mock server.`;
                    setError(err);
                    setLoading(false);
                    reject(err);
                }
            }, delay);
        });
    }, []);

    return { loading, options, error, callRpc };
};
