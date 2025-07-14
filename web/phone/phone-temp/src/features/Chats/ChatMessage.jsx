// File: ChatMessage.jsx
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import classNames from "classnames";

export default function ChatMessage({ message, isUser }) {
  return (
    <div
      className={classNames(
        "w-full flex mb-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={classNames(
          "rounded-xl px-4 py-3 max-w-[85%] sm:max-w-[400px] whitespace-pre-wrap",
          isUser ? "bg-purple-600 text-white" : "bg-[#2a2a2a] text-gray-200"
        )}
        style={{ lineHeight: "1.5", fontSize: "14px", wordWrap: "break-word" }}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ node, ...props }) => (
              <h1 className="text-[18px] font-bold mb-2" {...props} />
            ),
            h2: ({ node, ...props }) => (
              <h2 className="text-[16px] font-bold mb-2" {...props} />
            ),
            p: ({ node, ...props }) => (
              <p className="mb-2 text-[14px]" {...props} />
            ),
            li: ({ node, ...props }) => (
              <li className="ml-4 list-disc mb-1" {...props} />
            ),
          }}
        >
          {message}
        </ReactMarkdown>
      </div>
    </div>
  );
}
