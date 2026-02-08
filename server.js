// ✅ Import dependencies
import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

// ✅ Load environment variables
dotenv.config();

// ✅ Initialize app
const app = express();
app.use(cors());
app.use(express.json());

// ✅ Config
const AIRIA_KEY = process.env.AIRIA_KEY;
const AIRIA_URL =
  "https://api.airia.ai/v2/PipelineExecution/e5ef2bd1-1b53-47f0-b37b-a4e92250aea1";

// ✅ Analyze route
app.post("/analyze", async (req, res) => {
  try {
    console.log("🔹 Received input:", req.body.userInput);

    const response = await fetch(AIRIA_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": AIRIA_KEY,
      },
      body: JSON.stringify({
        userInput: req.body.userInput,
        asyncOutput: false,
      }),
    });

    console.log("🔹 Airia response status:", response.status);
    const data = await response.json();
    console.log("🔹 Raw response from Airia:", JSON.stringify(data, null, 2));

    let parsed;

    // ✅ Case 1: Newer Airia format (string under data.result)
    if (data.result && typeof data.result === "string") {
      parsed = JSON.parse(data.result);
    }
    // ✅ Case 2: Older Claude-style format
    else if (data.output?.[0]?.content?.[0]?.text) {
      parsed = JSON.parse(data.output[0].content[0].text);
    } else {
      throw new Error("Unrecognized Airia API response format");
    }

    res.json(parsed);
  } catch (err) {
    console.error("❌ Server error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Start backend
app.listen(5000, () =>
  console.log("✅ Backend running on http://localhost:5000"),
);
