

// ===== Fixed Controller: controllers/chatController.js =====
const { Groq } = require("groq-sdk");
const OpenAI = require("openai");
const { Op, fn, col } = require("sequelize");
const ChatData = require("../models/ChatData");
const { v4: uuidv4 } = require('uuid'); // You'll need to install uuid

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

/**
 * 🧠 Send message to AI assistant and save both user + AI messages
 */
exports.sendMessage = async (req, res) => {
  const { content, messages = [], thread_id, assistant_model } = req.body;
  const user_id = req.user?.id || 1; // Default user ID for demo

  console.log('Received request:', { content, messages, thread_id, assistant_model });

  if (!content?.trim() || !Array.isArray(messages) || !thread_id) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  // Format messages for AI API
  const formattedMessages = messages.map((msg) => ({
    role: msg.sender === "user" ? "user" : "assistant",
    content: msg.text || msg.content,
  }));
  formattedMessages.push({ role: "user", content: content.trim() });

  try {
    const model = assistant_model?.toLowerCase() || "groq";
    let reply = "I'm thinking about your question...";

    // Call AI service based on model
    if (model === "groq") {
      try {
        const response = await groq.chat.completions.create({
          messages: formattedMessages,
          model: "llama3-8b-8192", // Updated to a working model
          temperature: 0.7,
          max_tokens: 1024,
        });
        reply = response.choices?.[0]?.message?.content?.trim() || reply;
      } catch (groqError) {
        console.error('Groq API Error:', groqError);
        reply = "Sorry, I'm having trouble connecting to Groq. Please try again.";
      }

    } else if (model === "openai") {
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo", // Using a more available model
          messages: formattedMessages,
          temperature: 0.7,
          max_tokens: 1024,
        });
        reply = response.choices?.[0]?.message?.content?.trim() || reply;
      } catch (openaiError) {
        console.error('OpenAI API Error:', openaiError);
        reply = "Sorry, I'm having trouble connecting to OpenAI. Please try again.";
      }
    } else {
      reply = `Hello! I'm your ${model} assistant. How can I help you today?`;
    }

    // Save user message
    const userMessage = await ChatData.create({
      user_id,
      thread_id,
      sender: "user",
      assistant_model: model,
      message: content.trim(),
      encrypted_content: content.trim(),
      content: content.trim(),
      is_encrypted: false,
    });

    // Save AI reply
    const aiMessage = await ChatData.create({
      user_id,
      thread_id,
      sender: "ai",
      assistant_model: model,
      message: reply,
      encrypted_content: reply,
      content: reply,
      is_encrypted: false,
    });

    // Set thread title if not yet set (use first user message)
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

    res.json({ 
      reply,
      user_message: userMessage,
      ai_message: aiMessage
    });

  } catch (err) {
    console.error("❌ AI Error:", err.message);
    res.status(500).json({ 
      error: "Assistant failed to respond.", 
      detail: err.message 
    });
  }
};

/**
 * 🧵 Create a new thread
 */
exports.createThread = async (req, res) => {
  const { initialMessage, assistantName } = req.body;
  const user_id = req.user?.id || 1; // Default user ID for demo

  if (!initialMessage?.trim() || !assistantName) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    const thread_id = uuidv4();
    const model = assistantName.toLowerCase();
    
    // Create initial user message
    const userMessage = await ChatData.create({
      user_id,
      thread_id,
      sender: "user",
      assistant_model: model,
      message: initialMessage.trim(),
      encrypted_content: initialMessage.trim(),
      content: initialMessage.trim(),
      thread_title: initialMessage.length > 50 ? initialMessage.slice(0, 47) + "..." : initialMessage,
      is_encrypted: false,
    });

    // Generate AI response
    let reply = `Hello! I'm your ${assistantName} assistant. How can I help you today?`;
    
    if (model === "groq" && process.env.GROQ_API_KEY) {
      try {
        const response = await groq.chat.completions.create({
          messages: [{ role: "user", content: initialMessage.trim() }],
          model: "llama3-8b-8192",
          temperature: 0.7,
          max_tokens: 1024,
        });
        reply = response.choices?.[0]?.message?.content?.trim() || reply;
      } catch (error) {
        console.error('Groq API Error:', error);
      }
    } else if (model === "openai" && process.env.OPENAI_API_KEY) {
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: initialMessage.trim() }],
          temperature: 0.7,
          max_tokens: 1024,
        });
        reply = response.choices?.[0]?.message?.content?.trim() || reply;
      } catch (error) {
        console.error('OpenAI API Error:', error);
      }
    }

    // Create AI response
    await ChatData.create({
      user_id,
      thread_id,
      sender: "ai",
      assistant_model: model,
      message: reply,
      encrypted_content: reply,
      content: reply,
      thread_title: initialMessage.length > 50 ? initialMessage.slice(0, 47) + "..." : initialMessage,
      is_encrypted: false,
    });

    // Return thread info
    const thread = {
      id: thread_id,
      thread_id,
      title: userMessage.thread_title,
      assistant_used: model,
      lastMessage: initialMessage.slice(0, 50) + (initialMessage.length > 50 ? '...' : ''),
      timestamp: new Date()
    };

    res.json({ 
      thread,
      message: "Thread created successfully"
    });

  } catch (err) {
    console.error("❌ Thread Creation Error:", err.message);
    res.status(500).json({ 
      error: "Failed to create thread.", 
      detail: err.message 
    });
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