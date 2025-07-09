// src/features/Home/components/ListeningHints.jsx
import React from "react";

export default function ListeningHints() {
  const hints = [
    "Try saying: 'Set an alarm for 6 AM'",
    "Try: 'Remind me to drink water'",
    "Say: 'Turn down the brightness'",
    "Ask: 'What's on my to-do list?'",
  ];

  return (
    <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-2xl p-4">
      <div className="text-sm font-semibold text-gray-300 mb-2">
        💡 Voice Tips
      </div>
      <ul className="space-y-1 text-xs text-gray-400 list-disc list-inside">
        {hints.map((hint, idx) => (
          <li key={idx}>{hint}</li>
        ))}
      </ul>
    </div>
  );
}
