import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await fetch(
      `https://ta-dev.subekti.web.id/api/method/kantin_stemba.api.sales_invoice.create_sales_invoice`,
      {
        method: "POST",
        headers: {
          Authorization: "token " + body.api_key + ":" + body.api_secret,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );
    console.log(JSON.stringify(body));
    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { message: "Failed to create invoice", error: data },
        { status: res.status },
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
