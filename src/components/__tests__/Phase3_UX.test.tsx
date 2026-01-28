import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ErrorBouncer } from '../ui/ErrorBouncer';
import { FormBuilder } from '../ui/FormBuilder';
import type { RegistrySchema } from '../../types/registry';

// Mock Lucide icons
vi.mock('lucide-react', () => ({
    AlertTriangle: () => <div data-testid="alert-icon" />,
    CheckCircle: () => <div data-testid="check-icon" />,
    RefreshCw: () => <div data-testid="refresh-icon" />,
    Loader2: () => <div data-testid="loader-icon" />,
    ChevronDown: () => <div />,
    ToggleLeft: () => <div />,
    ToggleRight: () => <div />,
    Sparkles: () => <div />,
    AlertCircle: () => <div />,
    CheckCircle2: () => <div />
}));

describe('Phase 3 UX Features', () => {

    describe('ErrorBouncer', () => {
        it('shows valid state when all required fields are present', () => {
            const mockModule: any = {
                parameters: {
                    'name': { type: 'string', label: 'Name', required: true }
                }
            };
            const mockNode = {
                data: {
                    config: { 'name': 'John Doe' }
                }
            };

            render(<ErrorBouncer node={mockNode} registryModule={mockModule} />);
            expect(screen.getByText('Configuration Valid')).toBeInTheDocument();
            expect(screen.getByTestId('check-icon')).toBeInTheDocument();
        });

        it('shows error state when required fields are missing', () => {
            const mockModule: any = {
                parameters: {
                    'apiKey': { type: 'string', label: 'API Key', required: true }
                }
            };
            const mockNode = {
                data: {
                    config: {} // Empty config
                }
            };

            render(<ErrorBouncer node={mockNode} registryModule={mockModule} />);
            expect(screen.getByText('Configuration Issues')).toBeInTheDocument();
            expect(screen.getByText('API Key is required.')).toBeInTheDocument();
        });
    });

    describe('FormBuilder with RPC', () => {
        it('renders RPC Load Button when configured', () => {
            const schema: RegistrySchema = {
                'spreadsheet': {
                    type: 'string',
                    label: 'Spreadsheet',
                    rpc: { method: 'get_sheets', label: 'Load Sheets' }
                }
            };

            render(<FormBuilder data={{}} schema={schema} onChange={vi.fn()} />);

            expect(screen.getByText('Load Sheets')).toBeInTheDocument();
            expect(screen.getByTestId('refresh-icon')).toBeInTheDocument();
        });

        // Note: Full RPC integration test is hard due to async hook mocking in this environment, 
        // relying on manual testing for the actual data fetching animation.
    });
});
