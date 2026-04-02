export const loginUser = async (
  identifier: string,
  password: string
) => {
  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nis: identifier,
        password: password,
      }),
    });

    const json = await res.json();

    if (!res.ok || !json?.data) {
      throw new Error("Login gagal");
    }

    localStorage.setItem("api_key", json.data.api_key);
    localStorage.setItem("api_secret", json.data.api_secret);

    return json.data;
  } catch (err) {
    console.error("Login error:", err);
    throw err;
  }
};