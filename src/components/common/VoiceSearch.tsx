import React, { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';

interface VoiceSearchProps {
    onSearch: (term: string) => void;
}

export const VoiceSearch = ({ onSearch }: VoiceSearchProps) => {
    const [isListening, setIsListening] = useState(false);
    const [isSupported, setIsSupported] = useState(true);

    useEffect(() => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            setIsSupported(false);
        }
    }, []);

    const startListening = () => {
        if (!isSupported) {
            alert("Voice search is not supported in this browser.");
            return;
        }

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.lang = 'en-US'; // Could make this dynamic based on language context
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            onSearch(transcript);
            setIsListening(false);
        };

        recognition.onerror = (event: any) => {
            console.error('Voice recognition error', event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
    };

    if (!isSupported) return null;

    return (
        <button
            onClick={startListening}
            className={`p-2 rounded-full transition-all ${isListening
                    ? 'bg-red-100 text-red-600 animate-pulse ring-2 ring-red-400'
                    : 'text-slate-400 hover:text-primary-600 hover:bg-primary-50'
                }`}
            title="Search by Voice"
        >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>
    );
};
