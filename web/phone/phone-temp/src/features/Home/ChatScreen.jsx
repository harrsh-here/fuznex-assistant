import React, { useState, useEffect, useRef } from "react";
import { Mic, Send, LayoutDashboard } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function ChatScreen({ onNavigate }) {
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hi Harsh! How can I assist you today?" },
    { sender: "user", text: "Tell me a joke." },
    { sender: "ai", text: "Why did the computer go to art school? Because it had a lot of processing to express!" }
  ]);
  const [inputText, setInputText] = useState("");
  const [expandedInput, setExpandedInput] = useState(false);
  const [showChats, setShowChats] = useState(false);
  const sidebarRef = useRef(null);
  const chatEndRef = useRef(null);

  const [chatList, setChatList] = useState([
    { id: 1, title: "Morning Brainstorm", createdAt: dayjs().subtract(3, "hour") },
    { id: 2, title: "AI Queries", createdAt: dayjs().subtract(1, "day") },
    { id: 3, title: "Creative Writing", createdAt: dayjs().subtract(5, "day") },
    { id: 4, title: "Dev Notes", createdAt: dayjs().subtract(1, "week") },
    { id: 5, title: "UI Concepts", createdAt: dayjs().subtract(10, "day") },
    { id: 6, title: "Todo Ideas", createdAt: dayjs().subtract(12, "day") },
    { id: 7, title: "Personal Journaling", createdAt: dayjs().subtract(2, "week") },
    { id: 8, title: "Rhyming Fun", createdAt: dayjs().subtract(22, "day") },
    { id: 9, title: "Debugging Help", createdAt: dayjs().subtract(1, "month") },
    { id: 10, title: "Random Thoughts", createdAt: dayjs().subtract(2, "month") },
  ]);

  const handleSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;
       const lower = trimmed.toLowerCase();

    if (lower.includes("kavita")) {
      setMessages((prev) => [
        ...prev,
        { sender: "user", text: trimmed },
        {
          sender: "ai",
          text: `ये दुनिया, ये लोग, ये रिश्ते,\nये सब जाली है,\nमसलन अब तो कुछ बचा भी है क्या,\nतू ही इश्क़ तू ही जीवन,\nतू ही सवेरे की रोशनी प्रतिभाशाली है\nतेरे सिवा मधुबन भी जर्जर पवन\nऔर तेरे सिवा बिताई ये रातें भी बस\nअंधेरी घनी और काली है\nतेरे होने से नूर है,\nना होने से सब चूर-चूर।`,
        },
      ]);
      setInputText("");
      return;
    }

    if (lower.includes("poem")) {
      setMessages((prev) => [
        ...prev,
        { sender: "user", text: trimmed },
        {
          sender: "ai",
          text: `Ye duniya, ye log, ye rishte,\nYe sab jaali hai,\nMaslan ab to kuch bacha bhi hai kya,\nTu hi ishq, tu hi jeevan,\nTu hi savere ki roshni pratibhashali hai,\nTere siwa madhuban bhi jarjar pawan,\nAur tere siwa bitayi ye raatein bhi bas\nandheri, ghani aur kaali hai.\nTere hone se noor hai,\nNaa hone se sab choor-choor.`,
        },
      ]);
      setInputText("");
      return;
    }
    setMessages(prev => [...prev, { sender: "user", text: trimmed }]);
    setInputText("");
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setExpandedInput(inputText.length > 80);
  }, [inputText]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setShowChats(false);
      }
    };
    if (showChats) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showChats]);

  return (
    <div className="flex flex-col h-full px-4 py-6 bg-gradient-to-br from-[#0f0f0f] via-[#181818] to-[#111111] text-white relative">

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => setShowChats((prev) => !prev)}
          className="p-2 rounded-full hover:bg-[#333] transition"
        >
          <LayoutDashboard className="w-6 h-6 text-purple-400" />
        </button>
        <h2 className="text-2xl font-bold">Assistant Chat</h2>
      </div>

      {/* Chat List Sidebar */}
      {showChats && (
        <div
          ref={sidebarRef}
          className="absolute top-20 left-4 right-4 max-w-xs z-50 bg-[#1e1e1e] border border-purple-700 rounded-xl p-4 shadow-xl"
        >
          <h3 className="font-semibold mb-3 text-white text-lg">Your Chats</h3>
          <button
            onClick={() => {
              setMessages([{ sender: "ai", text: "New conversation started." }]);
              setShowChats(false);
            }}
            className="w-full mb-3 px-4 py-2 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-md transition"
          >
            + New Chat
          </button>
          <div className="space-y-2 text-sm max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-600/40 hover:scrollbar-thumb-purple-700">
            {chatList.map((chat) => (
              <div
                key={chat.id}
                className="bg-[#2a2a2a] px-3 py-2 rounded-lg border border-[#3a3a3a] hover:bg-[#353535] transition"
              >
                <div className="font-medium text-white">{chat.title}</div>
                <div className="text-gray-400 text-xs">{chat.createdAt.fromNow()}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent hover:scrollbar-thumb-gray-600">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] px-4 py-2 text-sm rounded-2xl border ${
                msg.sender === "ai"
                  ? "border-yellow-400 text-white bg-[#2a2a2a]"
                  : "border-purple-600 text-white bg-[#2a2a2a]"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input Bar */}
      <div className={`mt-4 flex items-end gap-2 bg-[#1a1a1a] rounded-xl px-3 py-2 border border-[#2a2a2a] shadow-inner ${
        expandedInput ? "fixed inset-0 z-50 m-5 items-start" : ""
      }`}>
        <button className="p-2 rounded-full hover:bg-[#333] transition">
          <Mic className="w-5 h-5 text-purple-400" />
        </button>
        <textarea
          rows={expandedInput ? 10 : 1}
          value={inputText}
          onChange={(e) => setInputText(e.target.value.slice(0, 1000))}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Type your message..."
          className="flex-1 bg-[#121212] resize-none text-white border-none outline-none text-sm placeholder-gray-500 rounded-xl p-2 overflow-y-auto max-h-72"
        />
        <button
          className="p-2 rounded-full bg-purple-600 hover:bg-purple-700 transition"
          onClick={handleSend}
        >
          <Send className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
}
