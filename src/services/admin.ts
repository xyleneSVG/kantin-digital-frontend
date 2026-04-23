import { handleUnauthorized } from "./auth";

export const getAdminMenuList = async (company: string) => {
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
  await handleUnauthorized(res, json);

  if (!res.ok || json.meta?.code !== 1600) {
    throw new Error(json.meta?.message || "Gagal mengambil data menu");
  }

  return json.data.items.map((item: any) => {
    const isStockItem = item.is_stock_item;
    const isDisabled = item.disabled === 1;
    const stock = item.total_stock || 0;

    let tersedia = false;
    let label = "Tidak tersedia";

    if (!isStockItem) {
      tersedia = !isDisabled;
      label = tersedia ? "Tersedia" : "Tidak tersedia";
    } else {
      if (isDisabled) {
        tersedia = false;
        label = "Tidak tersedia";
      } else {
        tersedia = stock > 0;
        label = tersedia ? "Tersedia" : "Habis";
      }
    }

    return {
      id: item.item_code,
      nama: item.item_name,
      grup: item.item_group.includes(" - ")
        ? item.item_group.split(" - ")[1]
        : item.item_group,
      harga: item.selling_price || 0,
      deskripsi: item.description || "Tidak ada deskripsi",
      tersedia,
      label,
      stok: stock,
      image: item.image ? `https://ta-dev.subekti.web.id${item.image}` : null,
    };
  });
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
  const json = text ? JSON.parse(text) : {};

  await handleUnauthorized(res, json);

  if (!res.ok) {
    console.error("ERROR RESPONSE:", text);
    throw new Error("Request gagal");
  }

  return json;
};

export const getMenuDetail = async (payload: any) => {
  const res = await fetch("/api/admin/menu/detail", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  await handleUnauthorized(res, json);

  if (!res.ok) {
    throw new Error(json.message || "Gagal ambil detail menu");
  }

  return json;
};

export async function createMenu(payload: any) {
  const res = await fetch("/api/admin/menu/create", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  const json = text ? JSON.parse(text) : {};

  await handleUnauthorized(res, json);

  if (!res.ok) {
    console.error("ERROR RESPONSE:", text);
    throw new Error("Request gagal");
  }

  return json;
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
  await handleUnauthorized(res, json);

  if (!res.ok) {
    throw new Error(json?.meta?.message || "Gagal mengambil data");
  }

  return json;
};

export const getSalesInvoiceDetail = async (sales_invoice_id: string) => {
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
  await handleUnauthorized(res, json);

  if (!res.ok || json.meta?.code !== 1700) {
    throw new Error(json.meta?.message || "Gagal mengambil detail pesanan");
  }

  return json.data;
};

export interface PurchaseInvoice {
  purchase_id: string;
  supplier: string;
  purchase_date: string;
  total_amount: number;
  status: string;
  company: string;
}

export const getPurchaseInvoices = async ({
  search = "",
  page = 1,
  per_page = 10,
  canteen = "",
}: {
  search?: string;
  page?: number;
  per_page?: number;
  canteen?: string;
}): Promise<PurchaseInvoice[]> => {
  try {
    const apiKey = localStorage.getItem("api_key");
    const apiSecret = localStorage.getItem("api_secret");

    const res = await fetch(
      `/api/admin/purchase-invoice?search=${encodeURIComponent(search)}&page=${page}&per_page=${per_page}&canteen=${encodeURIComponent(canteen)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ${apiKey}:${apiSecret}`,
        },
      },
    );

    const json = await res.json();
    await handleUnauthorized(res, json);

    if (!res.ok) {
      throw new Error(json?.meta?.message || "Gagal mengambil data");
    }

    return (json.data?.invoices || []).map((item: any) => ({
      purchase_id: item.name,
      supplier: item.supplier,
      purchase_date: item.posting_date,
      total_amount: item.grand_total,
      status: item.status,
      company: item.company,
    }));
  } catch (error) {
    console.error("Purchase Invoice Service Error:", error);
    return [];
  }
};

export interface PurchaseInvoiceItem {
  item_code: string;
  item_name: string;
  uom: string;
  qty: number;
  rate: number;
  amount: number;
  warehouse: string;
}

export interface PurchaseInvoiceDetail {
  purchase_invoice_id: string;
  supplier: string;
  company: string;
  posting_date: string;
  set_warehouse: string;
  grand_total: number;
  status: string;
  docstatus: number;
  items: PurchaseInvoiceItem[];
}

export const getPurchaseInvoiceDetail = async (id: string) => {
  const apiKey = localStorage.getItem("api_key");
  const apiSecret = localStorage.getItem("api_secret");

  const res = await fetch(
    `/api/admin/purchase-invoice/detail?purchase_invoice_id=${encodeURIComponent(id)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${apiKey}:${apiSecret}`,
      },
      cache: "no-store",
    },
  );

  const json = await res.json();
  await handleUnauthorized(res, json);

  if (!res.ok || json.meta?.code !== 1500) {
    throw new Error(json.meta?.message || "Gagal mengambil detail invoice");
  }

  return json.data;
};

export const getSuppliers = async (company: string, search = "") => {
  const apiKey = localStorage.getItem("api_key");
  const apiSecret = localStorage.getItem("api_secret");

  const res = await fetch(
    `/api/admin/purchase-invoice/supplier?company=${encodeURIComponent(company)}&search=${encodeURIComponent(search)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${apiKey}:${apiSecret}`,
      },
    },
  );

  const json = await res.json();
  await handleUnauthorized(res, json);

  if (!res.ok) {
    throw new Error(json?.meta?.message || "Gagal ambil supplier");
  }

  return json.data.suppliers.map((s: any) => s.supplier_name);
};

export const createPurchaseInvoice = async (payload: any) => {
  const apiKey = localStorage.getItem("api_key");
  const apiSecret = localStorage.getItem("api_secret");

  const res = await fetch(`/api/admin/purchase-invoice/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `token ${apiKey}:${apiSecret}`,
    },
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  await handleUnauthorized(res, json);

  if (!res.ok) {
    throw new Error(json?.meta?.message || "Gagal create purchase");
  }

  return json;
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
    await handleUnauthorized(res, json);

    if (!res.ok || json.meta?.code !== 1600) {
      throw new Error(json.meta?.message || "Gagal menyimpan data kantin.");
    }

    return json;
  } catch (err) {
    throw err;
  }
};
