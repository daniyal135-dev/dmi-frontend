'use client';

import { useState, useRef, useEffect } from 'react';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  onStart?: () => void;
  onStop?: () => void;
  language?: string;
  className?: string;
}

export default function VoiceInput({ 
  onTranscript, 
  onStart, 
  onStop, 
  language = 'ur-PK',
  className = ''
}: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('webkitSpeechRecognition' in window)) return;

    const SpeechRecognitionCtor = (
      window as typeof window & { webkitSpeechRecognition: new () => SpeechRecognition }
    ).webkitSpeechRecognition;

    setIsSupported(true);
    const recognition = new SpeechRecognitionCtor();
    recognitionRef.current = recognition;
      
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = language;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setIsProcessing(false);
      onStart?.();
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript || interimTranscript);
        
        if (finalTranscript) {
          setIsProcessing(true);
          setTimeout(() => {
            onTranscript(finalTranscript);
            setIsProcessing(false);
            setTranscript('');
          }, 500);
        }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      setIsProcessing(false);
      onStop?.();
    };

    recognition.onend = () => {
      setIsListening(false);
      setIsProcessing(false);
      onStop?.();
    };

    return () => {
      try {
        recognition.stop();
      } catch {
        /* not running */
      }
      recognitionRef.current = null;
    };
  }, [language, onTranscript, onStart, onStop]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
      
      // Auto-stop after 10 seconds
      timeoutRef.current = setTimeout(() => {
        stopListening();
      }, 10000);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (!isSupported) {
    return (
      <div className={`text-center p-4 ${className}`}>
        <p className="text-sm text-app-muted">
          Voice input is not supported in this browser
        </p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      {/* Voice Button */}
      <button
        onClick={toggleListening}
        disabled={isProcessing}
        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${
          isListening
            ? 'bg-red-500 hover:bg-red-600 animate-pulse'
            : isProcessing
            ? 'bg-yellow-500 hover:bg-yellow-600 animate-spin'
            : 'bg-blue-500 hover:bg-blue-600'
        } ${isProcessing ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      >
        {isProcessing ? (
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : isListening ? (
          <span className="text-2xl">⏹️</span>
        ) : (
          <span className="text-2xl">🎤</span>
        )}
      </button>

      {/* Status Text */}
      <div className="text-center">
        {isListening && (
          <p className="text-green-400 text-sm animate-pulse">
            Listening... Speak now
          </p>
        )}
        {isProcessing && (
          <p className="text-yellow-400 text-sm animate-pulse">
            Processing...
          </p>
        )}
        {!isListening && !isProcessing && (
          <p className="text-app-muted text-sm">
            Click to start voice input
          </p>
        )}
      </div>

      {/* Transcript Display */}
      {transcript && (
        <div className="max-w-md w-full rounded-lg border border-app-border bg-app-bg-mid/90 p-3 backdrop-blur-md">
          <p className="text-center text-sm text-app-text">{`"${transcript}"`}</p>
        </div>
      )}

      {/* Language Indicator */}
      <div className="text-xs text-app-muted">
        Language: {language === 'ur-PK' ? 'Urdu (Pakistan)' : language}
      </div>
    </div>
  );
}



