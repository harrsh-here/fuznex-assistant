// ===== FINAL chatController.js with Together AI support =====
const { Groq } = require("groq-sdk");
const OpenAI = require("openai");
const axios = require("axios"); // ⬅️ Needed for Together AI
const { Op, fn, col } = require("sequelize");
const ChatData = require("../models/ChatData");
const { v4: uuidv4 } = require("uuid");
const Together = require("together-ai");

const together = new Together(); // Will use process.env.TOGETHER_API_KEY



const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.sendMessage = async (req, res) => {
  const { content, messages = [], thread_id, assistant_model } = req.body;
  const user_id = req.user?.id || 1;

  console.log("Received request:", { content, messages, thread_id, assistant_model });

  if (!content?.trim() || !Array.isArray(messages) || !thread_id) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const formattedMessages = messages.map((msg) => ({
    role: msg.sender === "user" ? "user" : "assistant",
    content: msg.text || msg.content,
  }));
  formattedMessages.push({ role: "user", content: content.trim() });

  try {
    const modelKey = assistant_model?.toLowerCase() || "groq";
    let reply = "I'm thinking about your question...";
    let modelDisplayName = assistant_model;

    // === AI Provider logic ===
    if (modelKey === "groq") {
      modelDisplayName = "Groq";
      try {
        const response = await groq.chat.completions.create({
          messages: formattedMessages,
          model: "llama3-8b-8192",
          temperature: 0.7,
          max_tokens: 1024,
        });
        reply = response.choices?.[0]?.message?.content?.trim() || reply;
      } catch (err) {
        console.error("Groq Error:", err);
        reply = "Sorry, Groq is unavailable.";
      }
    } else if (modelKey === "openai") {
      modelDisplayName = "OpenAI";
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: formattedMessages,
          temperature: 0.7,
          max_tokens: 1024,
        });
        reply = response.choices?.[0]?.message?.content?.trim() || reply;
      } catch (err) {
        console.error("OpenAI Error:", err);
        reply = "Sorry, OpenAI is unavailable.";
      }
    } else if (modelKey === "togetherai") {
      modelDisplayName = "TogetherAI";
      try {
       const response = await together.chat.completions.create({
  messages: formattedMessages,
  model: "meta-llama/Llama-3-70b-chat-hf", // or use "moonshotai/Kimi-K2-Instruct" if preferred
  temperature: 0.7,
  max_tokens: 1024,
});
reply = response.choices?.[0]?.message?.content?.trim() || reply;

       
      } catch (err) {
        console.error("Together AI Error:", err);
        reply = "Sorry, Together AI is unavailable.";
      }
    } else {
      modelDisplayName = modelKey;
      reply = `Hello! I'm your ${modelKey} assistant.`;
    }

    // Save user and AI messages
    const userMessage = await ChatData.create({
      user_id,
      thread_id,
      sender: "user",
      assistant_model: modelDisplayName,
      message: content.trim(),
      encrypted_content: content.trim(),
      content: content.trim(),
      is_encrypted: false,
    });

    const aiMessage = await ChatData.create({
      user_id,
      thread_id,
      sender: "ai",
      assistant_model: modelDisplayName,
      message: reply,
      encrypted_content: reply,
      content: reply,
      is_encrypted: false,
    });

    // Save thread title if not already set
    const hasTitle = await ChatData.findOne({
      where: { user_id, thread_id, thread_title: { [Op.ne]: null } },
    });

    if (!hasTitle) {
      const threadTitle = content.length > 50 ? content.slice(0, 47) + "..." : content;
      await ChatData.update(
        { thread_title: threadTitle },
        { where: { user_id, thread_id } }
      );
    }

    res.json({ reply, user_message: userMessage, ai_message: aiMessage });
  } catch (err) {
    console.error("❌ AI Error:", err.message);
    res.status(500).json({ error: "Assistant failed to respond.", detail: err.message });
  }
};

