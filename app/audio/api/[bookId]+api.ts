import OpenAI from "openai";
import { supabase } from "@/supabase";

const openai = new OpenAI({
  apiKey: process.env.EXPO_OPENAI_API_KEY,
});

export async function GET(
  request: Request,
  { bookId }: Record<string, string>
) {
  try {
    const { data: files, error } = await supabase.storage
      .from("audios")
      .list("", {
        limit: 100,
        offset: 0,
        search: bookId,
      });

    if (error) {
      throw new Error(`Failed to list files: ${error.message}`);
    }

    if (!files || files.length === 0) {
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const audioFiles = await Promise.all(
      files.map(async (file) => {
        const { name, updated_at } = file;
        const { data } = await supabase.storage
          .from("audios")
          .getPublicUrl(name);

        return {
          name,
          created_at: updated_at,
          url: data.publicUrl,
        };
      })
    );

    return new Response(JSON.stringify(audioFiles), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);

    return new Response(JSON.stringify({ error: error }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(
  request: Request,
  { bookId }: Record<string, string>
) {
  try {
    const requestJson = await request.json();
    const message = requestJson.message;
    if (!message) {
      throw new Error("Message is required");
    }

    const timestamp = new Date().getTime();
    const speechFile = `${bookId}+${timestamp}.mp3`;

    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "shimmer",
      input: message,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());

    const { data: upload, error: uploadError } = await supabase.storage
      .from("audios")
      .upload(speechFile, buffer, {
        contentType: "audio/mpeg",
        cacheControl: "3600",
        upsert: false,
      });

    console.log({ upload, uploadError });

    return new Response(
      JSON.stringify({ message: "File created successfully" }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);

    return new Response(JSON.stringify({ error: error }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
