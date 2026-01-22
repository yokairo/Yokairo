import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { geminiReply } from "./ai/gemini.js";
import { chatgptReply } from "./ai/chatgpt.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Yokairo AI server running");
});

app.post("/ai", async (req, res) => {
  try {
    const { provider, message } = req.body;

    if (!provider || !message) {
      return res.status(400).json({
        error: "provider and message required",
      });
    }

    let reply;

    if (provider === "gemini") {
      reply = await geminiReply(message);
    } else if (provider === "chatgpt") {
      reply = await chatgptReply(message);
    } else {
      return res.status(400).json({
        error: "Invalid provider",
      });
    }

    res.json({ provider, reply });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on", PORT);
});