// Create new thread with first AI response
exports.createThread = async (req, res) => {
  const { initialMessage, assistantName } = req.body;
  const user_id = req.user?.id || 1;

  if (!initialMessage?.trim() || !assistantName) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    const thread_id = uuidv4();
    const modelKey = assistantName.toLowerCase();
    let modelDisplayName = assistantName;
    let reply = `Hello! I'm your ${assistantName} assistant.`;

    if (modelKey === "groq") {
      modelDisplayName = "Groq";
      try {
        const response = await groq.chat.completions.create({
          messages: [{ role: "user", content: initialMessage.trim() }],
          model: "llama3-8b-8192",
          temperature: 0.7,
          max_tokens: 1024,
        });
        reply = response.choices?.[0]?.message?.content?.trim() || reply;
      } catch (err) {
        console.error("Groq error:", err);
      }
    } else if (modelKey === "openai") {
      modelDisplayName = "OpenAI";
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: initialMessage.trim() }],
          temperature: 0.7,
          max_tokens: 1024,
        });
        reply = response.choices?.[0]?.message?.content?.trim() || reply;
      } catch (err) {
        console.error("OpenAI error:", err);
      }
    } else if (modelKey === "togetherai") {
      modelDisplayName = "TogetherAI";
      try {
       const response = await together.chat.completions.create({
  messages: [{ role: "user", content: initialMessage.trim() }],
  model: "meta-llama/Llama-3-70b-chat-hf", // or use "moonshotai/Kimi-K2-Instruct" if preferred
  temperature: 0.7,
  max_tokens: 1024,
});

         reply = response.choices?.[0]?.message?.content?.trim() || reply;
      } catch (err) {
        console.error("TogetherAI error:", err);
      }
    }

    // Save both messages
    const title = initialMessage.length > 50 ? initialMessage.slice(0, 47) + "..." : initialMessage;

    await ChatData.create({
      user_id,
      thread_id,
      sender: "user",
      assistant_model: modelDisplayName,
      message: initialMessage.trim(),
      encrypted_content: initialMessage.trim(),
      content: initialMessage.trim(),
      thread_title: title,
      is_encrypted: false,
    });

    await ChatData.create({
      user_id,
      thread_id,
      sender: "ai",
      assistant_model: modelDisplayName,
      message: reply,
      encrypted_content: reply,
      content: reply,
      thread_title: title,
      is_encrypted: false,
    });

    res.json({
      thread: {
        id: thread_id,
        thread_id,
        title,
        assistant_used: modelDisplayName,
        lastMessage: initialMessage.slice(0, 50) + (initialMessage.length > 50 ? "..." : ""),
        timestamp: new Date(),
      },
      message: "Thread created successfully",
    });
  } catch (err) {
    console.error("Thread creation error:", err.message);
    res.status(500).json({ error: "Failed to create thread.", detail: err.message });
  }
};
/**
 * 📜 Get all messages in a thread
 */
exports.getChatThread = async (req, res) => {
  try {
    const { threadId } = req.params;
    const messages = await ChatData.findAll({
      where: { thread_id: threadId },
      order: [["created_at", "ASC"]],
    });
    res.status(200).json(messages);
  } catch (err) {
    console.error("❌ Get Thread Error:", err.message);
    res.status(500).json({ 
      error: "Failed to get chat thread", 
      detail: err.message 
    });
  }
};

/**
 * 🧵 List all threads for current user
 */
exports.listThreads = async (req, res) => {
  try {
    const user_id = req.user?.id || 1; // Default user ID for demo
    
    const threads = await ChatData.findAll({
      where: {
        user_id,
        thread_title: { [Op.ne]: null },
      },
      attributes: [
        'thread_id',
        [fn('MAX', col('thread_title')), 'title'],
        [fn('MAX', col('assistant_model')), 'assistant_used'],
        [fn('MAX', col('created_at')), 'timestamp'],
        [fn('MAX', col('message')), 'lastMessage'],
      ],
      group: ['thread_id'],
      order: [[fn('MAX', col('created_at')), 'DESC']],
    });

    // Format response to match frontend expectations
    const formattedThreads = threads.map(thread => ({
      id: thread.thread_id,
      thread_id: thread.thread_id,
      title: thread.dataValues.title,
      assistant_used: thread.dataValues.assistant_used,
      lastMessage: thread.dataValues.lastMessage?.slice(0, 50) + 
                   (thread.dataValues.lastMessage?.length > 50 ? '...' : ''),
      timestamp: thread.dataValues.timestamp
    }));

    res.status(200).json(formattedThreads);
  } catch (err) {
    console.error("❌ List Threads Error:", err.message);
    res.status(500).json({ 
      error: "Failed to list threads", 
      detail: err.message 
    });
  }
};

/**
 * 🗑️ Delete a thread and all its messages
 */
exports.deleteChatThread = async (req, res) => {
  try {
    const { threadId } = req.params;
    const deletedCount = await ChatData.destroy({ 
      where: { thread_id: threadId } 
    });
    
    if (deletedCount === 0) {
      return res.status(404).json({ error: "Thread not found" });
    }
    
    res.status(200).json({ 
      message: "Thread deleted successfully",
      deletedCount 
    });
  } catch (err) {
    console.error("❌ Delete Thread Error:", err.message);
    res.status(500).json({ 
      error: "Failed to delete thread", 
      detail: err.message 
    });
  }
};

/**
 * 👍👎 Provide feedback for a chat message
 */
exports.giveChatFeedback = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { feedback } = req.body;
    
    const [updatedCount] = await ChatData.update(
      { feedback }, 
      { where: { chat_id: chatId } }
    );
    
    if (updatedCount === 0) {
      return res.status(404).json({ error: "Message not found" });
    }
    
    res.status(200).json({ message: "Feedback recorded" });
  } catch (err) {
    console.error("❌ Feedback Error:", err.message);
    res.status(500).json({ 
      error: "Failed to submit feedback", 
      detail: err.message 
    });
  }
};