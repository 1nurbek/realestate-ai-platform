'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi';
import Button from './Button';
import { AuthUser, clearAuth, readUser } from '@/lib/auth';

const links = [
  { href: '/', label: 'Home' },
  { href: '/properties', label: 'Properties' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setUser(readUser());
    const onStorage = () => setUser(readUser());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [pathname]);

  const handleLogout = () => {
    clearAuth();
    setUser(null);
    setMenuOpen(false);
    setOpen(false);
    router.push('/');
    router.refresh();
  };

  const isLoggedIn = mounted && !!user;

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
          {isLoggedIn && (
            <Link
              href="/dashboard"
              className={`text-sm font-medium transition hover:text-indigo-600 ${
                pathname?.startsWith('/dashboard') ? 'text-indigo-600' : 'text-slate-600'
              }`}
            >
              Dashboard
            </Link>
          )}
          {isLoggedIn && user?.role === 'ADMIN' && (
            <Link
              href="/admin"
              className={`text-sm font-medium transition hover:text-indigo-600 ${
                pathname?.startsWith('/admin') ? 'text-indigo-600' : 'text-slate-600'
              }`}
            >
              Admin
            </Link>
          )}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-indigo-50 px-3 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
              >
                <FiUser />
                {user?.name?.split(' ')[0] || 'Account'}
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
                  <Link
                    href="/dashboard/profile"
                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                    onClick={() => setMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                    onClick={() => setMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50"
                  >
                    <FiLogOut /> Log out
                  </button>
                </div>
              )}
            </div>
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
            {isLoggedIn && (
              <Link
                href="/dashboard"
                className="block rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                onClick={() => setOpen(false)}
              >
                Dashboard
              </Link>
            )}
            {isLoggedIn && user?.role === 'ADMIN' && (
              <Link
                href="/admin"
                className="block rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                onClick={() => setOpen(false)}
              >
                Admin
              </Link>
            )}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {isLoggedIn ? (
              <Button variant="outline" fullWidth onClick={handleLogout}>
                Log out
              </Button>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)}>
                  <Button variant="outline" fullWidth>
                    Login
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setOpen(false)}>
                  <Button fullWidth>Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
