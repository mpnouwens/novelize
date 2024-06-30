import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.EXPO_OPENAI_API_KEY,
});

export async function POST(
  request: Request,
  { bookId }: Record<string, string>
) {
  const { title, isbn, authors, publisher, description } = await request.json();

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are a master librarian AI assistant. You have been asked to summarize a book. Make sure to build off of the information given (ISBN, title, author, publisher, description). Try to make a sales pitch for the book and why I should read it. Keep it simple, only text is needed, no complex formatting. Make it long. Keep it at 250 characters or less.",
      },
      {
        role: "user",
        content: `I would like a summary of the book with the ISBN ${isbn} and ${bookId}. please about ${title} by ${authors} published by ${publisher}. ${description}`,
      },
    ],
    model: "gpt-4o",
    max_tokens: 250,
  });

  return new Response(JSON.stringify(completion.choices[0].message.content), {
    headers: { "Content-Type": "application/json" },
  });
}
