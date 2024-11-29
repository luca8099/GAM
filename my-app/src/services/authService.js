const BASE_URL = "http://localhost:8000";

const login = async (username, password) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Errore di autenticazione");
    }

    const data = await response.json();
    return data.message; // "login successfully" o un messaggio dal backend
  } catch (error) {
    throw error.message;
  }
};

export default {
  login,
};
