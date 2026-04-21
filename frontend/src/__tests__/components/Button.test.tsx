import { render, screen, fireEvent } from '@testing-library/react';
import Button from '@/components/Button';

describe('Button', () => {
  test('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  test('applies primary variant by default', () => {
    render(<Button>Go</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toMatch(/bg-indigo-600/);
  });

  test('applies secondary variant', () => {
    render(<Button variant="secondary">Go</Button>);
    expect(screen.getByRole('button').className).toMatch(/bg-amber-500/);
  });

  test('fires onClick', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Press</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('respects disabled prop', () => {
    render(<Button disabled>Nope</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
