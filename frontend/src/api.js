const API_BASE = "/api";

function getToken() {
  return localStorage.getItem("token");
}

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(getToken() && {
        Authorization: `Bearer ${getToken()}`,
      }),
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
export function login(email, password) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

// 📊 DATA
export function getExpenses({ year, month }) {
  return request(`/expenses?year=${year}&month=${month}`);
}

export function getOverview({ year, month }) {
  return request(`/overview?year=${year}&month=${month}`);
}

export function createExpense(data) {
  return request("/expenses", {
    method: "POST",
    body: JSON.stringify({
      ...data,
      amount: Number(data.amount),
    }),
  });
}
