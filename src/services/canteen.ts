export const getCanteenDetail = async (canteen_id: string) => {
  try {
    const apiKey = localStorage.getItem("api_key");
    const apiSecret = localStorage.getItem("api_secret");

    const res = await fetch(
      `/api/canteen/detail?canteen_id=${encodeURIComponent(canteen_id)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            apiKey && apiSecret ? `token ${apiKey}:${apiSecret}` : "",
        },
      },
    );

    const json = await res.json();

    if (!res.ok || json.meta?.code !== 1600) {
      throw new Error(json.meta?.message || "Gagal mengambil detail kantin.");
    }

    return json.data;
  } catch (err) {
    throw err;
  }
};

export const updateCanteen = async (payload: {
  canteen_id: string;
  canteen_name: string;
  location_description: string;
  image: string;
}) => {
  try {
    const apiKey = localStorage.getItem("api_key");
    const apiSecret = localStorage.getItem("api_secret");

    const res = await fetch(`/api/canteen/edit`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...payload,
        api_key: apiKey,
        api_secret: apiSecret,
      }),
    });

    const text = await res.text();
    const json = text ? JSON.parse(text) : {};

    if (!res.ok || json.meta?.code !== 1600) {
      throw new Error(json.meta?.message || "Gagal menyimpan data kantin.");
    }

    return json;
  } catch (err) {
    throw err;
  }
};
