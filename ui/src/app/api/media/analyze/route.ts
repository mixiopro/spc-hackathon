import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";
import { lookup as mimeLookup } from "mime-types";

// Ensure environment variable is set
if (!process.env.NEXT_PRIVATE_GEMINI_API_KEY) {
  throw new Error("NEXT_PRIVATE_GEMINI_API_KEY is not set");
}

const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PRIVATE_GEMINI_API_KEY,

  // httpOptions: { apiVersion: "v1" },
});

// The full schema for clarity, matching the one from your example
const fullResponseSchema = {
  type: Type.ARRAY,
  description:
    "Array of annotated video or audio clip segments produced by an analyzer.",
  items: {
    type: Type.OBJECT,
    required: ["start_time", "end_time"],
    properties: {
      start_time: {
        type: Type.NUMBER,
        description:
          "Start timestamp from the beginning of the media in seconds.",
      },
      end_time: {
        type: Type.NUMBER,
        description:
          "End timestamp from the beginning of the media in seconds.",
      },
      clip_description: {
        type: Type.STRING,
        description: "Natural‑language summary of what occurs in this clip.",
      },
      camera_tags: {
        type: Type.ARRAY,
        description:
          'Shot or camera‑related keywords (e.g., "close‑up", "steadycam").',
        items: {
          type: Type.STRING,
        },
      },
      sound_effect_tags: {
        type: Type.ARRAY,
        description:
          'Sound‑effect identifiers present in this clip (e.g., "door slam").',
        items: {
          type: Type.STRING,
        },
      },
      elements_tags: {
        type: Type.ARRAY,
        description:
          'Notable visual or semantic elements (e.g., "car", "sunset").',
        items: {
          type: Type.STRING,
        },
      },
      // transcripts: {
      //   type: Type.ARRAY,
      //   description:
      //     "Aligned transcript snippets relative to the original media timeline.",
      //   items: {
      //     type: Type.OBJECT,
      //     required: ["text", "start", "end"],
      //     properties: {
      //       text: {
      //         type: Type.STRING,
      //         description: "Verbatim speech text.",
      //       },
      //       start: {
      //         type: Type.NUMBER,
      //         description:
      //           "Start timestamp of this transcript chunk in seconds.",
      //       },
      //       end: {
      //         type: Type.NUMBER,
      //         description: "End timestamp of this transcript chunk in seconds.",
      //       },
      //     },
      //   },
      // },
    },
  },
};

const config = {
  responseMimeType: "application/json", // Gemini will format its output as JSON
  responseSchema: fullResponseSchema,
};
const model = "gemini-2.5-flash-preview-05-20"; // 'gemini-1.5-flash'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const fileUri = body.fileUri as string | undefined;
    let mimeType = body.mimeType as string | undefined; // may be undefined
    const promptText = body.promptText ?? "Analyze the media";

    if (!mimeType && fileUri) {
      // Strip query/hash and ask mime-types for a best-guess
      const pathname = new URL(fileUri).pathname;
      mimeType = mimeLookup(pathname) || undefined;
    }

    if (!fileUri || !mimeType) {
      return NextResponse.json(
        { error: "Missing fileUri or mimeType" },
        { status: 400 }
      );
    }

    const contents = [
      {
        role: "user",
        parts: [
          {
            fileData: {
              fileUri: fileUri,
              mimeType: mimeType,
            },
          },
          {
            text: promptText,
          },
        ],
      },
    ];

    const genAIResponseStream = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        for await (const chunk of genAIResponseStream) {
          if (chunk.text) {
            // Ensure text exists in the chunk
            controller.enqueue(encoder.encode(chunk.text));
          }
        }
        controller.close();
      },
    });

    // The client will receive a stream of text chunks that together form a JSON array.
    // The Content-Type 'application/json' indicates the eventual complete body will be JSON.
    // The client needs to be implemented to buffer these chunks and parse the complete JSON string once the stream ends.
    return new NextResponse(stream, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error in /media/analyze endpoint:", error);
    let errorMessage = "Internal Server Error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
