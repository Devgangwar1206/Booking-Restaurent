import API_URL from "./apiConfig";

export async function adminLogin(username, password) {

  const response = await fetch(`${API_URL}/admin/login`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      username,
      password,
    }),
  });

  if (!response.ok) {
    throw new Error("Invalid username or password");
  }

  const data = await response.json();

  localStorage.setItem("adminToken", data.token);

  return data;
}