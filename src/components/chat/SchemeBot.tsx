import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';

interface Message {
    id: string;
    text: string;
    sender: 'bot' | 'user';
    timestamp: Date;
}

const INITIAL_MESSAGE: Message = {
    id: '1',
    text: "Namaste! I am BharatBot. I can help you find schemes or answer questions. Try asking 'scholarships' or 'pension'.",
    sender: 'bot',
    timestamp: new Date()
};

export const SchemeBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSendMessage = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputText.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: inputText,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsTyping(true);

        // Simulate AI Delay
        setTimeout(() => {
            const botResponse = generateResponse(userMsg.text);
            setMessages(prev => [...prev, botResponse]);
            setIsTyping(false);
        }, 1000);
    };

    // Mock AI Logic
    const generateResponse = (text: string): Message => {
        const lowerText = text.toLowerCase();
        let responseText = "I'm not sure about that. Try asking about specific categories like 'health', 'education', or 'farming'.";

        if (lowerText.includes('hello') || lowerText.includes('hi')) {
            responseText = "Hello! How can I assist you with government schemes today?";
        } else if (lowerText.includes('scholarship') || lowerText.includes('student')) {
            responseText = "For students, we have the PM-YASASVI Scholarship and Post-Matric Scholarships. You can apply if your income is below 2.5L.";
        } else if (lowerText.includes('health') || lowerText.includes('medical')) {
            responseText = "Ayushman Bharat provides health cover up to 5 Lakhs per family. Check if you are eligible in the Schemes section.";
        } else if (lowerText.includes('farmer') || lowerText.includes('kisan')) {
            responseText = "PM-KISAN provides ₹6,000 per year to eligible farmers. Check the 'Agriculture' category for more details.";
        } else if (lowerText.includes('pension') || lowerText.includes('old')) {
            responseText = "We have the Indira Gandhi National Old Age Pension Scheme (IGNOAPS) for senior citizens.";
        } else if (lowerText.includes('document')) {
            responseText = "Common documents needed are Aadhar Card, Income Certificate, and Caste Certificate. Check your Document Locker.";
        }

        return {
            id: (Date.now() + 1).toString(),
            text: responseText,
            sender: 'bot',
            timestamp: new Date()
        };
    };

    return (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end pointer-events-none">

            {/* Chat Window */}
            {isOpen && (
                <div className="bg-white rounded-2xl shadow-2xl w-80 sm:w-96 mb-4 overflow-hidden border border-slate-200 pointer-events-auto animate-in slide-in-from-bottom-10 fade-in duration-200">
                    <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-4 flex justify-between items-center text-white">
                        <div className="flex items-center gap-2">
                            <div className="bg-white/20 p-1.5 rounded-full">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">BharatBot</h3>
                                <div className="flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                                    <span className="text-xs text-primary-100">Online</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="h-80 overflow-y-auto p-4 bg-slate-50 space-y-4">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${msg.sender === 'user'
                                        ? 'bg-primary-600 text-white rounded-tr-none'
                                        : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-100 flex gap-2">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Type your question..."
                            className="flex-grow px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        <button
                            type="submit"
                            disabled={!inputText.trim()}
                            className="p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-gradient-to-r from-primary-600 to-indigo-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all pointer-events-auto flex items-center gap-2 group"
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
                {!isOpen && (
                    <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap font-semibold text-sm">
                        Ask AI Assistant
                    </span>
                )}
            </button>
        </div>
    );
};
