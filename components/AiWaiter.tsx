import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Sparkles } from 'lucide-react';
import { ChatMessage } from '../types';
import { sendMessageToGemini } from '../services/geminiService';

export const AiWaiter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Fala patrão! Sou o Garçom Virtual. Bateu a fome? 🍔' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const history = messages.map(m => ({ role: m.role, text: m.text }));
    const responseText = await sendMessageToGemini(history, userMsg.text);

    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setIsTyping(false);
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 left-6 w-14 h-14 bg-brand-orange text-white rounded-full shadow-[0_0_20px_rgba(255,90,0,0.5)] flex items-center justify-center z-40 hover:scale-110 transition-transform hover:bg-orange-600"
        >
          <Sparkles className="animate-pulse" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 left-6 w-80 max-w-[calc(100vw-48px)] h-96 bg-brand-card rounded-2xl shadow-2xl border border-white/10 z-50 flex flex-col overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="bg-brand-black p-3 flex justify-between items-center text-white border-b border-white/5">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-brand-yellow"/>
              <span className="font-bold text-sm">Garçom Virtual</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-brand-gray hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-grow overflow-y-auto p-3 space-y-3 bg-brand-black/50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`
                    max-w-[85%] p-3 rounded-xl text-sm shadow-sm
                    ${msg.role === 'user' 
                      ? 'bg-brand-orange text-white rounded-tr-none' 
                      : 'bg-brand-card border border-white/10 text-brand-gray rounded-tl-none'
                    }
                  `}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-brand-card p-2 rounded-xl rounded-tl-none animate-pulse text-xs text-brand-gray border border-white/5">
                  Digitando...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-brand-card border-t border-white/10 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Digite aqui..."
              className="flex-grow bg-brand-black rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand-orange placeholder-gray-600 border border-white/5"
            />
            <button 
              onClick={handleSend}
              className="w-9 h-9 bg-brand-orange text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors shadow-lg"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};