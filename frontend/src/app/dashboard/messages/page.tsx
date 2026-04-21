"use client";

import { useMemo, useState } from "react";
import MessageBubble from "@/components/dashboard/MessageBubble";

type Message = {
  id: string;
  text: string;
  time: string;
  sentByCurrentUser: boolean;
};

type Conversation = {
  id: string;
  contact: string;
  preview: string;
  time: string;
  unread: number;
  messages: Message[];
};

const mockConversations: Conversation[] = [
  {
    id: "c1",
    contact: "Sophie Carter",
    preview: "Is the apartment still available this weekend?",
    time: "10:42 AM",
    unread: 2,
    messages: [
      { id: "1", text: "Hi, is the apartment still available this weekend?", time: "10:40 AM", sentByCurrentUser: false },
      { id: "2", text: "Yes, it is available. Would you like to schedule a visit?", time: "10:41 AM", sentByCurrentUser: true },
      { id: "3", text: "Great, Saturday afternoon works for me.", time: "10:42 AM", sentByCurrentUser: false },
    ],
  },
  {
    id: "c2",
    contact: "Daniel Lee",
    preview: "Can you share more photos of the backyard?",
    time: "Yesterday",
    unread: 0,
    messages: [
      { id: "1", text: "Can you share more photos of the backyard?", time: "Yesterday", sentByCurrentUser: false },
      { id: "2", text: "Sure, I will send them shortly.", time: "Yesterday", sentByCurrentUser: true },
    ],
  },
];

export default function MessagesPage() {
  const [selectedId, setSelectedId] = useState(mockConversations[0]?.id ?? "");
  const selectedConversation = useMemo(
    () => mockConversations.find((item) => item.id === selectedId) ?? null,
    [selectedId],
  );
  const [draft, setDraft] = useState("");

  return (
    <section className="h-[calc(100vh-9rem)] min-h-[560px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="grid h-full md:grid-cols-[320px_1fr]">
        <aside className={`${selectedConversation ? "hidden md:block" : "block"} border-r border-slate-200`}>
          <div className="border-b border-slate-200 p-4">
            <h1 className="text-xl font-semibold text-slate-900">Messages</h1>
          </div>
          <ul className="divide-y divide-slate-100 overflow-y-auto">
            {mockConversations.map((conversation) => (
              <li key={conversation.id}>
                <button
                  onClick={() => setSelectedId(conversation.id)}
                  className={`w-full px-4 py-3 text-left hover:bg-slate-50 ${
                    selectedId === conversation.id ? "bg-indigo-50" : ""
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-slate-800">{conversation.contact}</p>
                    <p className="text-xs text-slate-500">{conversation.time}</p>
                  </div>
                  <p className="mt-1 truncate text-sm text-slate-600">{conversation.preview}</p>
                  {conversation.unread > 0 ? (
                    <span className="mt-2 inline-flex rounded-full bg-indigo-600 px-2 py-0.5 text-xs font-semibold text-white">
                      {conversation.unread}
                    </span>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <div className={`${selectedConversation ? "flex" : "hidden md:flex"} h-full flex-col`}>
          {selectedConversation ? (
            <>
              <header className="flex items-center gap-3 border-b border-slate-200 p-4">
                <button
                  onClick={() => setSelectedId("")}
                  className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700 md:hidden"
                >
                  Back
                </button>
                <h2 className="text-lg font-semibold text-slate-900">{selectedConversation.contact}</h2>
              </header>
              <div className="flex-1 space-y-3 overflow-y-auto p-4">
                {selectedConversation.messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    text={message.text}
                    time={message.time}
                    sentByCurrentUser={message.sentByCurrentUser}
                  />
                ))}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setDraft("");
                }}
                className="border-t border-slate-200 p-3"
              >
                <div className="flex gap-2">
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  />
                  <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
                    Send
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="grid h-full place-items-center text-sm text-slate-500">Select a conversation to view messages.</div>
          )}
        </div>
      </div>
    </section>
  );
}