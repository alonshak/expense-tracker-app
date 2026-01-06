const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export async function getExpenses(params = {}) {
  const url = new URL(`${API_BASE}/expenses`);
  Object.entries(params).forEach(([k, v]) => {
    if (v) url.searchParams.set(k, v);
  });
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch expenses");
  return res.json();
}

export async function createExpense(payload) {
  const res = await fetch(`${API_BASE}/expenses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to create expense");
  }
  return res.json();
}

export async function getMonthlySummary(year, month) {
  const url = new URL(`${API_BASE}/summary/monthly`);
  url.searchParams.set("year", String(year));
  url.searchParams.set("month", String(month));
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch monthly summary");
  return res.json();
}

export async function getCategoriesBreakdown(params = {}) {
  const url = new URL(`${API_BASE}/summary/categories`);
  Object.entries(params).forEach(([k, v]) => {
    if (v) url.searchParams.set(k, v);
  });
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch categories breakdown");
  return res.json();
}
