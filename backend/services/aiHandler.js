// utils/aiHandler.js
const { Groq } = require("groq-sdk");
const OpenAI = require("openai");

const groq = new Groq();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Handles AI response for supported models (Groq, OpenAI, future: Gemini, Together, etc.)
 * @param {string} model - Assistant model (e.g. 'groq', 'openai')
 * @param {Array} messages - Array of messages [{ role: 'user' | 'assistant', content: string }]
 * @returns {Promise<{ reply: string, raw?: object }>}
 */
async function getAIResponse(model, messages) {
  let reply = "Thinking...";

  try {
    switch (model) {
      case "groq": {
        const response = await groq.chat.completions.create({
          model: "meta-llama/llama-4-scout-17b-16e-instruct",
          messages,
          temperature: 1.23,
          max_completion_tokens: 1024,
        });

        reply = response.choices?.[0]?.message?.content || reply;
        return { reply, raw: response };
      }

      case "openai": {
        const response = await openai.chat.completions.create({
          model: "gpt-4",
          messages,
          temperature: 0.9,
          max_tokens: 1024,
        });

        reply = response.choices?.[0]?.message?.content || reply;
        return { reply, raw: response };
      }

      default:
        throw new Error(`Unsupported assistant model: ${model}`);
    }
  } catch (err) {
    console.error("❌ AI Handler Error:", err.message);
    throw new Error("AI service failed: " + err.message);
  }
}

module.exports = {
  getAIResponse,
};
