export interface OrderItem {
  item_code: string;
  item_name: string;
  uom: string;
  qty: number;
  rate: number;
  amount: number;
  warehouse: string;
}

export interface OrderDetail {
  sales_invoice_id: string;
  customer: string;
  company: string;
  posting_date: string;
  set_warehouse: string;
  grand_total: number;
  status: string;
  payment_method: "tunai" | "non_tunai";
  items: OrderItem[];
}

export function mapOrderDetail(data: any): OrderDetail {
  return {
    sales_invoice_id: data.name,
    customer: data.customer,
    company: data.company,
    posting_date: data.posting_date,
    set_warehouse: data.set_warehouse,
    grand_total: data.grand_total,
    status: data.status,
    payment_method: data.mode_of_payment === "Cash" ? "tunai" : "non_tunai",
    items: (data.items || []).map((item: any) => ({
      item_code: item.item_code,
      item_name: item.item_name,
      uom: item.uom,
      qty: item.qty,
      rate: item.rate,
      amount: item.amount,
      warehouse: item.warehouse,
    })),
  };
}
