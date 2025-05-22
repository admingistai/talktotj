// pages/index.tsx
import { useState, useRef, useEffect } from 'react';

// Define our message shape
type Message = {
  from: 'user' | 'bot';
  text: string;
};

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  // keep a ref to the bottom of the chat so we can auto-scroll
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(msgs => [...msgs, { from: 'user', text: input }]);
    setLoading(true);

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input }),
    });
    const { response } = await res.json();

    setMessages(msgs => [...msgs, { from: 'bot', text: response }]);
    setInput('');
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#1e1e20] text-white py-8">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 px-4">
        {/* SIDEBAR */}
        <aside className="hidden lg:block bg-[#26262b] rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4">💡 Tips from TJ</h2>
          <ul className="space-y-3 text-gray-300">
            <li>✅ Ask me anything about mindset</li>
            <li>🎯 I can help you plan your goals</li>
            <li>💬 Try: “Give me advice for staying focused”</li>
            <li>📓 I can write journal prompts too</li>
          </ul>
        </aside>

        {/* CHAT AREA */}
        <section className="flex flex-col bg-[#2a2a2d] rounded-xl shadow-lg overflow-hidden">
          <header className="px-6 py-4 border-b border-neutral-700">
            <h1 className="text-2xl font-semibold">💬 Talk to TJ</h1>
          </header>

          <div
            className="flex-1 overflow-y-auto px-6 py-4 space-y-4 relative before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-8 before:bg-gradient-to-b before:from-[#2a2a2d] before:to-transparent after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-8 after:bg-gradient-to-t after:from-[#2a2a2d] after:to-transparent"
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`
                    px-4 py-2 rounded-2xl max-w-[75%]
                    ${msg.from === 'user' ? 'bg-[#0a84ff] text-white' : 'bg-[#3c3f44] text-gray-200'}
                  `}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <p className="text-sm text-gray-400 italic">TJ is typing...</p>
            )}
            <div ref={endRef} />
          </div>

          <form
            onSubmit={sendMessage}
            className="flex items-center gap-4 px-6 py-4 border-t border-neutral-700"
          >
            <input
              autoFocus
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask TJ something…"
              className="flex-1 bg-[#1f1f22] text-white placeholder-gray-400 px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-[#0a84ff]"
            />
            <button
              type="submit"
              disabled={loading}
              className={`
                px-6 py-2 rounded-full font-medium transition
                ${loading
                  ? 'bg-gray-600 cursor-wait'
                  : 'bg-[#0a84ff] hover:bg-[#0a7ae0]'}
              `}
            >
              {loading ? 'Sending…' : 'Send'}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
