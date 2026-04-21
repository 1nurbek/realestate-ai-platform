'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { FiMenu, FiX, FiUser } from 'react-icons/fi';
import Button from './Button';

const links = [
  { href: '/', label: 'Home' },
  { href: '/properties', label: 'Properties' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isLoggedIn = false;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-bold text-indigo-700">
          EstateAI
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition hover:text-indigo-600 ${
                pathname === link.href ? 'text-indigo-600' : 'text-slate-600'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {isLoggedIn ? (
            <button className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
              <FiUser />
            </button>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/signup">
                <Button variant="primary">Sign Up</Button>
              </Link>
            </>
          )}
        </div>

        <button
          className="inline-flex items-center justify-center rounded-md p-2 text-slate-700 hover:bg-slate-100 md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle menu"
        >
          {open ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white p-4 md:hidden">
          <div className="space-y-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Link href="/login" onClick={() => setOpen(false)}>
              <Button variant="outline" fullWidth>
                Login
              </Button>
            </Link>
            <Link href="/signup" onClick={() => setOpen(false)}>
              <Button fullWidth>Sign Up</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}