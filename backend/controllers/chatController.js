// backend/controllers/chatController.js
const { Groq } = require("groq-sdk");
const OpenAI = require("openai");

const groq = new Groq();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.sendMessage = async (req, res) => {
  const {
    content,
    messages = [],
    thread_id,
    thread_title,
    assistant_model = "nexmind-beta",
  } = req.body;

  if (!content || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Missing or invalid input" });
  }

  const trimmed = content.trim().toLowerCase();

  const sanitized =
    trimmed === "hi" || trimmed === "hello"
      ? [
          ...messages,
          {
            role: "assistant",
            content:
              "Hi! How's your day going so far? Is there something I can help you with or would you like to chat?",
          },
        ]
      : [...messages, { role: "user", content: trimmed }];

  try {
    const response = await groq.chat.completions.create({
      messages: sanitized,
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      temperature: 1.23,
      max_completion_tokens: 1024,
    });

    const reply = response.choices[0]?.message?.content || "Thinking...";
    return res.json({ reply });
  } catch (groqErr) {
    console.error("⚠️ Groq failed:", groqErr.message);

    try {
      const fallback = await openai.chat.completions.create({
        model: "gpt-4",
        messages: sanitized,
        temperature: 0.9,
        max_tokens: 1024,
      });

      const reply = fallback.choices[0]?.message?.content || "Processing...";
      return res.json({ reply });
    } catch (openaiErr) {
      console.error("❌ OpenAI also failed:", openaiErr.message);
      return res
        .status(500)
        .json({ error: "Both Groq and OpenAI failed to respond." });
    }
  }
};

// 💡 Placeholder implementations for missing exports
exports.createMessage = (req, res) => {
  res.status(200).json({ message: "createMessage placeholder" });
};

exports.getThreads = (req, res) => {
  res.status(200).json({ message: "getThreads placeholder" });
};

exports.getMessagesByThread = (req, res) => {
  res.status(200).json({ message: "getMessagesByThread placeholder" });
};

exports.deleteThread = (req, res) => {
  res.status(200).json({ message: "deleteThread placeholder" });
};

exports.createThread = (req, res) => {
  res.status(200).json({ message: "createThread placeholder" });
};
