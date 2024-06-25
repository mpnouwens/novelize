import axios from "axios";

export async function GET(
  request: Request,
  { search }: Record<string, string>
) {
  try {
    const url = new URL(request.url);
    const startIndex = parseInt(url.searchParams.get("startIndex") || "0");
    console.log("startIndex", startIndex);

    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${search}&key=${process.env.EXPO_GOOGLE_BOOKS_API_KEY}&startIndex=${startIndex}&maxResults=20`
    );

    return new Response(JSON.stringify(response.data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error("Data: ", error.response.data);
        console.error("Status: ", error.response.status);
        console.error("Headers: ", error.response.headers);
      } else if (error.request) {
        console.error("No response received: ", error.request);
      } else {
        console.error("Error setting up request: ", error.message);
      }
    } else {
      console.error("Non-Axios error: ", error);
    }
    return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
      headers: { "Content-Type": "application/json" },
    });
  }
}
