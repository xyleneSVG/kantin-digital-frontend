import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const page = searchParams.get("page") || "1";
    const per_page = searchParams.get("per_page") || "10";
    const canteen = searchParams.get("canteen");

    const authHeader = req.headers.get("Authorization");

    const url = `https://ta-dev.subekti.web.id/api/method/kantin_stemba.api.sales_invoice.list_sales_invoice?page=${page}&per_page=${per_page}&company=${canteen}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
    });

    const data = await res.json();

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ message: "Proxy error" }, { status: 500 });
  }
}