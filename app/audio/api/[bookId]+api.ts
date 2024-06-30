import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({
  apiKey: process.env.EXPO_OPENAI_API_KEY,
});

export async function GET(
  request: Request,
  { bookId }: Record<string, string>
) {
  try {
    const baseUrl = new URL(request.url).origin;
    const recordingsDir = path.join(process.cwd(), "recordings");
    const files = await fs.promises.readdir(recordingsDir);
    const matchedFiles = files.filter((file) => file.startsWith(bookId));

    if (matchedFiles.length === 0) {
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const response = await Promise.all(
      matchedFiles.map(async (file) => {
        const filePath = path.join(recordingsDir, file);
        const parts = file.split("-");
        const counter = parts[1].replace(".mp3", "");
        const date = fs.statSync(filePath).mtime;
        const url = `${baseUrl}/recordings/${file}`;

        return {
          id: bookId,
          counter,
          date,
          url,
        };
      })
    );

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
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

    await fs.promises.mkdir("recordings", { recursive: true });

    const files = await fs.promises.readdir("recordings");
    const prevFiles = files.filter((file) => file.includes(`${bookId}`));

    const speechFile = `recordings/${bookId}-${prevFiles.length + 1}.mp3`;

    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "shimmer",
      input: message,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());

    await fs.promises.writeFile(speechFile, buffer);

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
