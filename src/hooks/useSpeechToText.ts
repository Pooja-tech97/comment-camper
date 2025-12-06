import { useState, useCallback, useRef, useEffect } from "react";

interface SpeechRecognitionType extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
}

interface UseSpeechToTextReturn {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  isSupported: boolean;
  error: string | null;
}

export function useSpeechToText(): UseSpeechToTextReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionType | null>(null);

  const isSupported = typeof window !== "undefined" && 
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  useEffect(() => {
    if (!isSupported) return;

    const SpeechRecognitionConstructor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognitionConstructor() as SpeechRecognitionType;
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = "en-US";

    recognitionRef.current.onresult = (event: any) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript + " ";
        }
      }
      if (finalTranscript) {
        setTranscript(prev => prev + finalTranscript);
      }
    };

    recognitionRef.current.onerror = (event: any) => {
      setError(event.error);
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    return () => {
      recognitionRef.current?.stop();
    };
  }, [isSupported]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;
    setError(null);
    setTranscript("");
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (e) {
      console.error("Speech recognition error:", e);
    }
  }, []);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
    setIsListening(false);
  }, []);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    isSupported,
    error,
  };
}
