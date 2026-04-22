import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const company = searchParams.get("company");
  const search = searchParams.get("search") || "";

  const apiKey = req.headers.get("authorization");

  const res = await fetch(
    `https://ta-dev.subekti.web.id/api/method/kantin_stemba.api.admin.supplier.list_suppliers?company=${encodeURIComponent(company || "")}&search=${encodeURIComponent(search)}`,
    {
      method: "GET",
      headers: {
        Authorization: apiKey || "",
      },
    }
  );

  const json = await res.json();

  return NextResponse.json(json);
}