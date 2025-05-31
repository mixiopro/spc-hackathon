'use client';

import { useState } from 'react';

interface TextToSpeechProps {
  defaultText?: string;
}

export default function TextToSpeech({ defaultText = '' }: TextToSpeechProps) {
  const [text, setText] = useState(defaultText);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTextToSpeech = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          voiceId: '21m00Tcm4TlvDq8ikWAM', // Default voice ID
          stability: 0.5,
          similarityBoost: 0.75,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate speech');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to convert to speech..."
          className="w-full h-32 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        
        <button
          onClick={handleTextToSpeech}
          disabled={isLoading || !text.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Generating...' : 'Convert to Speech'}
        </button>

        {error && (
          <div className="text-red-500 mt-2">
            {error}
          </div>
        )}
      </div>
    </div>
  );
} 