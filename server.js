import fetch from "node-fetch";

/* =========================
   CHATGPT
========================= */
export async function chatgptHandler(message) {
  try {
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: message }]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("ChatGPT API error:", data);
      throw new Error("ChatGPT API failed");
    }

    return data.choices[0].message.content;

  } catch (err) {
    console.error("ChatGPT handler crash:", err.message);
    throw err;
  }
}

/* =========================
   GEMINI (FIXED)
========================= */
export async function geminiHandler(message) {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: message }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", data);
      throw new Error("Gemini API failed");
    }

    // Safety check
    if (
      !data.candidates ||
      !data.candidates[0] ||
      !data.candidates[0].content ||
      !data.candidates[0].content.parts
    ) {
      console.error("Gemini invalid response:", data);
      throw new Error("Gemini empty response");
    }

    return data.candidates[0].content.parts[0].text;

  } catch (err) {
    console.error("Gemini handler crash:", err.message);
    throw err;
  }
}