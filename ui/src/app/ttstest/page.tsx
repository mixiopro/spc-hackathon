// ui/src/app/tts-test/page.tsx

"use client";

import { useState } from "react";

export default function TTSTestPage() {
  const [textInput, setTextInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setError(null);
    setAudioUrl(null);

    if (!textInput.trim()) {
      setError("Please enter some text first.");
      return;
    }

    setIsLoading(true);

    try {
      // Call your serverless TTS endpoint:
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: textInput,
          // you can override voiceId, modelId, outputFormat, voiceSettings here if desired.
          // voiceId: "21m00Tcm4TlvDq8ikWAM",
          // modelId: "eleven_multilingual_v2",
          // outputFormat: "mp3_44100_128",
          // voiceSettings: { stability: 0.7, similarity_boost: 0.75 },
        }),
      });

      if (!res.ok) {
        // If the server responded with an error JSON
        const errJson = await res.json().catch(() => ({ error: "Unknown error." }));
        setError(errJson.error || "TTS generation failed.");
        setIsLoading(false);
        return;
      }

      // The response is a binary audio stream (audio/mpeg)
      // Convert it into a Blob → ObjectURL
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (e: any) {
      console.error("Fetch /api/tts failed:", e);
      setError("Network or internal error.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main style={{ padding: 24, maxWidth: 600, margin: "0 auto" }}>
      <h1>🗣️ Eleven Labs TTS Test</h1>

      <textarea
        rows={4}
        placeholder="Enter some text here…"
        value={textInput}
        onChange={(e) => setTextInput(e.target.value)}
        style={{
          width: "100%",
          padding: 8,
          fontSize: 16,
          marginBottom: 12,
          resize: "vertical",
        }}
      />

      <button
        onClick={handleGenerate}
        disabled={isLoading}
        style={{
          padding: "8px 16px",
          fontSize: 16,
          cursor: isLoading ? "not-allowed" : "pointer",
          marginBottom: 12,
        }}
      >
        {isLoading ? "Generating…" : "Generate Speech"}
      </button>

      {error && (
        <p style={{ color: "red", marginTop: 8 }}>
          Error: {error}
        </p>
      )}

      {audioUrl && (
        <div style={{ marginTop: 24 }}>
          <h2>▶️ Playback</h2>
          <audio controls src={audioUrl} />
        </div>
      )}
    </main>
  );
}