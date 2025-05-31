// ui/src/app/ttstest/page.tsx
"use client";

import { useState } from "react";

export default function TTSTestPage() {
  // form state
  const [textInput, setTextInput] = useState<string>("");
  const [provider, setProvider] = useState<"eleven" | "dia">("eleven");
  const [voiceId, setVoiceId] = useState<string>("21m00Tcm4TlvDq8ikWAM");
  const [stageTagsInput, setStageTagsInput] = useState<string>(""); // comma‑separated
  const [outputFormat, setOutputFormat] = useState<
    "mp3" | "wav" | "flac" | "opus" | "pcm"
  >("mp3");

  // ui state
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

    // build the request body
    const body: Record<string, any> = {
      provider,
      text: textInput,
      output_format: outputFormat,
    };

    // only include voiceId for ElevenLabs
    if (provider === "eleven") body.voiceId = voiceId;

    // stageTags – split by comma, trim
    const tags = stageTagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    if (tags.length) body.stageTags = tags;

    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || "TTS generation failed.");
      }

      // response is binary audio
      const blob = await res.blob();
      setAudioUrl(URL.createObjectURL(blob));
    } catch (e: any) {
      setError(e.message || "Network error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main style={{ padding: 24, maxWidth: 640, margin: "0 auto" }}>
      <h1>🗣️ TTS Test (Eleven Labs vs Dia)</h1>

      {/* Provider select */}
      <label>
        Provider:{" "}
        <select
          value={provider}
          onChange={(e) => setProvider(e.target.value as any)}
        >
          <option value="eleven">Eleven Labs</option>
          <option value="dia">Dia‑1.6B (DeepInfra)</option>
        </select>
      </label>

      {/* Voice id – only relevant for Eleven */}
      {provider === "eleven" && (
        <div style={{ marginTop: 8 }}>
          <label>
            Voice ID:{" "}
            <input
              type="text"
              value={voiceId}
              onChange={(e) => setVoiceId(e.target.value)}
              style={{ width: "100%" }}
            />
          </label>
        </div>
      )}

      {/* Stage tags */}
      <div style={{ marginTop: 8 }}>
        <label>
          Stage tags (comma‑sep):{" "}
          <input
            type="text"
            placeholder="(laughs), (sighs)"
            value={stageTagsInput}
            onChange={(e) => setStageTagsInput(e.target.value)}
            style={{ width: "100%" }}
          />
        </label>
      </div>

      {/* Output format */}
      <div style={{ marginTop: 8 }}>
        <label>
          Output format:{" "}
          <select
            value={outputFormat}
            onChange={(e) =>
              setOutputFormat(e.target.value as typeof outputFormat)
            }
          >
            <option value="mp3">mp3</option>
            <option value="wav">wav</option>
            <option value="flac">flac</option>
            <option value="opus">opus</option>
            <option value="pcm">pcm</option>
          </select>
        </label>
      </div>

      {/* Text area */}
      <textarea
        rows={4}
        placeholder="Enter text…"
        value={textInput}
        onChange={(e) => setTextInput(e.target.value)}
        style={{
          width: "100%",
          padding: 8,
          fontSize: 16,
          margin: "12px 0",
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