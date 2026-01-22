import fetch from "node-fetch";

/* =======================
   CHATGPT HANDLER
======================= */
export async function chatgptHandler(message) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }]
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error("ChatGPT failed: " + err);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

/* =======================
   GEMINI HANDLER
======================= */
export async function geminiHandler(message) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: message }]
          }
        ]
      })
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error("Gemini failed: " + err);
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}