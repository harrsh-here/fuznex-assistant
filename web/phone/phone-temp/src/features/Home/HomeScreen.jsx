import React, { useState, useEffect } from "react";
import { Bell, PlusCircle } from "lucide-react";
import ShrijiBox from "./ShrijiBox"; // This stays separated and sacred ✨
import QuickActions from "./QuickActions"; 
import AddEditOverlay from "../Plans/AddEditOverlay";
import GreetingHeader from "./GreetingHeader";
import api from "../../api/api";
import UpcomingEvents from "./UpcomingEvents";
//const [addEditProps, setAddEditProps] = useState(null);



export default function HomeScreen({ onNavigate, user }) {
  const [expandedText, setExpandedText] = useState(null);
  const [shrijiVisible, setShrijiVisible] = useState(false);
  const [shrijiTapCount, setShrijiTapCount] = useState(0);
  const { name } = user || {};
 const [unreadCounthome, setUnreadCounthome] = useState(0);
 const [notifications, setNotifications] = useState([]);



  const handleExpand = (text) => setExpandedText(text);
  const closeExpand = () => setExpandedText(null);

 // 2a. Fetch notifications once on mount
 useEffect(() => {
  let isMounted = true;

  const fetchNotifications = () => {
    api.getNotifications()
      .then(res => {
        if (!isMounted) return;
        setNotifications(res.data);
        const unread = Array.isArray(res.data)
          ? res.data.filter(n => !n.read).length
          : 0;
        setUnreadCounthome(unread);
      })
      .catch(console.error);
  };

  fetchNotifications(); // initial fetch
  const interval = setInterval(fetchNotifications, 30000); // every 30 sec

  return () => {
    isMounted = false;
    clearInterval(interval);
  };
}, []);


  const handleShrijiTap = () => {
    setShrijiTapCount((prev) => {
      const next = prev + 1;
      if (next >= 11) {
        setShrijiVisible(true);
        return 0; // reset after open
      }
      return next;
    });
  };

  return (
    <div className="flex flex-col h-full px-5 py-6 pt-12 text-white bg-[#0f0f0f] overflow-y-auto scrollbar-none relative">
      {/* Greeting */}
      <GreetingHeader 
      user={user}
          onNotifications={() => onNavigate("notifications")}
       unreadCount={unreadCounthome}

      />
      {/* Task & Alarm Cards */}
       {/* Quick Actions */}
      <QuickActions
  onTabClick={onNavigate}
  onNavigate={onNavigate} 
  
/>


      {/* Additional Screen Sections */}
      {/* You can add your planner, calendar, notes, etc. */}
    

      {/* Upcoming Events */}
  
      <UpcomingEvents 
      onNavigate={onNavigate} />

      
      {/* 🪄 Secret Shriji Trigger */}
      <div
        onClick={handleShrijiTap}
        className="p-4 text-center text-xs italic text-purple-400 opacity-80 cursor-pointer hover:text-purple-300 transition mb-1"
      >
        "until we meet again..🥺"
      </div>

      {/* Spacer for navbar */}
      <div className="h-20" />

      {/* Expanded View */}
      {expandedText && (
        <div
          className="fixed inset-0 backdrop blur-10 bg-black/80 flex items-center justify-center z-50 p-5"
          onClick={closeExpand}
        >
          <div
            className="bg-[#1e1e1e] border border-gray-700 text-sm text-white rounded-2xl p-6 max-w-xs"
            onClick={(e) => e.stopPropagation()}
          >
            {expandedText}
          </div>
        </div>
      )}

      {/* ✨ Shriji Box Appears Here */}
      {shrijiVisible && <ShrijiBox onClose={() => setShrijiVisible(false)} />}
    </div>
  );
}
