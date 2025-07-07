import { useEffect, useState, useRef, useCallback } from "react";
import { fetchUserHistory } from "../api/userHistory";
import { groupByDate } from "../utils/dateGroups";


export default function useHistory({ search = "", filters = [] }) {
  const [groups, setGroups] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const lastEventIds = useRef(new Set());

  const refreshTimer = useRef(null);

  const load = useCallback(async (silent = false) => {
    try {
      console.log("🔁 [useHistory] Loading history...");
      console.log("📥 Filters in effect:", filters);

      const typesToFetch =
        filters.length === 0 ? ["chat", "todo", "alarm", "system"] : filters;

      console.log("🎯 Actual types fetching:", typesToFetch);

      const allResults = await Promise.all(
        typesToFetch.map((type) =>
          fetchUserHistory({ page: 1, pageSize: 50, type })
        )
      );

      const merged = allResults.flat();

      console.log("📦 Merged API entries:", merged);

      const newIds = merged
        .filter((e) => !lastEventIds.current.has(e.id))
        .map((e) => e.id);

      console.log("🆕 New history IDs:", newIds);

      lastEventIds.current = new Set(merged.map((e) => e.id));

      const finalList = merged.map((e) =>
        newIds.includes(e.id) ? { ...e, fadeIn: true } : e
      );

      const grouped = groupByDate(finalList);

      console.log("📊 Grouped entries:", grouped);

      setGroups(grouped);
    } catch (err) {
      console.error("❌ Failed to load history:", err);
    }
  }, [filters, search]);

  useEffect(() => {
    load();
    refreshTimer.current = setInterval(() => load(true), 5000);
    return () => clearInterval(refreshTimer.current);
  }, [load]);

  return {
    groups,
    expandedId,
    setExpandedId,
    loadMore: () => load(true),
    loadingMore: groups.length === 0,
  };
}
