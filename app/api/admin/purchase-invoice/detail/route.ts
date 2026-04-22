import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const purchase_invoice_id = searchParams.get("purchase_invoice_id") || "";

    const authHeader = req.headers.get("Authorization");

    const url = `https://ta-dev.subekti.web.id/api/method/kantin_stemba.api.purchase_invoice.detail_purchase_invoice?purchase_invoice_id=${purchase_invoice_id}`;

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
      data: data.data,
      error: data.error ?? null,
    });
  } catch (err) {
    return NextResponse.json(
      {
        meta: {
          code: 500,
          message: "Proxy error",
        },
        data: null,
        error: String(err),
      },
      { status: 500 },
    );
  }
}
