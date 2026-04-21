import Button from '@/components/Button';
import PropertyCard, { PropertyCardData } from '@/components/PropertyCard';
import SearchBar from '@/components/SearchBar';
import { FiArrowRight, FiSearch, FiHome, FiKey } from 'react-icons/fi';

const featuredProperties: PropertyCardData[] = [
  { id: '1', title: 'Lakeside Modern Villa', location: 'Austin, TX', price: '$1,250,000', beds: 4, baths: 3, size: 3200, image: 'https://picsum.photos/seed/property1/800/500' },
  { id: '2', title: 'Downtown Skyline Apartment', location: 'Seattle, WA', price: '$690,000', beds: 2, baths: 2, size: 1280, image: 'https://picsum.photos/seed/property2/800/500' },
  { id: '3', title: 'Family Home with Garden', location: 'Denver, CO', price: '$820,000', beds: 3, baths: 2, size: 2100, image: 'https://picsum.photos/seed/property3/800/500' },
  { id: '4', title: 'Ocean View Penthouse', location: 'Miami, FL', price: '$2,100,000', beds: 4, baths: 4, size: 3600, image: 'https://picsum.photos/seed/property4/800/500' },
  { id: '5', title: 'Urban Loft Residence', location: 'Chicago, IL', price: '$560,000', beds: 2, baths: 1, size: 1050, image: 'https://picsum.photos/seed/property5/800/500' },
  { id: '6', title: 'Suburban Smart House', location: 'San Jose, CA', price: '$970,000', beds: 4, baths: 3, size: 2550, image: 'https://picsum.photos/seed/property6/800/500' },
];

const steps = [
  { title: 'Search', description: 'Explore curated listings with intelligent filters and local insights.', icon: FiSearch },
  { title: 'Visit', description: 'Schedule tours and compare homes with transparent market data.', icon: FiHome },
  { title: 'Own', description: 'Close with confidence using a trusted, guided buying experience.', icon: FiKey },
];

export default function HomePage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-gradient-to-r from-indigo-800 via-indigo-700 to-blue-600">
        <div className="absolute inset-0 opacity-20">
          <img src="https://picsum.photos/seed/hero-home/1600/900" alt="Modern home exterior" className="h-full w-full object-cover" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="max-w-3xl text-white">
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">Find Your Dream Home</h1>
            <p className="mt-5 text-base text-indigo-100 sm:text-lg">
              Discover beautiful properties in top neighborhoods with expert guidance at every step.
            </p>
          </div>
          <div className="mt-10 max-w-4xl">
            <SearchBar />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-3xl font-bold text-slate-900">Featured Properties</h2>
          <Button variant="outline" className="gap-2">View all <FiArrowRight /></Button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-slate-900">How It Works</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
                <step.icon className="mx-auto text-3xl text-indigo-600" />
                <h3 className="mt-4 text-xl font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 rounded-2xl bg-indigo-600 p-8 text-white sm:grid-cols-3">
          <div><p className="text-4xl font-bold">8,500+</p><p className="mt-1 text-indigo-100">Properties Listed</p></div>
          <div><p className="text-4xl font-bold">3,200+</p><p className="mt-1 text-indigo-100">Happy Clients</p></div>
          <div><p className="text-4xl font-bold">95+</p><p className="mt-1 text-indigo-100">Cities Covered</p></div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-amber-400 to-orange-500 p-10 text-center text-white">
          <h2 className="text-3xl font-bold">Ready to move into your next home?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-orange-50">
            Browse top-rated listings and connect with trusted agents today.
          </p>
          <div className="mt-6 flex justify-center">
            <Button className="bg-white text-orange-600 hover:bg-orange-50">Get Started</Button>
          </div>
        </div>
      </section>
    </main>
  );
}