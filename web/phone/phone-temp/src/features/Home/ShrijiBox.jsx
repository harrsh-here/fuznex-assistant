// src/components/ShrijiBox.jsx

import React from "react";
import { X } from "lucide-react";

const poemLines = [
  "ये दुनिया, ये लोग, ये रिश्ते,",
  "ये सब जाली है,",
  "मसलन अब तो कुछ बचा भी है क्या,",
  "तू ही इश्क़ तू ही जीवन,",
  "तू ही सवेरे की रोशनी प्रतिभा-शाली है",
  "तेरे सिवा मधुबन भी जर्जर पवन",
  "और तेरे सिवा बिताई ये रातें भी बस",
  "अंधेरी घनी और काली है",
  "प्रिये तुम वो राधा हो,",
  "जिसके बिना मेरे हृदय का वृंदावन खाली है।",
];

export default function ShrijiBox({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] overflow-hidden">
      
      {/* Glitter Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-full sparkle-bg opacity-20" />
      </div>

      {/* Poem Box */}
      <div className="relative w-[90%] max-w-sm bg-[#151515] border border-pink-500/20 rounded-2xl px-6 py-8 text-white shadow-xl animate-fadeInUpSlow overflow-hidden z-10">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 border-0 hover:text-red-500 transition bg-transparent"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <h2 className="text-center text-pink-400 font-semibold text-lg mb-5 tracking-wide">
          🌸 A Whisper From Beyond...
        </h2>

        {/* Poem */}
        <div className="text-center space-y-3 text-sm font-light">
          {poemLines.map((line, idx) => (
            <p
              key={idx}
              className={`opacity-0 animate-lineFadeIn animation-delay-${idx}`}
            >
              {line.includes("राधा") ? (
                <>
                  प्रिये तुम वो{" "}
                  <span className="text-pink-400 font-semibold text-base underline underline-offset-4 decoration-pink-500">
                    राधा
                  </span>{" "}
                  हो,
                </>
              ) : (
                line
              )}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
