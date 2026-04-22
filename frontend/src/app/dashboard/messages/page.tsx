'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { FiSend } from 'react-icons/fi';
import Button from '@/components/Button';
import { apiClient } from '@/lib/api';
import { readUser } from '@/lib/auth';

type OtherUser = { id: string; name: string; avatar?: string | null };
type PropertyPreview = { id: string; title: string; images?: string[] };

type Conversation = {
  otherUser: OtherUser;
  property: PropertyPreview | null;
  lastMessage: {
    id: string;
    content: string;
    senderId: string;
    read: boolean;
    createdAt: string;
  };
};

type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  propertyId?: string | null;
  content: string;
  read: boolean;
  createdAt: string;
};

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [active, setActive] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingThread, setLoadingThread] = useState(false);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const me = useRef(readUser());

  const fetchConversations = async () => {
    try {
      const res = await apiClient.get('/messages/conversations');
      const list: Conversation[] = res.data?.data || [];
      setConversations(list);
      if (!active && list.length > 0) {
        setActive(list[0]);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load messages.');
    } finally {
      setLoading(false);
    }
  };

  const fetchThread = async (conv: Conversation) => {
    setLoadingThread(true);
    try {
      const params: Record<string, string> = { withUserId: conv.otherUser.id };
      if (conv.property?.id) params.propertyId = conv.property.id;
      const res = await apiClient.get('/messages', { params });
      setMessages(res.data?.data || []);
      // Mark as read
      try {
        const readBody: any = { withUserId: conv.otherUser.id };
        if (conv.property?.id) readBody.propertyId = conv.property.id;
        await apiClient.patch('/messages/read', readBody);
      } catch {
        /* ignore */
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load thread.');
    } finally {
      setLoadingThread(false);
    }
  };

  useEffect(() => {
    fetchConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (active) fetchThread(active);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const send = async (e: FormEvent) => {
    e.preventDefault();
    if (!active || !input.trim()) return;
    setSending(true);
    setError('');
    try {
      const res = await apiClient.post('/messages', {
        receiverId: active.otherUser.id,
        propertyId: active.property?.id,
        content: input.trim(),
      });
      setMessages((prev) => [...prev, res.data?.data]);
      setInput('');
      fetchConversations();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Messages</h1>
        <p className="mt-1 text-sm text-slate-500">Chat with owners and buyers about your properties.</p>
      </header>

      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div>
      )}

      <div className="grid min-h-[480px] overflow-hidden rounded-2xl border border-slate-200 bg-white md:grid-cols-[280px_1fr]">
        <aside className="max-h-[480px] overflow-y-auto border-r border-slate-200">
          {loading ? (
            <div className="p-4 text-sm text-slate-500">Loading...</div>
          ) : conversations.length === 0 ? (
            <div className="p-4 text-sm text-slate-500">No conversations yet.</div>
          ) : (
            conversations.map((conv) => {
              const key = `${conv.otherUser.id}-${conv.property?.id || 'na'}`;
              const isActive =
                active && active.otherUser.id === conv.otherUser.id && active.property?.id === conv.property?.id;
              return (
                <button
                  key={key}
                  onClick={() => setActive(conv)}
                  className={`flex w-full flex-col items-start gap-1 border-b border-slate-100 px-4 py-3 text-left hover:bg-slate-50 ${
                    isActive ? 'bg-indigo-50' : ''
                  }`}
                >
                  <p className="text-sm font-semibold text-slate-900">{conv.otherUser.name}</p>
                  {conv.property && <p className="text-xs text-slate-400">{conv.property.title}</p>}
                  <p className="line-clamp-1 text-xs text-slate-500">{conv.lastMessage.content}</p>
                </button>
              );
            })
          )}
        </aside>

        <section className="flex max-h-[480px] flex-col">
          {active ? (
            <>
              <div className="border-b border-slate-200 bg-white px-4 py-3">
                <p className="text-sm font-semibold text-slate-900">{active.otherUser.name}</p>
                {active.property && <p className="text-xs text-slate-400">About: {active.property.title}</p>}
              </div>
              <div className="flex-1 overflow-y-auto bg-slate-50 p-4">
                {loadingThread ? (
                  <p className="text-sm text-slate-500">Loading...</p>
                ) : messages.length === 0 ? (
                  <p className="text-sm text-slate-500">No messages yet.</p>
                ) : (
                  <ul className="space-y-3">
                    {messages.map((msg) => {
                      const isMine = me.current?.id === msg.senderId;
                      return (
                        <li key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                          <div
                            className={`max-w-[75%] rounded-xl px-3 py-2 text-sm shadow-sm ${
                              isMine ? 'bg-indigo-600 text-white' : 'bg-white text-slate-800'
                            }`}
                          >
                            {msg.content}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
              <form onSubmit={send} className="flex items-center gap-2 border-t border-slate-200 bg-white px-3 py-3">
                <input
                  className="flex-1 rounded-lg border-slate-200 text-sm"
                  placeholder="Type a message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <Button type="submit" disabled={sending || !input.trim()} className="gap-2">
                  <FiSend /> Send
                </Button>
              </form>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-sm text-slate-500">
              {loading ? 'Loading...' : 'Select a conversation to start chatting.'}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
