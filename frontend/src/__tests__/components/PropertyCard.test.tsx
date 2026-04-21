import { render, screen } from '@testing-library/react';
import PropertyCard, { PropertyCardData } from '@/components/PropertyCard';

jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

const property: PropertyCardData = {
  id: 'p1',
  title: 'Modern Loft',
  location: 'Austin, TX',
  price: '$450,000',
  beds: 2,
  baths: 2,
  size: 1200,
  image: 'https://example.com/img.jpg',
};

describe('PropertyCard', () => {
  test('renders property details', () => {
    render(<PropertyCard property={property} />);
    expect(screen.getByText('Modern Loft')).toBeInTheDocument();
    expect(screen.getByText('Austin, TX')).toBeInTheDocument();
    expect(screen.getByText('$450,000')).toBeInTheDocument();
    expect(screen.getByText(/2 Beds/)).toBeInTheDocument();
    expect(screen.getByText(/2 Baths/)).toBeInTheDocument();
    expect(screen.getByText(/1200 sqft/)).toBeInTheDocument();
  });

  test('links to the property detail page', () => {
    render(<PropertyCard property={property} />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/properties/p1');
  });

  test('renders the image with alt text', () => {
    render(<PropertyCard property={property} />);
    const img = screen.getByAltText('Modern Loft') as HTMLImageElement;
    expect(img.src).toContain('example.com/img.jpg');
  });
});
