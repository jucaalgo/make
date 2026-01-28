import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OutputMapper } from '../ui/OutputMapper';
import { useGraphStore } from '../../store/useGraphStore';

// Mock dependencies
vi.mock('../../store/useGraphStore');
vi.mock('../ui/IconResolver', () => ({
    IconResolver: () => <div data-testid="icon" />
}));

// Mock Registry Data to control test environment
vi.mock('../../data/module_registry.json', () => ({
    default: {
        'mock:module': {
            app: 'mock-app',
            label: 'Mock Module',
            mapper: {
                'output_1': { type: 'string', label: 'Output One' },
                'output_2': { type: 'number', label: 'Output Two' }
            }
        }
    }
}));

describe('OutputMapper', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders available upstream nodes', () => {
        // Mock Store State
        (useGraphStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
            nodes: [
                { id: '1', data: { label: 'Node A', module: 'mock:module', app: 'mock-app' } },
                { id: '2', data: { label: 'Node B', module: 'mock:module', app: 'mock-app' } } // Current Node
            ],
            edges: []
        });

        render(<OutputMapper currentNodeId="2" />);

        expect(screen.getByText('Node A')).toBeInTheDocument();
        expect(screen.queryByText('Node B')).not.toBeInTheDocument(); // Should not show itself
    });

    it('generates correct token on dragging', () => {
        (useGraphStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
            nodes: [
                { id: '1', data: { label: 'Node A', module: 'mock:module', app: 'mock-app' } }
            ],
            edges: []
        });

        render(<OutputMapper currentNodeId="2" />);

        // Expand the node
        fireEvent.click(screen.getByText('Node A'));

        const pill = screen.getByText('Output One');

        // Mock DataTransfer
        const dataTransfer = {
            setData: vi.fn(),
            effectAllowed: ''
        };

        fireEvent.dragStart(pill, { dataTransfer });

        expect(dataTransfer.setData).toHaveBeenCalledWith('text/plain', '{{1.output_1}}');
    });

    it('copies token to clipboard on click', async () => {
        (useGraphStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
            nodes: [
                { id: '1', data: { label: 'Node A', module: 'mock:module', app: 'mock-app' } }
            ],
            edges: []
        });

        Object.assign(navigator, {
            clipboard: {
                writeText: vi.fn(),
            },
        });

        render(<OutputMapper currentNodeId="2" />);
        fireEvent.click(screen.getByText('Node A')); // Expand
        fireEvent.click(screen.getByText('Output One')); // Click pill

        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('{{1.output_1}}');
    });
});
