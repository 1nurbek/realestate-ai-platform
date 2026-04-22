'use client';

import { FormEvent, useState } from 'react';
import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
import Button from '@/components/Button';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const onChange = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.name || !form.email || !form.message) {
      setError('Please fill in your name, email, and message.');
      return;
    }
    setSubmitting(true);
    try {
      // Fallback: open default mail client pre-filled.
      const body = `From: ${form.name} <${form.email}>%0D%0A%0D%0A${encodeURIComponent(form.message)}`;
      const subject = encodeURIComponent(form.subject || 'Website inquiry');
      window.location.href = `mailto:support@estateai.com?subject=${subject}&body=${body}`;
      setSuccess('Thanks! Your email client should now open a pre-filled message. Or reach us at support@estateai.com.');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setError('Unable to open email client. Please email support@estateai.com directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Contact Us</h1>
        <p className="mt-2 text-slate-600">Have a question? We would love to hear from you.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <form className="space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
              <input className="w-full rounded-lg border-slate-200 text-sm" value={form.name} onChange={onChange('name')} placeholder="Your full name" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
              <input type="email" className="w-full rounded-lg border-slate-200 text-sm" value={form.email} onChange={onChange('email')} placeholder="name@email.com" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Subject</label>
              <input className="w-full rounded-lg border-slate-200 text-sm" value={form.subject} onChange={onChange('subject')} placeholder="How can we help?" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Message</label>
              <textarea className="h-36 w-full rounded-lg border-slate-200 text-sm" value={form.message} onChange={onChange('message')} placeholder="Write your message..." />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            {success && <p className="text-sm text-emerald-700">{success}</p>}
            <Button type="submit" disabled={submitting}>{submitting ? 'Sending...' : 'Send Message'}</Button>
          </form>
        </section>

        <aside className="space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-semibold text-slate-900">Contact Info</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <p className="flex items-center gap-2"><FiMapPin /> 100 Market Street, San Francisco, CA</p>
              <p className="flex items-center gap-2"><FiPhone /> +1 (555) 920-1100</p>
              <p className="flex items-center gap-2"><FiMail /> support@estateai.com</p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
