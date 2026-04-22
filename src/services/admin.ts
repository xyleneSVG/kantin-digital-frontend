export const getAdminMenuList = async (company: string) => {
  try {
    const apiKey = localStorage.getItem("api_key");
    const apiSecret = localStorage.getItem("api_secret");

    const res = await fetch(
      `/api/admin/menu?canteen=${encodeURIComponent(company)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ${apiKey}:${apiSecret}`,
        },
      },
    );

    const json = await res.json();

    if (!res.ok || json.meta?.code !== 1600) {
      throw new Error(json.meta?.message || "Gagal mengambil data menu");
    }

    return json.data.items.map((item: any) => ({
      id: item.item_code,
      nama: item.item_name,
      grup: item.item_group.includes(" - ")
        ? item.item_group.split(" - ")[1]
        : item.item_group,
      harga: item.selling_price || 0,
      deskripsi: item.description || "Tidak ada deskripsi",
      tersedia: item.disabled === 0 && item.total_stock > 0,
      stok: item.total_stock || 0,
      image: item.image ? `https://ta-dev.subekti.web.id${item.image}` : null,
    }));
  } catch (err) {
    throw err;
  }
};

export const editMenu = async (payload: any) => {
  const apiKey = localStorage.getItem("api_key");
  const apiSecret = localStorage.getItem("api_secret");

  const res = await fetch("/api/admin/menu/edit", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `token ${apiKey}:${apiSecret}`,
    },
    body: JSON.stringify(payload),
  });

  const text = await res.text();

  if (!res.ok) {
    console.error("ERROR RESPONSE:", text);
    throw new Error("Request gagal");
  }

  return text ? JSON.parse(text) : { success: true };
};

export const getMenuDetail = async (payload: any) => {
  const res = await fetch("/api/admin/menu/detail", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal ambil detail menu");
  }

  return data;
};

export async function createMenu(payload: any) {
  const res = await fetch("/api/admin/menu/create", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const text = await res.text();

  if (!res.ok) {
    console.error("ERROR RESPONSE:", text);
    throw new Error("Request gagal");
  }

  return text ? JSON.parse(text) : { success: true };
}

export const getSalesInvoices = async ({
  page = 1,
  per_page = 10,
}: {
  page?: number;
  per_page?: number;
}) => {
  const apiKey = localStorage.getItem("api_key");
  const apiSecret = localStorage.getItem("api_secret");
  const company = localStorage.getItem("company") || "";

  const res = await fetch(
    `/api/admin/sales-invoice?page=${page}&per_page=${per_page}&canteen=${encodeURIComponent(company)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${apiKey}:${apiSecret}`,
      },
    },
  );

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json?.meta?.message || "Gagal mengambil data");
  }

  return json;
};

export const getSalesInvoiceDetail = async (sales_invoice_id: string) => {
  try {
    const apiKey = localStorage.getItem("api_key");
    const apiSecret = localStorage.getItem("api_secret");

    const res = await fetch(
      `/api/admin/sales-invoice/detail?sales_invoice_id=${encodeURIComponent(sales_invoice_id)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ${apiKey}:${apiSecret}`,
        },
      },
    );

    const json = await res.json();

    if (!res.ok || json.meta?.code !== 1700) {
      throw new Error(json.meta?.message || "Gagal mengambil detail pesanan");
    }

    return json.data;
  } catch (err) {
    throw err;
  }
};