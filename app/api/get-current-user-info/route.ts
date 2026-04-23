import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch(
      `https://ta-dev.subekti.web.id/api/method/kantin_stemba.api.auth.get_current_user_info`,
      {
        method: "POST",
        headers: {
          Authorization: "token " + body.api_key + ":" + body.api_secret,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      }
    );

    const text = await res.text();
    const data = text ? JSON.parse(text) : {};

    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { meta: { code: 5000, message: "Internal Server Error" } },
      { status: 500 }
    );
  }
}