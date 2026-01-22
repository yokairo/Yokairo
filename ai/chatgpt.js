import fetch from "node-fetch";

export async function chatgptReply(message) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY missing");
  }

  const response = await fetch(
    "https://api.openai.com/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "user", content: message }
        ],
      }),
    }
  );

  const data = await response.json();

  return (
    data?.choices?.[0]?.message?.content ||
    "No response from ChatGPT"
  );
}