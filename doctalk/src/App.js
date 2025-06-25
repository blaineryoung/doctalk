import React, { useState, useRef } from 'react';

export default function App() {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const toggleListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser. Try Chrome.');
      return;
    }

    if (!recognitionRef.current) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const result = event.results[i];
          if (result.isFinal) {
            setTranscript((prev) => prev + result[0].transcript + ' ');
          } else {
            interimTranscript += result[0].transcript;
          }
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event);
      };

      recognitionRef.current = recognition;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }

    setIsListening(!isListening);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">🗣️ Live Voice Transcriber</h1>
      <button
        onClick={toggleListening}
        className={`px-6 py-3 rounded text-lg font-semibold mb-6 transition-all duration-300 ${
          isListening ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        {isListening ? 'Stop Listening' : 'Start Listening'}
      </button>
      <div className="bg-gray-800 p-4 rounded shadow max-w-3xl whitespace-pre-wrap">
        {transcript || 'Start talking and your words will appear here...'}
      </div>
    </div>
  );
}