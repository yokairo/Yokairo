import express from "express";

const app = express();
app.use(express.json());

/* ================= CHATGPT (WORKING & FIXED) ================= */
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
        messages: [
          { role: "user", content: message }
        ]
      })
    }
  );

  const data = await response.json();

  if (!data.choices || !data.choices.length) {
    console.error("ChatGPT raw response:", data);
    throw new Error("ChatGPT failed");
  }

  return data.choices[0].message.content;
}

/* ================= MAIN API ================= */
app.post("/ai", async (req, res) => {
  try {
    const { provider = "chatgpt", message } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "message required"
      });
    }

    let reply;

    // ONLY CHATGPT ACTIVE (Gemini intentionally removed)
    if (provider === "chatgpt") {
      reply = await chatgptHandler(message);
    } else {
      return res.status(400).json({
        error: "Invalid provider"
      });
    }

    res.json({ reply });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({
      error: "AI request failed"
    });
  }
});

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("✅ Server running on port", PORT);
});