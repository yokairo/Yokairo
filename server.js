import express from "express";
import { chatgptHandler, geminiHandler } from "./service.js";

const app = express();
app.use(express.json());

app.post("/ai", async (req, res) => {
  const { provider, message } = req.body;

  try {
    if (!message) {
      return res.status(400).json({ error: "Message missing" });
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

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get("/", (req, res) => {
  res.send("Yokairo AI Server Running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});