import { handleUnauthorized } from "./auth";

export const getCanteenRecommendations = async () => {
  try {
    const apiKey = localStorage.getItem("api_key");
    const apiSecret = localStorage.getItem("api_secret");

    const res = await fetch("/api/recommendation/canteen", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          apiKey && apiSecret ? `token ${apiKey}:${apiSecret}` : "",
      },
    });

    const json = await res.json();
    await handleUnauthorized(res, json);

    if (!res.ok || json.meta?.code !== 1600) {
      throw new Error(
        json.meta?.message || "Gagal mengambil rekomendasi kantin.",
      );
    }

    return json.data;
  } catch (err) {
    throw err;
  }
};

export const getMenuRecommendations = async () => {
  try {
    const apiKey = localStorage.getItem("api_key");
    const apiSecret = localStorage.getItem("api_secret");

    const res = await fetch("/api/recommendation/menu", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          apiKey && apiSecret ? `token ${apiKey}:${apiSecret}` : "",
      },
    });

    const json = await res.json();
    await handleUnauthorized(res, json);

    if (!res.ok || json.meta?.code !== 1600) {
      throw new Error(
        json.meta?.message || "Gagal mengambil rekomendasi menu.",
      );
    }

    return json.data;
  } catch (err) {
    throw err;
  }
};

export const getCanteenDetail = async (canteen_id: string) => {
  try {
    const apiKey = localStorage.getItem("api_key");
    const apiSecret = localStorage.getItem("api_secret");

    const res = await fetch(`/api/canteen/detail?canteen_id=${canteen_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          apiKey && apiSecret ? `token ${apiKey}:${apiSecret}` : "",
      },
    });

    const json = await res.json();
    await handleUnauthorized(res, json);

    if (!res.ok || json.meta?.code !== 1600) {
      throw new Error(json.meta?.message || "Gagal mengambil detail kantin.");
    }

    return json.data;
  } catch (err) {
    throw err;
  }
};
