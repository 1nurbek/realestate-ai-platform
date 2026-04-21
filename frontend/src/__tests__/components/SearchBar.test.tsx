import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '@/components/SearchBar';

describe('SearchBar', () => {
  test('renders location input and search button', () => {
    render(<SearchBar />);
    expect(screen.getByPlaceholderText(/enter location/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  test('updates location when typing', () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText(/enter location/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Austin' } });
    expect(input.value).toBe('Austin');
  });

  test('renders property type and price selects with options', () => {
    render(<SearchBar />);
    const selects = screen.getAllByRole('combobox');
    expect(selects).toHaveLength(2);
    expect(screen.getByRole('option', { name: 'Any Type' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Any Price' })).toBeInTheDocument();
  });

  test('changes selected property type', () => {
    render(<SearchBar />);
    const typeSelect = screen.getAllByRole('combobox')[0] as HTMLSelectElement;
    fireEvent.change(typeSelect, { target: { value: 'Villa' } });
    expect(typeSelect.value).toBe('Villa');
  });
});
