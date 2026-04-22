import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const apiKey = req.headers.get("authorization");

  const res = await fetch(
    `https://ta-dev.subekti.web.id/api/method/kantin_stemba.api.purchase_invoice.create_purchase_invoice`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: apiKey || "",
      },
      body: JSON.stringify(body),
    }
  );

  const json = await res.json();

  return NextResponse.json(json);
}