import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { api_key, api_secret, item_code } = body;

    const response = await fetch(
      `https://ta-dev.subekti.web.id/api/method/kantin_stemba.api.item.detail_item?item_code=${item_code}`,
      {
        method: "GET",
        headers: {
          Authorization: `token ${api_key}:${api_secret}`,
        },
      },
    );

    const data = await response.json();

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message },
      { status: 500 },
    );
  }
}