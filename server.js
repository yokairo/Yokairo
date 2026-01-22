import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// 🔹 Health check
app.get("/", (req, res) => {
  res.send("✅ Yokairo AI server running");
});

// 🔹 Unified AI endpoint
app.post("/ai", async (req, res) => {
  const { provider, message } = req.body;

  if (!provider || !message) {
    return res.status(400).json({
      error: "provider and message required"
    });
  }

  try {
    // ================= CHATGPT =================
    if (provider === "chatgpt") {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: message }]
          })
        }
      );

      const data = await response.json();
      return res.json({
        provider: "chatgpt",
        reply: data.choices[0].message.content
      });
    }

    // ================= GEMINI =================
    if (provider === "gemini") {
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
      return res.json({
        provider: "gemini",
        reply: data.candidates[0].content.parts[0].text
      });
    }

    return res.status(400).json({ error: "Invalid provider" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI request failed" });
  }
});

// 🔹 Server start
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});