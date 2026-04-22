import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const canteen_id = searchParams.get("canteen_id");

  try {
    const res = await fetch(
      `https://ta-dev.subekti.web.id/api/method/kantin_stemba.api.canteen.detail_canteen?canteen_id=${encodeURIComponent(
        canteen_id || "",
      )}`,
      {
        method: "GET",
        headers: {
          Authorization: req.headers.get("authorization") || "",
        },
      },
    );

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json(
      { meta: { code: 5000, message: "Internal Server Error" } },
      { status: 500 },
    );
  }
}