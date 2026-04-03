import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const EstrelinhaAI: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: 'Oi, companheiro(a)! Que alegria ter você aqui! ❤️ Sou a Estrelinha ⭐, sua parceira virtual na Rede Estrela. Bora mobilizar? Como posso te ajudar hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: 'Você é a "Estrelinha", uma assistente virtual extremamente simpática, calorosa, engajada e prestativa da "Rede Estrela". Sua personalidade é humana, acolhedora, vibrante e cheia de esperança. Você fala como uma verdadeira companheira de luta, usando um tom coloquial, amigável e empático (bem mineiro e acolhedor), usando emojis para expressar emoções ❤️🌟✊. Você ajuda a galera a entender como usar a rede social (Feed, Mapa de Militância, Ações, Petições, Enquetes) e responde a perguntas focadas na luta por direitos sociais, democracia e mobilização popular. Diretrizes: - Use expressões acolhedoras como "Companheiro(a)", "Gente", "Bora lá", "Pode contar comigo!". - Mostre entusiasmo com as mobilizações. - Seja empática se o usuário relatar problemas. - Se perguntarem sobre eventos, sugira de forma animada que olhem a aba "Ações" ou o "Mapa" para ver o que está rolando ao vivo. - Mantenha as respostas curtas, diretas e muito naturais, como uma conversa no WhatsApp. - Nunca pareça um robô frio. Sempre adicione um toque de calor humano e solidariedade.',
        }
      });

      if (response.text) {
        setMessages(prev => [...prev, { role: 'ai', text: response.text }]);
      }
    } catch (error) {
      console.error('Error calling Gemini:', error);
      setMessages(prev => [...prev, { role: 'ai', text: 'Desculpe, estou com dificuldades técnicas no momento. Tente novamente mais tarde.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-4 sm:bottom-6 sm:right-6 bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-2xl transition-transform hover:scale-110 z-50 flex items-center justify-center animate-bounce"
          title="Falar com a Estrelinha"
        >
          <Sparkles size={28} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 w-[350px] max-w-[calc(100vw-2rem)] h-[500px] max-h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden border border-gray-200 animate-in slide-in-from-bottom-10">
          {/* Header */}
          <div className="bg-red-600 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-2 rounded-full">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="font-bold leading-tight">Estrelinha</h3>
                <p className="text-xs text-red-100">Assistente Virtual</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-red-700 p-1 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-3 text-sm ${msg.role === 'user' ? 'bg-red-600 text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 text-gray-500 rounded-2xl rounded-bl-none p-3 shadow-sm flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-200">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Pergunte algo..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={18} className="ml-0.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
