import React, { useState, useRef, useEffect } from "react";
import { CaretDown } from "phosphor-react";
import { filterTypes, assistantOptions } from "../utils/filterOptions";

export default function HistoryToolbar({ filters, setFilters }) {
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [showAssistantMenu, setShowAssistantMenu] = useState(false);
  const typeRef = useRef(null);
  const assistantRef = useRef(null);

  const handleClickOutside = (e) => {
    if (
      typeRef.current &&
      !typeRef.current.contains(e.target) &&
      assistantRef.current &&
      !assistantRef.current.contains(e.target)
    ) {
      setShowTypeMenu(false);
      setShowAssistantMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTypeChange = (type) => {
    setFilters((prev) => ({ ...prev, type }));
    setShowTypeMenu(false);
  };

  const handleAssistantChange = (assistant) => {
    setFilters((prev) => ({ ...prev, assistant }));
    setShowAssistantMenu(false);
  };

  return (
    <div className="flex justify-start items-center mb-4 gap-4 relative flex-wrap">
      {/* Type Dropdown */}
      <div className="relative" ref={typeRef}>
        <button
          onClick={() => {
            setShowTypeMenu((prev) => !prev);
            setShowAssistantMenu(false);
          }}
          className="bg-[#1e1e1e] border border-gray-700 text-sm px-3 py-2 rounded-lg text-gray-300 flex items-center gap-1"
        >
          Type: {filters.type}
          <CaretDown size={14} />
        </button>

        {showTypeMenu && (
          <div className="absolute z-10 mt-2 w-32 bg-[#1e1e1e] border border-gray-700 rounded-xl shadow">
            {filterTypes.map((t) => (
              <button
                key={t}
                onClick={() => handleTypeChange(t)}
                className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-purple-700"
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Assistant Dropdown */}
      <div className="relative" ref={assistantRef}>
        <button
          onClick={() => {
            setShowAssistantMenu((prev) => !prev);
            setShowTypeMenu(false);
          }}
          className="bg-[#1e1e1e] border border-gray-700 text-sm px-3 py-2 rounded-lg text-gray-300 flex items-center gap-1"
        >
          Assistant: {filters.assistant}
          <CaretDown size={14} />
        </button>

        {showAssistantMenu && (
          <div className="absolute z-10 mt-2 w-36 bg-[#1e1e1e] border border-gray-700 rounded-xl shadow">
            {assistantOptions.map((a) => (
              <button
                key={a}
                onClick={() => handleAssistantChange(a)}
                className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-yellow-700"
              >
                {a}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
