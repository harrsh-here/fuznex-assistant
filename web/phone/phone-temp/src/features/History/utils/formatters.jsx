import {
  ChatText,
  Alarm,
  Gear,
  ClipboardText,
  UserCircle,
  BellRinging,
} from "phosphor-react";

/**
 * Returns a React component for a given history type
 */
export function iconFor(type) {
  switch (type) {
    case "chat":
      return () => <ChatText size={18} />;
    case "alarm":
      return () => <Alarm size={18} />;
    case "system":
      return () => <Gear size={18} />;
    case "todo":
      return () => <ClipboardText size={18} />;
    case "notification":
      return () => <BellRinging size={18} />;
    default:
      return () => <UserCircle size={18} />;
  }
}

export function summarize(entry) {
  if (entry.text) return entry.text;
  if (entry.interaction) return entry.interaction;
  return "[No content]";
}

export function formatTimestamp(dateStr) {
  try {
    const d = new Date(dateStr);
    if (isNaN(d)) return "Invalid Date";

    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };

    return d.toLocaleString("en-US", options).replace(",", " •");
  } catch {
    return "Invalid Date";
  }
}
