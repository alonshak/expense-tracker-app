const API_BASE = "/api";

function getUserId() {
  return localStorage.getItem("user_id");
}

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "API error");
  }

  return res.json();
}

// 🔐 AUTH
export async function login(email, password) {
  const res = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  localStorage.setItem("user_id", res.user_id);
  return res;
}

// 📊 DATA
// ✅ ALL expenses, newest first (backend supports limit/offset)
export function getExpenses({ limit = 200, offset = 0 } = {}) {
  return request(`/expenses?user_id=${getUserId()}&limit=${limit}&offset=${offset}`);
}

export function getOverview({ year, month }) {
  return request(`/overview?year=${year}&month=${month}&user_id=${getUserId()}`);
}

export function getYearlyMonthsOverview({ year }) {
  return request(`/overview/yearly/months?year=${year}&user_id=${getUserId()}`);
}

export function createExpense(data) {
  return request("/expenses", {
    method: "POST",
    body: JSON.stringify({
      ...data,
      user_id: Number(getUserId()),
      amount: Number(data.amount),
    }),
  });
}

export function updateExpense(id, data) {
  return request(`/expenses/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      ...data,
      user_id: Number(getUserId()),
      amount: Number(data.amount),
    }),
  });
}

export function deleteExpense(id) {
  return request(`/expenses/${id}?user_id=${getUserId()}`, {
    method: "DELETE",
  });
}
