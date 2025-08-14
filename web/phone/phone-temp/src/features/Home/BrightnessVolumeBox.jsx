import React from "react";

export default function BrightnessVolumeBox({ volume = 50, brightness = 50 }) {
  return (
    <div className="flex justify-between items-center gap-4 mb-4 text-sm text-gray-300 px-2">
      <div className="flex-1 bg-[#1c1c1c] rounded-xl p-3 border border-[#2a2a2a] flex items-center gap-2">
        <span role="img" aria-label="volume">
          🔊
        </span>
        <span className="text-xs text-gray-400">Volume</span>
        <span className="ml-auto font-semibold text-white">{volume}%</span>
      </div>

      <div className="flex-1 bg-[#1c1c1c] rounded-xl p-3 border border-[#2a2a2a] flex items-center gap-2">
        <span role="img" aria-label="brightness">
          💡
        </span>
        <span className="text-xs text-gray-400">Brightness</span>
        <span className="ml-auto font-semibold text-white">{brightness}%</span>
      </div>
    </div>
  );
}
