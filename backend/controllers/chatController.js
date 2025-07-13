// backend/controllers/chatController.js
const Chat = require('../models/Chat');
const crypto = require('crypto');
const axios = require('axios');

const ENCRYPTION_KEY = process.env.CHAT_ENCRYPTION_KEY; // Must be 64 hex characters (32 bytes)
const IV_LENGTH = 16;

const key = Buffer.from(ENCRYPTION_KEY, 'hex');
console.log("✅ Encryption key length (bytes):", key.length);

if (key.length !== 32) {
  console.error("❌ CHAT_ENCRYPTION_KEY must be 64 hex characters (32 bytes). Fix your .env file.");
  process.exit(1);
}

// Encryption function
function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(text, 'utf8');
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

// Decryption function
function decrypt(text) {
  const parts = text.split(':');
  const iv = Buffer.from(parts.shift(), 'hex');
  const encryptedText = Buffer.from(parts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

// Optional: Title generator using Groq
async function generateTitleFromPrompt(prompt) {
  try {
    const res = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content: 'You are an AI summarizer. Create a short, clear title (2–5 words max) for this conversation. Avoid punctuation.'
          },
          { role: 'user', content: prompt }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return res.data.choices?.[0]?.message?.content?.trim() || 'New Chat';
  } catch (err) {
    console.warn('⚠️ Title generation failed, using default.');
    return 'New Chat';
  }
}

// ✅ Create a new thread
exports.createThread = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { thread_title, assistant_model, initial_prompt } = req.body;

    const title =
      thread_title ||
      (initial_prompt ? await generateTitleFromPrompt(initial_prompt) : 'New Chat');

    const thread_id = `thread-${crypto.randomUUID().slice(0, 8)}`;

    const newThread = await Chat.create({
      user_id,
      thread_id,
      thread_title: title,
      assistant_model: assistant_model || 'nexmind-beta',
      sender: 'system',
      encrypted_content: encrypt('📌 Thread created'),
    });

    res.status(201).json({
      message: 'Thread created',
      thread_id,
      thread_title: title,
      assistant_model: assistant_model || 'nexmind-beta',
    });
  } catch (error) {
    console.error('Create Thread Error:', error);
    res.status(500).json({ error: 'Failed to create thread' });
  }
};

// ✅ Create a new chat message
exports.createMessage = async (req, res) => {
  try {
    const { thread_id, thread_title, assistant_model, sender, content } = req.body;
    const user_id = req.user.id;

    const encrypted_content = encrypt(content);

    const message = await Chat.create({
      user_id,
      thread_id,
      thread_title,
      assistant_model,
      sender,
      encrypted_content,
    });

    res.status(201).json({ message: 'Message saved', chat_id: message.chat_id });
  } catch (error) {
    console.error('Create Chat Error:', error);
    res.status(500).json({ error: 'Failed to save chat message' });
  }
};

// ✅ Get messages in a thread
exports.getMessagesByThread = async (req, res) => {
  try {
    const { thread_id } = req.params;
    const user_id = req.user.id;

    const messages = await Chat.findAll({
      where: { user_id, thread_id },
      order: [['created_at', 'ASC']],
    });

    const decrypted = messages.map(msg => ({
      ...msg.toJSON(),
      content: decrypt(msg.encrypted_content),
    }));

    res.json(decrypted);
  } catch (error) {
    console.error('Fetch Thread Error:', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
};

// ✅ Get latest message per thread
exports.getThreads = async (req, res) => {
  try {
    const user_id = req.user.id;

    const [results] = await Chat.sequelize.query(
      `
      SELECT cd.*
      FROM chat_data cd
      INNER JOIN (
        SELECT thread_id, MAX(created_at) AS max_created
        FROM chat_data
        WHERE user_id = ?
        GROUP BY thread_id
      ) latest ON cd.thread_id = latest.thread_id AND cd.created_at = latest.max_created
      WHERE cd.user_id = ?
      ORDER BY cd.created_at DESC
      `,
      {
        replacements: [user_id, user_id],
        type: Chat.sequelize.QueryTypes.SELECT,
      }
    );

    res.json(results);
  } catch (error) {
    console.error('Fetch Threads Error:', error);
    res.status(500).json({ error: 'Failed to fetch threads' });
  }
};

// ✅ Delete a full thread
exports.deleteThread = async (req, res) => {
  try {
    const { thread_id } = req.params;
    const user_id = req.user.id;

    await Chat.destroy({ where: { user_id, thread_id } });
    res.json({ message: 'Thread deleted successfully' });
  } catch (error) {
    console.error('Delete Thread Error:', error);
    res.status(500).json({ error: 'Failed to delete thread' });
  }
};

// ✅ Simple test response
exports.sendMessage = async (req, res) => {
  try {
    const content = req.body.content;
    res.json({ reply: 'Echo: ' + content });
  } catch (error) {
    console.error('Send Message Error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};
