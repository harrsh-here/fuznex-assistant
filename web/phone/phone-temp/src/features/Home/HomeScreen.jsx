import React, { useState, useEffect, useRef } from "react";
import { Mic, Send, Bell } from "lucide-react";

const recentActivities = [
  "🔔 Alarm set for 7:00 AM tomorrow.",
  "✅ Task \"Submit end-of-day report to manager\" completed.",
  "💬 GPT: Here's the weather forecast for your area...",
];

const upcomingEvents = [
  "💜 Whisper something to her at 11:11.",
  "📅 Meeting at 4:00 PM with the AI team.",
  "📝 To-Do: Grocery shopping before 6 PM.",
  "⏰ Alarm set for morning walk at 6:30 AM.",
];

const suggestions = [
  "Set an alarm",
  "Increase brightness",
  "Decrease volume",
  "Create a to-do",
  "Poem",
  "Kavita",
];

export default function HomeScreen({ onNavigate }) {
  const [expandedText, setExpandedText] = useState(null);
  const [inputText, setInputText] = useState("");
  const [responseText, setResponseText] = useState(null);
  const [listening, setListening] = useState(false);
  const inputRef = useRef(null);
  const [volume, setVolume] = useState(40);
  const [brightness, setBrightness] = useState(70);

  const handleBoxClick = (text) => setExpandedText(text);
  const handleClose = () => setExpandedText(null);

  const handleSend = () => {
    
    if (!inputText.trim()) return;
    const txt = inputText.toLowerCase();

    if (txt.includes("kavita")) {
      setResponseText(
        <em className="whitespace-pre-line">
          {`ये दुनिया, ये लोग, ये रिश्ते,
ये सब जाली है,
मसलन अब तो कुछ बचा भी है क्या,
तू ही इश्क़ तू ही जीवन,
तू ही सवेरे की रोशनी प्रतिभा–शाली है
तेरे सिवा मधुबन भी जर्जर पवन
और तेरे सिवा बिताई ये रातें भी बस
अंधेरी घनी और काली है
तेरे होने से नूर है,
ना होने से सब चूर-चूर।`}
        </em>
      );
    } else if (txt.includes("poem")) {
      onNavigate("chat");
      setResponseText(
        <em className="whitespace-pre-line">
          {`Ye duniya, ye log, ye rishte,
Ye sab jaali hai,
Maslan ab to kuch bacha bhi hai kya,
Tu hi ishq, tu hi jeevan,
Tu hi savere ki roshni pratibhashali hai,
Tere siwa madhuban bhi jarjar pawan,
Aur tere siwa bitayi ye raatein bhi bas
andheri, ghani aur kaali hai.
Tere hone se noor hai,
Naa hone se sab choor-choor.`}
        </em>
      );
    } else if (txt.includes("increase")) {
      if (txt.includes("volume")) setVolume((v) => Math.min(v + 10, 100));
      if (txt.includes("brightness")) setBrightness((b) => Math.min(b + 10, 100));
      setResponseText("✅ Volume/Brightness updated successfully.");
    } else if (txt.includes("decrease")) {
      if (txt.includes("volume")) setVolume((v) => Math.max(v - 10, 0));
      if (txt.includes("brightness")) setBrightness((b) => Math.max(b - 10, 0));
      setResponseText("✅ Volume/Brightness updated successfully.");
    } else if (txt.includes("alarm") || txt.includes("to-do"))
       {
      setResponseText("⏳ This feature is yet to be added. Please wait.");
    }
  else if (txt.includes("prompts")) {
      
       setResponseText(
        <em className="whitespace-pre-line">
          {`1. Set an alarm  
2. Increase brightness  
3. Decrease volume  
4. Create a to-do  
5. Poem  
6. Kavita  
7. Prompts`}
        </em>
      );
    }
       
    setInputText("");
  };

  const handleMicClick = () => setListening((prev) => !prev);

  const handleSuggestionClick = (text) => {
    setInputText(text);
    setTimeout(handleSend, 200);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    };
    const node = inputRef.current;
    node?.addEventListener("keydown", handleKeyDown);
    return () => node?.removeEventListener("keydown", handleKeyDown);
  }, [inputText]);

  const handleClear = () => setResponseText(null);

  return (
    <div className="flex flex-col h-full justify-between px-5 py-6 pt-12 bg-gradient-to-br from-[#0f0f0f] via-[#181818] to-[#111111] text-white relative overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent hover:scrollbar-thumb-gray-600">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Hello, Harsh 👋</h2>
          <p className="text-xs text-gray-400">What would you like me to do?</p>
        </div>
        <button
          className="relative rounded-full"
          onClick={() => onNavigate("notifications")}
        >
          <Bell className="w-6 h-6 text-purple-400" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-purple-500 rounded-full" />
        </button>
      </div>

      <div className="flex gap-4 items-center mb-5 text-sm text-gray-300">
        <span>🔊 {volume}%</span>
        <span>💡 {brightness}%</span>
      </div>

      {responseText && (
        <div className="mb-4 bg-[#1e1e1e] text-sm text-gray-100 border border-gray-700 rounded-xl p-4 shadow relative max-h-60 overflow-y-auto">
          {responseText}
          <button
            onClick={handleClear}
            className="absolute top-2 right-2 text-xs text-gray-400 hover:text-red-400"
          >
            Clear
          </button>
        </div>
      )}

      {!responseText && (
        <div className="mb-4 space-y-4 text-xs">
          <div>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-sm font-semibold text-gray-400">Recent Activity</h2>
              <button
                onClick={() => onNavigate("history")}
                className="text-purple-400 text-s hover:underline"
              >
                View More &gt;
              </button>
            </div>
            <div className="space-y-4">
              {recentActivities.slice(0, 3).map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => handleBoxClick(item)}
                  className="bg-[#1e1e1e] cursor-pointer rounded-xl px-4 py-2 text-gray-200 border border-[#2a2a2a] hover:bg-[#272727] transition"
                >
                  {item.length > 60 ? item.slice(0, 60) + "..." : item}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-semibold text-gray-400">Upcoming Events</h3>
              <button
                onClick={() => onNavigate("tasks")}
                className="text-purple-400 text-xs hover:underline"
              >
                View More &gt;
              </button>
            </div>
            <div className="space-y-4">
              {upcomingEvents.slice(0, 3).map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => handleBoxClick(item)}
                  className="bg-[#1e1e1e] cursor-pointer rounded-xl px-4 py-2 text-gray-200 border border-[#2a2a2a] hover:bg-[#272727] transition"
                >
                  {item.length > 60 ? item.slice(0, 60) + "..." : item}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!responseText && (
        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-thin scrollbar-thumb-purple-400/30 scrollbar-track-transparent hover:scrollbar-thumb-purple-600">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => handleSuggestionClick(s)}
              className="whitespace-nowrap text-xs px-3 py-1.5 rounded-xl border border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white transition"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="mt-auto pt-3 flex items-end gap-2 border-t border-[#2a2a2a] bg-[#1a1a1a] rounded-xl px-3 py-2 shadow-inner">
        <button
          className="p-2 rounded-full hover:bg-[#333] transition"
          onClick={handleMicClick}
        >
          <Mic className="w-5 h-5 text-purple-400" />
        </button>
        <textarea
          ref={inputRef}
          rows={1}
          value={inputText}
          onChange={(e) => setInputText(e.target.value.slice(0, 1000))}
          placeholder="Ask me anything..."
          className="flex-1 max-h-48 resize-none px-4 py-2 bg-[#121212] text-white border border-[#2a2a2a] rounded-xl text-sm placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 overflow-y-auto scrollbar-hide"
        />
        <button
          className="p-2 rounded-full bg-purple-600 hover:bg-purple-700 transition"
          onClick={handleSend}
        >
          <Send className="w-5 h-5 text-white" />
        </button>
      </div>

      {listening && (
        <div
          className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-50"
          onClick={() => setListening(false)}
        >
          <Mic className="w-16 h-16 text-purple-400 mb-4" />
          <p className="text-purple-300 text-lg mb-2">Listening...</p>
          <div className="border border-purple-500 rounded-xl px-4 py-2 text-sm text-white">
            (Live speech will appear here...)
          </div>
        </div>
      )}

      {expandedText && (
        <div
          className="absolute inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={handleClose}
        >
          <div
            className="bg-[#1e1e1e] text-sm text-gray-100 border border-gray-700 rounded-2xl p-6 shadow-lg max-w-xs"
            onClick={(e) => e.stopPropagation()}
          >
            {expandedText}
          </div>
        </div>
      )}
    </div>
  );
}
