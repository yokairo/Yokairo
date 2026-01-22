import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

/* =========================
   CHATGPT
========================= */
async function chatgptHandler(message) {
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
    console.error("ChatGPT error:", data);
    throw new Error("ChatGPT failed");
  }

  return data.choices[0].message.content;
}

/* =========================
   GEMINI
========================= */
async function geminiHandler(message) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          { role: "user", parts: [{ text: message }] }
        ]
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("Gemini error:", data);
    throw new Error("Gemini failed");
  }

  return data.candidates[0].content.parts[0].text;
}

/* =========================
   MAIN API ROUTE
========================= */
app.post("/ai", async (req, res) => {
  const { provider, message } = req.body;

  try {
    let reply;

    if (provider === "chatgpt") {
      reply = await chatgptHandler(message);
    } else if (provider === "gemini") {
      reply = await geminiHandler(message);
    } else {
      return res.status(400).json({ error: "Invalid provider" });
    }

    res.json({ reply });

  } catch (err) {
    console.error("AI ERROR:", err.message);
    res.status(500).json({ error: "AI request failed" });
  }
});

/* =========================
   SERVER START
========================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});