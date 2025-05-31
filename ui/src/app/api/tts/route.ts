import { NextRequest } from "next/server";

/**
 * POST  /api/tts
 * Body:
 * {
 *   text: string;                       // required
 *   voiceId?: string;                   // defaults to Eleven’s demo voice
 *   modelId?: string;                   // defaults to eleven_multilingual_v2
 *   outputFormat?: string;              // e.g. mp3_44100_128, pcm_24000
 *   voiceSettings?: {                   // optional fine-tuning
 *     stability?: number;               // 0‒1
 *     similarity_boost?: number;        // 0‒1
 *   }
 * }
 * Returns: 200 audio/mpeg stream or JSON { error }.
 */
export async function POST(req: NextRequest) {
  try {
    const {
      text,
      voiceId = "21m00Tcm4TlvDq8ikWAM",
      modelId = "eleven_multilingual_v2",
      outputFormat = "mp3_44100_128",
      voiceSettings,
    }: {
      text: string;
      voiceId?: string;
      modelId?: string;
      outputFormat?: string;
      voiceSettings?: { stability?: number; similarity_boost?: number };
    } = await req.json();

    if (!text?.trim()) {
      return new Response(JSON.stringify({ error: "text is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const apiKey = process.env.ELEVEN_LABS_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "ELEVEN_LABS_API_KEY not set" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Build the Eleven Labs endpoint exactly as in docs
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(
      voiceId
    )}?output_format=${encodeURIComponent(outputFormat)}`;

    const payload: Record<string, unknown> = { text, model_id: modelId };
    if (voiceSettings) payload.voice_settings = voiceSettings;

    const elRes = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "audio/mpeg",          // critical per docs
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify(payload),
    });

    if (!elRes.ok) {
      // Grab error detail if present
      const err = await elRes.json().catch(() => ({}));
      return new Response(JSON.stringify({ error: err.detail ?? "TTS failed" }), {
        status: elRes.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    // *** Stream audio straight through ***
    return new Response(elRes.body, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        // Optionally expose length when not streaming:
        // "Content-Length": elRes.headers.get("content-length") ?? ""
      },
    });
  } catch (e) {
    console.error("TTS route error:", e);
    return new Response(JSON.stringify({ error: "internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}