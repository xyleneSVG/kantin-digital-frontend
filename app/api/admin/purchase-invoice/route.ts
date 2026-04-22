import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const page = searchParams.get("page") || "1";
    const per_page = searchParams.get("per_page") || "10";
    const search = searchParams.get("search") || "";
    const canteen = searchParams.get("canteen") || "";

    const authHeader = req.headers.get("Authorization");

    const url = `https://ta-dev.subekti.web.id/api/method/kantin_stemba.api.purchase_invoice.list_purchase_invoice?page=${page}&per_page=${per_page}&company=${canteen}&search=${search}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      cache: "no-store",
    });

    const data = await res.json();

    return NextResponse.json({
      meta: data.meta,
      data: {
        invoices: data.data?.purchase_invoices || [],
        total: data.data?.total || 0,
      },
      error: data.error ?? null,
    });
  } catch (err) {
    return NextResponse.json(
      {
        meta: { code: 500, message: "Proxy error" },
        data: { invoices: [], total: 0 },
        error: String(err),
      },
      { status: 500 },
    );
  }
}
