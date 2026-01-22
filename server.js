import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Yokairo AI server running");
});

/* ---------- GEMINI ---------- */
async function geminiReply(message) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: message }] }],
      }),
    }
  );

  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "No Gemini reply";
}

/* ---------- CHATGPT ---------- */
async function chatgptReply(message) {
  const res = await fetch(
    "https://api.openai.com/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: message }],
      }),
    }
  );

  const data = await res.json();
  return data?.choices?.[0]?.message?.content || "No ChatGPT reply";
}

/* ---------- ONE API ---------- */
app.post("/ai", async (req, res) => {
  const { provider, message } = req.body;

  if (!provider || !message) {
    return res.status(400).json({ error: "provider & message required" });
  }

  try {
    let reply;

    if (provider === "gemini") {
      reply = await geminiReply(message);
    } else if (provider === "chatgpt") {
      reply = await chatgptReply(message);
    } else {
      return res.status(400).json({ error: "Invalid provider" });
    }

    res.json({ reply });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});