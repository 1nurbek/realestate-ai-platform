type MessageBubbleProps = {
  text: string;
  time: string;
  sentByCurrentUser?: boolean;
};

export default function MessageBubble({ text, time, sentByCurrentUser = false }: MessageBubbleProps) {
  return (
    <div className={`flex ${sentByCurrentUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
          sentByCurrentUser ? "rounded-br-sm bg-indigo-600 text-white" : "rounded-bl-sm bg-slate-100 text-slate-800"
        }`}
      >
        <p>{text}</p>
        <p className={`mt-1 text-[11px] ${sentByCurrentUser ? "text-indigo-100" : "text-slate-500"}`}>{time}</p>
      </div>
    </div>
  );
}