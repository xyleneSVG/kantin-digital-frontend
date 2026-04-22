export async function PUT(req: Request) {
  const body = await req.json();

  const res = await fetch(
    `https://ta-dev.subekti.web.id/api/method/kantin_stemba.api.item.edit_item`,
    {
      method: "PUT",
      headers: {
        Authorization: "token " + body.api_key + ":" + body.api_secret,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        item_code: body.item_code,
        item_name: body.item_name,
        item_group: body.item_group,
        stock_uom: body.stock_uom,
        uoms: body.uoms,
        is_stock_item: body.is_stock_item,
        selling_price: body.selling_price,
        company: body.company,
        image: body.image,
      }),
    },
  );

  console.log(body)
  const data = await res.json();

  return Response.json(data);
}
