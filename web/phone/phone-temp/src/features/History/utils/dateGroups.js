// 6. utils/dateGroups.js
// Group history entries into Today, Yesterday, This Month, Earlier

export function groupByDate(entries) {
  if (!entries || entries.length === 0) return [];

  const groups = {
    Today: [],
    Yesterday: [],
    "This Month": [],
    Earlier: [],
  };

  const now = new Date();
  const todayStr = now.toDateString();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();

  for (const entry of entries) {
    const date = new Date(entry.timestamp);
    const dateStr = date.toDateString();

    if (dateStr === todayStr) {
      groups["Today"].push(entry);
    } else if (dateStr === yesterdayStr) {
      groups["Yesterday"].push(entry);
    } else if (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    ) {
      groups["This Month"].push(entry);
    } else {
      groups["Earlier"].push(entry);
    }
  }

  return Object.entries(groups)
    .filter(([, items]) => items.length > 0)
    .map(([title, items]) => ({
      label: title,
      items: items.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      ),
    }));
}
