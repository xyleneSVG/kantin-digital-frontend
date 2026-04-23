import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const salesInvoiceId = searchParams.get("sales_invoice_id");
  const authHeader = request.headers.get("Authorization");

  if (!salesInvoiceId) {
    return NextResponse.json(
      { message: "Missing sales_invoice_id" },
      { status: 400 },
    );
  }

  try {
    const backendUrl = `https://ta-dev.subekti.web.id/api/method/kantin_stemba.api.sales_invoice.inquiry_payment_status?sales_invoice_id=${salesInvoiceId}`;

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader || "",
      },
      cache: "no-store",
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", error },
      { status: 500 },
    );
  }
}
