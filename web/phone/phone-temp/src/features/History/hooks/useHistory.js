import { useEffect, useState } from "react";
import { fetchUserHistory, deleteUserHistory } from "../api/userHistory";
import { groupByDate } from "../utils/dateGroups";

export default function useHistory({ type, assistant }) {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const reload = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      // Only send the param if it's not "all"
      const response = await fetchUserHistory({
        type: type !== "all" ? type : null,
        assistant_name: assistant !== "all" ? assistant : null,
      });

      

      // response.data is the array of history entries
      const entries = Array.isArray(response.data)
        ? response.data
        : [];

      const grouped = groupByDate(entries);
      

      setGroups(grouped);
    } catch (err) {
      console.error("❌ Failed to fetch history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
  }, [type, assistant]);

  return {
    groups,
    loading,
    reload,

    /**
     * ✅ Real delete method using DELETE request
     */
    deleteHistory: async (id) => {
      try {
        await deleteUserHistory(id);
      } catch (err) {
        console.error("❌ Failed to delete history item:", err);
        throw err;
      }
    },
  };
}
