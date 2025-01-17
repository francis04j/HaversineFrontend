import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import AmenityInput from '../AmenityInput';

describe('AmenityInput', () => {
    const defaultProps = {
        onAdd: vi.fn(),
        onRemove: vi.fn(),
        customAmenities: ['gym', 'pool', 'wifi']
    };

    it('renders the input field', () => {
        render(<AmenityInput {...defaultProps} />);
        expect(screen.getByPlaceholderText('Enter amenity name')).toBeInTheDocument();
    });
});
