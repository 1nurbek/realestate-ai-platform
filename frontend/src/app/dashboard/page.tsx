'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FiHome, FiHeart, FiMessageSquare, FiPlus } from 'react-icons/fi';
import Button from '@/components/Button';
import { apiClient } from '@/lib/api';

type Stats = {
  myProperties: number;
  favorites: number;
  unreadMessages: number;
  userName: string;
};

export default function DashboardHome() {
  const [stats, setStats] = useState<Stats>({ myProperties: 0, favorites: 0, unreadMessages: 0, userName: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [me, propsRes, favRes, msgRes] = await Promise.all([
          apiClient.get('/users/me'),
          apiClient.get('/properties/my', { params: { page: 1, limit: 1 } }),
          apiClient.get('/favorites'),
          apiClient.get('/messages/unread-count'),
        ]);
        if (cancelled) return;
        const favData = favRes.data?.data;
        const favCount = Array.isArray(favData)
          ? favData.length
          : favData?.pagination?.total || 0;
        setStats({
          userName: me.data?.data?.name || me.data?.data?.user?.name || '',
          myProperties: propsRes.data?.data?.pagination?.total || 0,
          favorites: favCount,
          unreadMessages: msgRes.data?.data?.count || 0,
        });
      } catch {
        // silent
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const cards = [
    { label: 'My Properties', value: stats.myProperties, icon: FiHome, href: '/dashboard/properties' },
    { label: 'Favorites', value: stats.favorites, icon: FiHeart, href: '/dashboard/favorites' },
    { label: 'Unread Messages', value: stats.unreadMessages, icon: FiMessageSquare, href: '/dashboard/messages' },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 rounded-2xl bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back{stats.userName ? `, ${stats.userName.split(' ')[0]}` : ''}!</h1>
          <p className="mt-1 text-sm text-slate-500">Here's a snapshot of your account.</p>
        </div>
        <Link href="/dashboard/properties/new">
          <Button className="gap-2"><FiPlus /> Add Property</Button>
        </Link>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-indigo-300 hover:shadow-sm"
          >
            <card.icon className="text-2xl text-indigo-600" />
            <p className="mt-3 text-xs font-medium uppercase tracking-wide text-slate-500">{card.label}</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{loading ? '-' : card.value}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
