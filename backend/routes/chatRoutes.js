const express = require('express');
const router = express.Router();
const axios = require('axios');
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');

// 🧠 Chat storage-related routes
router.post('/', authMiddleware, chatController.createMessage);
router.get('/threads', authMiddleware, chatController.getThreads);
router.get('/thread/:thread_id', authMiddleware, chatController.getMessagesByThread);
router.delete('/thread/:thread_id', authMiddleware, chatController.deleteThread);

// 🆕 Create a new thread
router.post('/threads', authMiddleware, chatController.createThread);

// 🤖 AI Assistant Chat (LLM Proxy)
router.post('/message', authMiddleware, async (req, res) => {
  const { content } = req.body;
  console.log("📥 POST /api/chat/message");
  console.log("📝 Received content:", content);

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error("❌ Missing GROQ_API_KEY in .env");
    return res.status(500).json({ reply: "❌ Server misconfiguration: Missing API key." });
  }

  try {
    const groqRes = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-8b-8192',
        messages: [{ role: 'user', content }]
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const reply = groqRes.data.choices?.[0]?.message?.content ?? '🤖 No response.';
    console.log("✅ AI Reply:", reply);
    res.json({ reply });

  } catch (err) {
    console.error("❌ AI Error:", err?.response?.data || err.message);
    res.status(500).json({ reply: "❌ Failed to get AI response." });
  }
});

module.exports = router;
