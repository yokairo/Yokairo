import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

/* =========================
   CHATGPT HANDLER
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
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: message }]
      })
    }
  );

  const data = await response.json();

  if (!data.choices || !data.choices[0]) {
    throw new Error("Empty ChatGPT response");
  }

  return data.choices[0].message.content;
}

/* =========================
   GEMINI HANDLER
========================= */
async function geminiHandler(message) {
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

  const data = await response.json();

  if (
    !data.candidates ||
    !data.candidates[0] ||
    !data.candidates[0].content
  ) {
    throw new Error("Empty Gemini response");
  }

  return data.candidates[0].content.parts[0].text;
}

/* =========================
   MAIN AI ROUTE
========================= */
app.post("/ai", async (req, res) => {
  try {
    const { provider, message } = req.body;

    if (!provider || !message) {
      return res.status(400).json({ error: "provider and message required" });
    }

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
   HEALTH CHECK
========================= */
app.get("/", (req, res) => {
  res.send("Yokairo AI Server is running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});