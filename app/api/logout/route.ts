import { NextResponse } from "next/server";

export async function POST() {
  try {
    const url = new URL("https://ta-dev.subekti.web.id/api/method/kantin_stemba.api.auth.logout");

    const res = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json(
      { message: "Proxy error", error: String(err) },
      { status: 500 }
    );
  }
}