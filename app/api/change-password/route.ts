import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const authHeader = req.headers.get("Authorization");

    const url = new URL("https://ta-dev.subekti.web.id/api/method/kantin_stemba.api.auth.change_password");

    // Karena di activate_account backend-mu memakai params, 
    // mari kita coba gunakan params juga untuk change_password
    url.searchParams.append("current_password", body.current_password);
    url.searchParams.append("new_password", body.new_password);
    url.searchParams.append("confirm_password", body.confirm_password);

    const res = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Teruskan header auth ke Frappe
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
    });

    const data = await res.json();
    
    // LOG INI PENTING: Cek terminal Next.js kamu (tempat kamu jalankan npm run dev)
    // untuk melihat alasan pasti kenapa Frappe menolak (misal: "Password lama salah")
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