import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch(
      `https://ta-dev.subekti.web.id/api/method/kantin_stemba.api.canteen.edit_canteen`,
      {
        method: "PUT",
        headers: {
          Authorization: "token " + body.api_key + ":" + body.api_secret,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          canteen_id: body.canteen_id,
          canteen_name: body.canteen_name,
          location_description: body.location_description,
          image: body.image,
        }),
      },
    );

    const text = await res.text();
    const data = text ? JSON.parse(text) : {};

    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json(
      { meta: { code: 5000, message: "Internal Server Error" } },
      { status: 500 },
    );
  }
}
