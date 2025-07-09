// src/components/ShrijiSecretTrigger.jsx

import React, { useState } from "react";
import ShrijiBox from "./ShrijiBox";

export default function ShrijiSecretTrigger() {
  const [tapCount, setTapCount] = useState(0);
  const [showBox, setShowBox] = useState(false);

  const handleTap = () => {
    setTapCount((prev) => {
      const newCount = prev + 1;
      if (newCount >= 11) {
        setShowBox(true);
        setTimeout(() => setTapCount(0), 2000); // reset after trigger
      }
      return newCount;
    });
  };

  return (
    <>
      {/* 📍 Invisible Tap Zone */}
      <div
        onClick={handleTap}
        className="fixed bottom-20 right-4 w-10 h-10 z-50"
        style={{ WebkitTapHighlightColor: "transparent" }}
      ></div>

      {showBox && <ShrijiBox onClose={() => setShowBox(false)} />}
    </>
  );
}
