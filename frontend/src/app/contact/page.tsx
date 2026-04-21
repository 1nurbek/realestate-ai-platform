import Button from '@/components/Button';
import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi';

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Contact Us</h1>
        <p className="mt-2 text-slate-600">Have a question? We would love to hear from you.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <form className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
              <input className="w-full rounded-lg border-slate-200 text-sm" placeholder="Your full name" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
              <input type="email" className="w-full rounded-lg border-slate-200 text-sm" placeholder="name@email.com" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Subject</label>
              <input className="w-full rounded-lg border-slate-200 text-sm" placeholder="How can we help?" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Message</label>
              <textarea className="h-36 w-full rounded-lg border-slate-200 text-sm" placeholder="Write your message..." />
            </div>
            <Button type="submit">Send Message</Button>
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
          <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-100 text-slate-500">
            Embedded map placeholder
          </div>
        </aside>
      </div>
    </main>
  );
}