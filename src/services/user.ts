import { handleUnauthorized } from "./auth";

const getAuthHeaders = () => {
  const apiKey = localStorage.getItem("api_key");
  const apiSecret = localStorage.getItem("api_secret");

  return {
    "Content-Type": "application/json",
    Authorization: apiKey && apiSecret ? `token ${apiKey}:${apiSecret}` : "",
  };
};

const fetchAPI = async (url: string, errorMessage: string) => {
  const res = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const json = await res.json();
  await handleUnauthorized(res, json);

  if (!res.ok || json.meta?.code !== 1600) {
    throw new Error(json.meta?.message || errorMessage);
  }

  return json.data;
};

export const getCanteenRecommendations = async () => {
  return fetchAPI(
    "/api/recommendation/canteen",
    "Gagal mengambil rekomendasi kantin.",
  );
};

export const getMenuRecommendations = async () => {
  return fetchAPI(
    "/api/recommendation/menu",
    "Gagal mengambil rekomendasi menu.",
  );
};

export const getCanteenDetail = async (canteen_id: string) => {
  return fetchAPI(
    `/api/canteen/detail?canteen_id=${canteen_id}`,
    "Gagal mengambil detail kantin.",
  );
};

export const getCanteenMenu = async (canteen: string) => {
  return fetchAPI(
    `/api/canteen/menu?canteen=${encodeURIComponent(canteen)}`,
    "Gagal mengambil menu rekomendasi.",
  );
};

export const getCanteenItems = async (canteen: string) => {
  return fetchAPI(
    `/api/canteen/items?canteen=${encodeURIComponent(canteen)}`,
    "Gagal mengambil list item.",
  );
};
