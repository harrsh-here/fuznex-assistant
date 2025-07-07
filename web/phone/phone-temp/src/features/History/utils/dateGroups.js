// src/features/History/utils/dateGroups.js
import moment from "moment";

/**
 * Group entries into Today, Yesterday, Last 7 Days, Earlier
 */
export function groupByDate(entries) {
  if (!Array.isArray(entries) || entries.length === 0) {
    return [];
  }

  const now = moment();
  const today = now.clone().startOf("day");
  const yesterday = now.clone().subtract(1, "day").startOf("day");
  const last7 = now.clone().subtract(7, "days").startOf("day");

  const buckets = {
    "Today": [],
    "Yesterday": [],
    "Last 7 Days": [],
    "Earlier": [],
  };

  entries.forEach((entry) => {
    const ts = entry.timestamp ? moment(entry.timestamp) : null;
    if (!ts || !ts.isValid()) {
      buckets["Earlier"].push(entry);
    } else if (ts.isSame(today, "day")) {
      buckets["Today"].push(entry);
    } else if (ts.isSame(yesterday, "day")) {
      buckets["Yesterday"].push(entry);
    } else if (ts.isAfter(last7)) {
      buckets["Last 7 Days"].push(entry);
    } else {
      buckets["Earlier"].push(entry);
    }
  });

  return Object.entries(buckets)
    .filter(([, items]) => items.length > 0)
    .map(([title, items]) => ({
      title,
      items: items.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      ),
    }));
}
