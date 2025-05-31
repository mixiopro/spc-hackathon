// app/api/tts/route.ts
//
// Unified TTS endpoint powered by the ElevenLabs SDK.
//
// Supported providers:
//   • "eleven"   → api.elevenlabs.io  (requires ELEVEN_LABS_API_KEY)
//   • "dia"      → api.deepinfra.com  (requires DEEPINFRA_API_KEY)
//
// POST /api/tts
// Body (matches ElevenLabsTextToSpeechIn schema):
// {
//   text:           string   (required)
//   model_id?:      string   (default varies per provider)
//   output_format?: "mp3" | "opus" | "flac" | "wav" | "pcm" (default "wav")
//   language_code?: string   (Dia optional)
//   provider?:      "eleven" | "dia" (default "eleven")
//   voiceId?:       string   (ElevenLabs only, default demo voice "21m00Tcm4TlvDq8ikWAM")
//   stageTags?:     string[] (optional emotion cues, prepended for Dia; mapped to next_text for Eleven)
// }
//
// Response: raw audio stream with proper content‑type.
// app/api/tts/route.ts
//
// Unified TTS endpoint powered by the official @elevenlabs/elevenlabs-js SDK.
//
// Supported providers:
//   • "eleven" → api.elevenlabs.io         (requires ELEVEN_LABS_API_KEY)
//   • "dia"    → api.deepinfra.com         (requires DEEPINFRA_API_KEY)
//
// POST /api/tts
// Body:
// {
//   text: string                                   // required
//   provider?: "eleven" | "dia"                    // default "eleven"
//   model_id?: string                              // model slug
//   output_format?: "mp3"|"wav"|"flac"|"opus"|"pcm"// default "wav"
//   language_code?: string                         // Dia only
//   voiceId?: string                               // Eleven only
//   stageTags?: string[]                           // emotion cues
// }
//
// Streams raw audio back to the client.

import { NextRequest, NextResponse } from "next/server";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

const DIA_MODEL_DEFAULT = "nari-labs/Dia-1.6B";
const ELEVEN_MODEL_DEFAULT = "eleven_multilingual_v2";
const ELEVEN_VOICE_DEFAULT = "21m00Tcm4TlvDq8ikWAM";

// Map simple aliases to ElevenLabs enum values
const FORMAT_MAP: Record<string, string> = {
  mp3: "mp3_44100_128",
  wav: "wav",
  flac: "flac",
  opus: "opus_48k_128",
  pcm: "pcm_24000",
};

function tidy(input: string): string {
  return input
    .replace(/\r?\n\s*\r?\n/g, " ")  // collapse blank lines
    .replace(/\r?\n/g, ", ")         // single newline → short pause
    .replace(/\s{2,}/g, " ")         // remove double spaces
    .trim();
}

export async function POST(req: NextRequest) {
  try {
    const {
      text,
      provider = "eleven",
      model_id,
      output_format = "mp3",
      language_code,
      voiceId = ELEVEN_VOICE_DEFAULT,
      stageTags = [],
    } = await req.json();

    if (!text?.trim()) {
      return NextResponse.json({ error: "text is required" }, { status: 400 });
    }

    const isDia = provider === "dia";
    const apiKey = isDia
      ? process.env.DEEPINFRA_API_KEY
      : process.env.ELEVEN_LABS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error: `${
            isDia ? "DEEPINFRA_API_KEY" : "ELEVEN_LABS_API_KEY"
          } not configured`,
        },
        { status: 500 },
      );
    }

    // Build SDK client
    const client = new ElevenLabsClient({
      apiKey,
      baseUrl: isDia ? "https://api.deepinfra.com" : undefined,
    });

    // Resolve model & format
    const modelId = model_id ?? (isDia ? DIA_MODEL_DEFAULT : ELEVEN_MODEL_DEFAULT);
    const resolvedFormat = FORMAT_MAP[output_format] ?? output_format;

    const cleanedText = tidy(text);
    const renderedText =
      isDia && stageTags.length ? `${stageTags.join(" ")} ${cleanedText}` : cleanedText;

    // Build options
    const opts: any = {
      text: renderedText,
      modelId,
      outputFormat: resolvedFormat,
      // // For ElevenLabs, add emotional voice settings:
      ...(provider === "eleven" && {
        voiceSettings: {
          stability: 0.3,          // lower → more variation/emotion
          similarityBoost: 0.6,    // lower → less strict matching, more expressiveness
          style: 0.8,              // higher → more dramatic/intense tone
          useSpeakerBoost: false,  // false → freer emotional modulation
          speed: 0.9,              // slightly slower for emotion
        },
      }),
    };
    if (language_code) opts.languageCode = language_code;
    if (!isDia && stageTags.length) {
      opts.nextText =
        stageTags
          .map((t: string) => t.replace(/[()]/g, "").replace(/_/g, " "))
          .join(". ") + ".";
    }
    opts.applyTextNormalization = "off";
    // opts.voiceSettings = {
    //   stability: 0.3,          // lower → more variation/emotion
    //   similarityBoost: 0.6,    // lower → less strict matching, more expressiveness
    //   style: 0.8,              // higher → more dramatic/intense tone
    //   useSpeakerBoost: false,  // false → freer emotional modulation
    //   speed: 0.5,              // slightly slower for emotion
    // };

    // Stream audio directly
    const audioStream = await client.textToSpeech.convert(
      voiceId,
      opts,
    );

    const mime =
      resolvedFormat.startsWith("mp3")
        ? "audio/mpeg"
        : resolvedFormat.startsWith("opus")
        ? "audio/ogg"
        : resolvedFormat.startsWith("pcm")
        ? "audio/wave"
        : `audio/${resolvedFormat.split("_")[0]}`;

    return new NextResponse(audioStream as any, {
      status: 200,
      headers: { "Content-Type": mime },
    });
  } catch (err) {
    console.error("TTS route error:", err);
    return NextResponse.json({ error: "internal server error" }, { status: 500 });
  }
}