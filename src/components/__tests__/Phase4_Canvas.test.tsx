import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ContextMenu } from '../ui/ContextMenu';
import { FloatingToolbar } from '../ui/FloatingToolbar';

// Mock dependencies
vi.mock('../../store/useGraphStore', () => ({
    useGraphStore: (selector: any) => {
        // Mock addModule function for simplified testing
        return selector({ addModule: vi.fn() });
    }
}));

// Mock Lucide icons
vi.mock('lucide-react', () => ({
    Zap: () => <div data-testid="zap-icon" />,
    Plus: () => <div data-testid="plus-icon" />,
    Play: () => <div data-testid="play-icon" />,
    Save: () => <div data-testid="save-icon" />,
    LayoutGrid: () => <div />,
    Copy: () => <div />,
    Trash2: () => <div />,
    MousePointer2: () => <div />
}));

describe('Phase 4 Canvas Components', () => {

    describe('ContextMenu', () => {
        it('renders quick actions', () => {
            render(
                <ContextMenu
                    top={100}
                    left={100}
                    right={undefined}
                    bottom={undefined}
                    onClose={vi.fn()}
                    position={{ x: 0, y: 0 }}
                />
            );

            expect(screen.getByText('Quick Actions')).toBeInTheDocument();
            expect(screen.getByText('Add Trigger')).toBeInTheDocument();
            expect(screen.getByText('Add Action')).toBeInTheDocument();
        });

        it('calls onClose when an option is clicked', () => {
            const onClose = vi.fn();
            render(
                <ContextMenu
                    top={100}
                    left={100}
                    right={undefined}
                    bottom={undefined}
                    onClose={onClose}
                    position={{ x: 0, y: 0 }}
                />
            );

            fireEvent.click(screen.getByText('Add Trigger'));
            expect(onClose).toHaveBeenCalled();
        });
    });

    describe('FloatingToolbar', () => {
        it('renders run and save buttons', () => {
            render(<FloatingToolbar />);

            expect(screen.getByText('Run')).toBeInTheDocument();
            expect(screen.getByText('Save')).toBeInTheDocument();
        });

        it('toggles running state on click', () => {
            render(<FloatingToolbar />);

            const runBtn = screen.getByText('Run');
            fireEvent.click(runBtn);

            expect(screen.getByText('Running...')).toBeInTheDocument();
        });
    });

});
