// src/screens/ChatScreen.jsx
import React, { useEffect, useRef, useState } from "react";
import { Menu, Mic, Send, Loader } from "lucide-react";
import api from "../../api/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import ChatMessage from "./ChatMessage"; // adjust path

dayjs.extend(relativeTime);

export default function ChatScreen() {
  const [chatList, setChatList] = useState([]);
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello! I’m Nexmind (Beta). How can I assist you today?",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedThread, setSelectedThread] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef(null);

  const fetchThreads = async () => {
    try {
      const res = await api.get("/chat/threads");
      const threads = Array.isArray(res.data)
        ? res.data
        : typeof res.data === "object" && res.data !== null
        ? [res.data]
        : [];
      setChatList(threads);
    } catch (err) {
      console.error("Error fetching threads:", err);
    }
  };

  const createNewThread = async () => {
    try {
      const res = await api.post("/chat/threads", {
        thread_title: "Untitled",
        assistant_model: "nexmind-beta",
      });
      setSelectedThread(res.data);
      setMessages([
        {
          sender: "ai",
          text: "Started a new chat. How can I help you today?",
        },
      ]);
      fetchThreads();
      setShowSidebar(false);
    } catch (err) {
      console.error("Failed to create new thread:", err);
    }
  };

  const handleSend = async () => {
    const trimmed = inputText.trim();
    if (!trimmed || !selectedThread || isLoading) return;

    const userMessage = { sender: "user", text: trimmed };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInputText("");
    setIsLoading(true);

    try {
      const formattedMessages = updatedMessages.map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text,
      }));

      const res = await api.post("/chat/message", {
        thread_id: selectedThread.thread_id,
        thread_title: selectedThread.thread_title,
        assistant_model: "nexmind-beta",
        sender: "user",
        content: trimmed,
        messages: formattedMessages, // 🧠 Context memory for Groq/OpenAI
      });

      const assistantReply = res.data.reply || "Nexmind is thinking...";
      setMessages((prev) => [...prev, { sender: "ai", text: assistantReply }]);
    } catch (err) {
      console.error("Error sending message:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Sorry, Nexmind failed to respond." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchThreads();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="relative w-full h-full bg-[#0e0e11] text-white p-4 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setShowSidebar(true)}
          className="p-2 bg-[#1f1f24] hover:bg-[#2d2d33] rounded-md"
        >
          <Menu className="w-5 h-5 text-purple-400" />
        </button>
        <h2 className="text-xl font-semibold text-white">Nexmind (Beta)</h2>
        <div className="w-10" />
      </div>

      {/* Sidebar */}
      {showSidebar && (
        <div className="absolute top-0 left-0 w-[260px] h-full bg-[#1a1a1f] z-30 shadow-2xl border-r border-purple-900 p-4 transition-all">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">My Chats</h3>
            <button
              onClick={() => setShowSidebar(false)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          <button
            onClick={createNewThread}
            className="w-full mb-4 bg-purple-600 hover:bg-purple-700 rounded-lg py-2 text-sm"
          >
            + New Chat
          </button>

          <div className="space-y-2 max-h-[80vh] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-purple-500/30 hover:scrollbar-thumb-purple-500/60">
            {chatList.map((chat) => (
              <div
                key={chat.chat_id || chat.thread_id}
                onClick={() => {
                  setSelectedThread(chat);
                  setMessages([
                    {
                      sender: "ai",
                      text: `Switched to: ${chat.thread_title}`,
                    },
                  ]);
                  setShowSidebar(false);
                }}
                className="bg-[#2c2c32] px-3 py-2 rounded-lg hover:bg-[#393940] cursor-pointer transition"
              >
                <div className="text-sm font-semibold">
                  {chat.thread_title}
                </div>
                <div className="text-xs text-gray-400">
                  {dayjs(chat.created_at).fromNow()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div className="w-full h-[calc(100%-64px)] flex flex-col justify-between rounded-xl bg-[#16161a] border border-[#2e2e36] overflow-hidden relative z-10">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 scrollbar-thin scrollbar-thumb-[#3a3a3f]">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 rounded-xl text-sm leading-snug ${
                  msg.sender === "user"
                    ? "bg-purple-600 text-white"
                    : "bg-[#26262c] text-gray-100"
                } shadow-sm`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 px-4 py-2 text-sm bg-[#26262c] text-gray-100 rounded-xl shadow-sm">
                <Loader className="w-4 h-4 animate-spin" /> Generating reply…
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <div className="flex items-center px-4 py-3 bg-[#1e1e24] border-t border-[#2e2e36]">
          <button className="mr-2 p-2 hover:bg-[#2d2d33] rounded-full">
            <Mic className="w-5 h-5 text-purple-400" />
          </button>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !isLoading && handleSend()}
            placeholder="Ask something..."
            className="flex-1 bg-transparent text-sm placeholder-gray-400 outline-none"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            className="ml-2 p-2 bg-purple-600 hover:bg-purple-700 rounded-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Send className="w-4 h-4 text-white" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
