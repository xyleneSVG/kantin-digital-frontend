import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const canteen = searchParams.get("canteen");
    const authHeader = req.headers.get("authorization");
    const url = `https://ta-dev.subekti.web.id/api/method/kantin_stemba.api.item.list_item?canteen=${canteen}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
    });

    const data = await res.json();
    console.log(JSON.stringify(data))
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ message: "Proxy error" }, { status: 500 });
  }
}