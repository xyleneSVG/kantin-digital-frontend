export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await fetch(
      "https://ta-dev.subekti.web.id/api/method/kantin_stemba.api.auth.check_customer_activation",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nis: body.nis,
        }),
      }
    );

    const data = await res.json();
    return Response.json(data, { status: res.status });
  } catch (err) {
    return Response.json(
      { message: "Proxy error", error: String(err) },
      { status: 500 }
    );
  }
}