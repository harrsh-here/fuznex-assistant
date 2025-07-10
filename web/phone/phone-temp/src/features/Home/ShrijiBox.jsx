// src/features/Home/ShrijiBox.jsx
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function ShrijiBox({ onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // slight delay for animation
    const timeout = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`relative bg-gradient-to-br from-[#1b1b1b] via-[#222] to-[#181818] border border-purple-800 text-white rounded-2xl p-6 w-[85%] max-w-sm shadow-xl transition-all duration-500 ease-out transform ${
          visible ? "opacity-100 scale-100" : "opacity-0 scale-90"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <h2 className="text-center text-lg font-bold text-purple-400 mb-4">
          Only for you
        </h2>

        {/* Kavita */}
        <p className="text-sm text-gray-200 whitespace-pre-line font-[500] tracking-wide leading-relaxed">
          {`ये दुनिया, ये लोग, ये रिश्ते,\nये सब जाली है,\nमसलन अब तो कुछ बचा भी है क्या,\nतू ही इश्क़ तू ही जीवन,\nतू ही सवेरे की रोशनी प्रतिभा–शाली है\nतेरे सिवा मधुबन भी जर्जर पवन\nऔर तेरे सिवा बिताई ये रातें भी बस\nअंधेरी घनी और काली है\nप्रिये तुम वो राधा हो,\nजिसके बिना मेरे हृदय का वृंदावन खाली है।`}
        </p>
    
        {/* Soft Glow Ring */}
        <div className="absolute inset-0 rounded-2xl border border-purple-500 opacity-20 animate-pulse pointer-events-none" />
      </div>
    </div>
  );
}
