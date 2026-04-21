import Link from 'next/link';
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';

const links = [
  { href: '/', label: 'Home' },
  { href: '/properties', label: 'Properties' },
  { href: '/contact', label: 'Contact' },
  { href: '/login', label: 'Login' },
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h3 className="text-lg font-bold text-indigo-700">EstateAI</h3>
          <p className="mt-2 text-sm text-slate-600">
            Smart property discovery with modern tools for buyers, renters, and investors.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-700">Quick Links</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition hover:text-indigo-600">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-700">Follow</h4>
          <div className="mt-3 flex items-center gap-3 text-slate-500">
            <a className="rounded-full border border-slate-200 p-2 transition hover:border-indigo-300 hover:text-indigo-600" href="#" aria-label="Facebook">
              <FiFacebook />
            </a>
            <a className="rounded-full border border-slate-200 p-2 transition hover:border-indigo-300 hover:text-indigo-600" href="#" aria-label="Twitter">
              <FiTwitter />
            </a>
            <a className="rounded-full border border-slate-200 p-2 transition hover:border-indigo-300 hover:text-indigo-600" href="#" aria-label="Instagram">
              <FiInstagram />
            </a>
            <a className="rounded-full border border-slate-200 p-2 transition hover:border-indigo-300 hover:text-indigo-600" href="#" aria-label="LinkedIn">
              <FiLinkedin />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        Copyright {new Date().getFullYear()} EstateAI. All rights reserved.
      </div>
    </footer>
  );
}