// pages/index.tsx
import { useState } from 'react';

// Define the message type
type Message = {
  from: 'user' | 'bot';
  text: string;
};

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { from: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();

    const botMessage: Message = { from: 'bot', text: data.response };
    setMessages(prev => [...prev, botMessage]);
    setInput('');
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#1e1e20] text-white p-4 max-w-xl mx-auto">
  <h1 className="text-2xl font-semibold text-center mb-4">💬 Talk to TJ</h1>

  <div className="space-y-2 mb-4 max-h-[65vh] overflow-y-auto border border-neutral-700 rounded-md p-4 bg-[#2a2a2d] shadow-inner">
    {messages.map((msg, i) => (
      <div key={i} className={`text-sm ${msg.from === 'user' ? 'text-right' : 'text-left'}`}>
        <span
          className={`inline-block px-4 py-2 rounded-lg max-w-[80%] ${
            msg.from === 'user'
              ? 'bg-[#0a84ff] text-white'
              : 'bg-[#3c3f44] text-gray-200'
          }`}
        >
          {msg.text}
        </span>
      </div>
    ))}
    {loading && <div className="text-sm text-left text-gray-400 italic">TJ is typing...</div>}
  </div>

  <form onSubmit={sendMessage} className="flex gap-2">
    <input
      className="flex-1 bg-[#2a2a2d] text-white border border-[#6e6e73] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0a84ff]"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      placeholder="Ask TJ something..."
    />
    <button
      type="submit"
      className="bg-[#0a84ff] text-white px-4 py-2 rounded-md hover:bg-blue-600 active:scale-95 transition"
    >
      Send
    </button>
  </form>
</main>
  );
}
