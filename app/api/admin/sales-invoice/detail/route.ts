import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sales_invoice_id = searchParams.get("sales_invoice_id");
    const authHeader = req.headers.get("Authorization");

    const url = `https://ta-dev.subekti.web.id/api/method/kantin_stemba.api.sales_invoice.detail_sales_invoice?sales_invoice_id=${sales_invoice_id}`;

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
