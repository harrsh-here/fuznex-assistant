import React, { useEffect, useState } from "react";
import api from "../../api/api";
import NotificationCard from "./NotificationCard";
import moment from "moment";

export default function NotificationScreen({ onNavigate }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get("/notifications");
      const filtered = res.data.filter((n) =>
        moment(n.created_at).isAfter(moment().subtract(2, "days"))
      );
      const sorted = filtered.sort((a, b) => a.is_read - b.is_read);
      setNotifications(sorted);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) =>
          n.notification_id === id ? { ...n, is_read: true, status: "read" } : n
        )
      );
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  const handleClearAll = async () => {
    try {
      await Promise.all(
        notifications.map((n) =>
          api.delete(`/notifications/${n.notification_id}`)
        )
      );
      setNotifications([]);
    } catch (err) {
      console.error("Error clearing notifications:", err);
    }
  };

  const handleNavigate = (screen, extra) => {
    if (onNavigate) onNavigate(screen, extra);
  };

  return (
    <div className="flex flex-col h-full px-5 py-6 pt-12 text-white">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => onNavigate("home")}
          className="text-purple-400 hover:text-white transition"
        >
          ← Back
        </button>
        <h2 className="text-xl font-bold">Notifications</h2>
      </div>

      {/* Notification List */}
      <div className="flex-1 overflow-y-auto space-y-3 pb-24">
        {loading ? (
          [...Array(3)].map((_, idx) => (
            <div
              key={idx}
              className="h-[72px] rounded-xl bg-[#1e1e1e] animate-pulse border border-[#2a2a2a]"
            >
              <div className="p-4 space-y-2">
                <div className="w-1/2 h-3 bg-gray-700 rounded" />
                <div className="w-1/3 h-2 bg-gray-800 rounded" />
              </div>
            </div>
          ))
        ) : notifications.length === 0 ? (
          <p className="text-gray-400 text-sm">No new notifications</p>
        ) : (
          notifications.map((note) => (
            <NotificationCard
              key={note.notification_id}
              notification={note}
              onNavigate={handleNavigate}
              onMarkAsRead={markAsRead}
            />
          ))
        )}
      </div>

      {/* Clear All */}
      {!loading && notifications.length > 0 && (
        <button
          onClick={handleClearAll}
          className="mt-4 py-2 w-full bg-red-600 hover:bg-red-700 rounded-xl text-white font-semibold transition"
        >
          Clear All
        </button>
      )}
    </div>
  );
}
