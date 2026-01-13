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

  // שומרים user_id אחרי login
  localStorage.setItem("user_id", res.user_id);
  return res;
}

// 📊 DATA
export function getExpenses({ year, month }) {
  return request(
    `/expenses?year=${year}&month=${month}&user_id=${getUserId()}`
  );
}

export function getOverview({ year, month }) {
  return request(
    `/overview?year=${year}&month=${month}&user_id=${getUserId()}`
  );
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
