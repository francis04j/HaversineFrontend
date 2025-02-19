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

  it('calls onAdd when submitting a new amenity', async () => {
    const user = userEvent.setup();
    render(<AmenityInput {...defaultProps} />);
    
    const input = screen.getByPlaceholderText('Enter amenity name');
    await user.type(input, 'playground');
    await user.click(screen.getByText('Add'));
    
    expect(defaultProps.onAdd).toHaveBeenCalledWith('playground');
    expect(input).toHaveValue('');
  });

  it('does not call onAdd when submitting empty input', async () => {
    const user = userEvent.setup();
    render(<AmenityInput {...defaultProps} />);
    
    await user.click(screen.getByText('Add'));
    
    expect(defaultProps.onAdd).not.toHaveBeenCalled();
  });

  it('calls onRemove when clicking remove button', async () => {
    const user = userEvent.setup();
    render(<AmenityInput {...defaultProps} />);
    
    const removeButtons = screen.getAllByRole('button', { name: '' });
    await user.click(removeButtons[0]); // Click first remove button
    
    expect(defaultProps.onRemove).toHaveBeenCalledWith('gym');
  });

  it('trims whitespace from input before adding', async () => {
    const user = userEvent.setup();
    render(<AmenityInput {...defaultProps} />);
    
    const input = screen.getByPlaceholderText('Enter amenity name');
    await user.type(input, '  playground  ');
    await user.click(screen.getByText('Add'));
    
    expect(defaultProps.onAdd).toHaveBeenCalledWith('playground');
  });

  it('converts input to lowercase before adding', async () => {
    const user = userEvent.setup();
    render(<AmenityInput {...defaultProps} />);
    
    const input = screen.getByPlaceholderText('Enter amenity name');
    await user.type(input, 'PLAYGROUND');
    await user.click(screen.getByText('Add'));
    
    expect(defaultProps.onAdd).toHaveBeenCalledWith('playground');
  });

  it('handles form submission with Enter key', async () => {
    const user = userEvent.setup();
    render(<AmenityInput {...defaultProps} />);
    
    const input = screen.getByPlaceholderText('Enter amenity name');
    await user.type(input, 'playground{enter}');
    
    expect(defaultProps.onAdd).toHaveBeenCalledWith('playground');
  });

  it('shows custom amenities section only when amenities exist', () => {
    const { rerender } = render(<AmenityInput {...defaultProps} />);
    
    expect(screen.getByText('Custom Amenities:')).toBeInTheDocument();
    
    rerender(<AmenityInput onAdd={defaultProps.onAdd} onRemove={defaultProps.onRemove} customAmenities={[]} />);
    
    expect(screen.queryByText('Custom Amenities:')).not.toBeInTheDocument();
  });
});