export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await fetch(
      "https://ta-dev.subekti.web.id/api/method/kantin_stemba.api.item.create_item",
      {
        method: "POST",
        headers: {
          Authorization: "token " + body.api_key + ":" + body.api_secret,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );

    const text = await res.text();

    return new Response(text, {
      status: res.status,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
