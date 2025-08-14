// src/features/Tasks/LoadingSpinner.jsx
import React from "react";

export default function LoadingSpinner({ size = 24, color = "white" }) {
  return (
    <div
      className={`animate-spin rounded-full border-t-2 border-b-2 border-${color} mx-auto`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderTopColor: color,
        borderBottomColor: color,
      }}
    />
  );
}
