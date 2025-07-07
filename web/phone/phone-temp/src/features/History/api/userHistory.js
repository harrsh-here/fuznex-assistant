import api from "../../../api/api";

/**
 * Fetch user history with optional type filter and pagination
 */
export function fetchUserHistory({ page = 1, pageSize = 20, type = null, assistant_name = null }) {
  return api.get("/history", {
    params: {
      page,
      pageSize,
      ...(type ? { type } : {}),
      ...(assistant_name ? { assistant_name } : {}),
    },
  });
}

/**
 * ✅ Delete a single history entry by ID
 */
export function deleteUserHistory(id) {
  return api.delete(`/history/${id}`);
}
