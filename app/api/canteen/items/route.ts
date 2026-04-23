import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const canteen = searchParams.get("canteen");

    const res = await fetch(
      `https://ta-dev.subekti.web.id/api/method/kantin_stemba.api.item.list_item?canteen=${canteen}`,
      {
        method: "GET",
        headers: {
          Authorization: req.headers.get("authorization") || "",
        },
      },
    );

    const json = await res.json();

    return NextResponse.json(json, { status: res.status });
  } catch (err) {
    return NextResponse.json(
      { meta: { code: 500, message: "Internal Server Error" } },
      { status: 500 },
    );
  }
}
