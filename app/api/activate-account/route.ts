export async function POST(req: Request) {
  try {
    const body = await req.json();

    const url = new URL("https://ta-dev.subekti.web.id/api/method/kantin_stemba.api.auth.activate_account");
    
    url.searchParams.append("nis", body.nis);
    url.searchParams.append("activation_method", body.activation_method);

    const res = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    
    return Response.json(data, { status: res.status });
  } catch (err) {
    return Response.json(
      { message: "Proxy error", error: String(err) },
      { status: 500 }
    );
  }
}