'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, X, Mic, Square, Volume2, Send } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isUrdu?: boolean;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'سلام! میں آپ کا AI Assistant ہوں۔ آپ مجھ سے deepfake detection کے بارے میں کچھ بھی پوچھ سکتے ہیں۔',
      isUser: false,
      timestamp: new Date(),
      isUrdu: true
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window === 'undefined' || !('webkitSpeechRecognition' in window)) return;

    const SpeechRecognitionCtor = (
      window as typeof window & { webkitSpeechRecognition: new () => SpeechRecognition }
    ).webkitSpeechRecognition;

    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'ur-PK';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0]?.[0]?.transcript ?? '';
      setInputText(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ur-PK';
      utterance.rate = 0.8;
      utterance.pitch = 1;

      speechSynthesis.speak(utterance);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
      isUrdu: /[\u0600-\u06FF]/.test(inputText) // Check if text contains Urdu characters
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputText);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse.text,
        isUser: false,
        timestamp: new Date(),
        isUrdu: aiResponse.isUrdu
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
      
      // Auto-speak AI response in Urdu
      if (aiResponse.isUrdu) {
        speakText(aiResponse.text);
      }
    }, 1500);
  };

  const generateAIResponse = (input: string): { text: string; isUrdu: boolean } => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('deepfake') || lowerInput.includes('fake') || lowerInput.includes('manipulated')) {
      return {
        text: 'Deepfake ایک AI-generated content ہے جو کسی شخص کی تصویر یا آواز کو دوسرے شخص پر superimpose کرتا ہے۔ میں آپ کو بتا سکتا ہوں کہ کس طرح detect کریں۔',
        isUrdu: true
      };
    } else if (lowerInput.includes('detect') || lowerInput.includes('check') || lowerInput.includes('analyze')) {
      return {
        text: 'Detection کے لیے آپ کو image quality، facial inconsistencies، اور lighting patterns پر دھیان دینا چاہیے۔ میں آپ کی مدد کر سکتا ہوں۔',
        isUrdu: true
      };
    } else if (lowerInput.includes('help') || lowerInput.includes('مدد')) {
      return {
        text: 'میں آپ کی مدد کر سکتا ہوں! آپ مجھ سے deepfake detection، image analysis، یا کسی بھی سوال کے بارے میں پوچھ سکتے ہیں۔',
        isUrdu: true
      };
    } else {
      return {
        text: 'I can help you with deepfake detection, image analysis, and answer questions about AI-generated content. Feel free to ask me anything!',
        isUrdu: false
      };
    }
  };

  const quickActions = [
    { text: 'Deepfake کیا ہے؟', action: () => setInputText('Deepfake کیا ہے؟') },
    { text: 'کیسے detect کریں؟', action: () => setInputText('کیسے detect کریں؟') },
    { text: 'Image analyze کریں', action: () => setInputText('Image analyze کریں') },
    { text: 'Help me', action: () => setInputText('Help me') }
  ];

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <div className="group relative cursor-pointer">
          <button
            type="button"
            aria-expanded={isOpen}
            aria-label={isOpen ? 'Close assistant' : 'Open assistant'}
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-app-accent text-white shadow-lg shadow-black/30 transition-transform hover:scale-105 hover:bg-app-accent-hover"
          >
            <Bot className="h-7 w-7" strokeWidth={1.75} aria-hidden />
          </button>
          <div className="pointer-events-none absolute bottom-[4.5rem] right-0 w-52 rounded-xl border border-app-border bg-app-surface/95 p-3 text-left opacity-0 shadow-xl backdrop-blur-md transition-opacity group-hover:opacity-100">
            <div className="text-sm font-semibold text-app-text">Assistant</div>
            <div className="text-xs text-app-muted">Urdu & English</div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[500px] w-[min(100vw-2rem,24rem)] flex-col rounded-2xl border border-app-border bg-app-surface shadow-2xl shadow-red-950/10 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-app-border p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-app-accent text-white">
                <Bot className="h-4 w-4" strokeWidth={2} aria-hidden />
              </div>
              <div>
                <h3 className="font-semibold text-app-text">AI Assistant</h3>
                <p className="text-xs text-app-muted">Urdu & English</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1 text-app-muted hover:bg-app-surface-hover hover:text-app-text"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-2xl p-3 ${
                    message.isUser ? 'bg-app-accent text-white' : 'border border-app-border bg-app-bg-mid/90 text-app-text'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="text-xs opacity-70">{message.timestamp.toLocaleTimeString()}</span>
                    {message.isUrdu && (
                      <button
                        type="button"
                        onClick={() => speakText(message.text)}
                        className="rounded p-1 text-current opacity-70 hover:opacity-100"
                        aria-label="Speak message"
                      >
                        <Volume2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="rounded-2xl border border-app-border bg-app-bg/50 p-3">
                  <div className="flex gap-1">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-app-muted" />
                    <div className="animation-delay-200 h-2 w-2 animate-bounce rounded-full bg-app-muted" />
                    <div className="animation-delay-400 h-2 w-2 animate-bounce rounded-full bg-app-muted" />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-app-border p-4">
            <div className="mb-3 grid grid-cols-2 gap-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={action.action}
                  className="rounded-lg border border-app-border bg-app-bg/40 px-3 py-2 text-xs text-app-text hover:bg-app-surface-hover"
                >
                  {action.text}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-app-border p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Urdu or English…"
                className="flex-1 rounded-lg border border-app-border bg-app-surface px-3 py-2 text-sm text-app-text placeholder:text-app-muted focus:outline-none focus:ring-2 focus:ring-app-accent/30"
              />
              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                className={`flex h-10 w-10 items-center justify-center rounded-lg border border-app-border transition-colors ${
                  isListening ? 'bg-app-accent text-white hover:bg-app-accent-hover' : 'bg-app-bg-mid text-app-text hover:bg-app-surface-hover'
                }`}
                aria-label={isListening ? 'Stop listening' : 'Voice input'}
              >
                {isListening ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={sendMessage}
                disabled={!inputText.trim()}
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-app-accent text-white transition-colors hover:bg-app-accent-hover disabled:cursor-not-allowed disabled:bg-app-surface-hover disabled:text-app-muted disabled:hover:bg-app-surface-hover"
                aria-label="Send"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


