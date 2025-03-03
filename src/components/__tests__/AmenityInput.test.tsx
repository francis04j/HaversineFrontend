import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AmenityInput } from '../AmenityInput';

describe('AmenityInput', () => {
  const defaultProps = {
    onAdd: vi.fn(),
    onRemove: vi.fn(),
    customAmenities: ['gym', 'pool']
  };

  it('renders the input field and add button', () => {
    render(<AmenityInput {...defaultProps} />);
    
    expect(screen.getByPlaceholderText('Enter amenity name')).toBeInTheDocument();
    expect(screen.getByText('Add')).toBeInTheDocument();
  });

  it('displays custom amenities', () => {
    render(<AmenityInput {...defaultProps} />);
    
    expect(screen.getByText('gym')).toBeInTheDocument();
    expect(screen.getByText('pool')).toBeInTheDocument();
  });
});