import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const authHeader = req.headers.get("Authorization");

    const url = new URL("https://ta-dev.subekti.web.id/api/method/kantin_stemba.api.auth.change_password");

    url.searchParams.append("current_password", body.current_password);
    url.searchParams.append("new_password", body.new_password);
    url.searchParams.append("confirm_password", body.confirm_password);

    const res = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
    });

    const data = await res.json();
    
    if (!res.ok) {
        console.log("❌ ERROR DARI FRAPPE:", data);
    }

    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json(
      { message: "Proxy error", error: String(err) },
      { status: 500 }
    );
  }
}