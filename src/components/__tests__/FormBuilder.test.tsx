import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FormBuilder } from '../ui/FormBuilder';
import type { RegistrySchema } from '../../types/registry';

describe('FormBuilder Component', () => {
    const mockOnChange = vi.fn();

    it('renders "No configurable parameters" when schema is empty', () => {
        render(<FormBuilder data={{}} schema={{}} onChange={mockOnChange} />);
        expect(screen.getByText(/No configurable parameters/i)).toBeInTheDocument();
    });

    it('renders input fields based on schema', () => {
        const schema: RegistrySchema = {
            'username': { type: 'string', label: 'Username', required: true },
            'age': { type: 'number', label: 'Age' }
        };

        render(<FormBuilder data={{}} schema={schema} onChange={mockOnChange} />);

        expect(screen.getByPlaceholderText(/enter username/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/enter age/i)).toBeInTheDocument();
        expect(screen.getByText('*')).toBeInTheDocument(); // Required asterisk
    });

    it('renders toggle for boolean fields', () => {
        const schema: RegistrySchema = {
            'isActive': { type: 'boolean', label: 'Is Active' }
        };

        render(<FormBuilder data={{ 'isActive': true }} schema={schema} onChange={mockOnChange} />);

        expect(screen.getByText('Yes')).toBeInTheDocument();
    });
});
