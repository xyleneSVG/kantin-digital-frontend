import { callFrappe } from "../lib/frappe";

const ITEM_API = {
  LIST: "kantin_stemba.api.item.list_item",
  DETAIL: "kantin_stemba.api.item.detail_item",
  CREATE: "kantin_stemba.api.item.create_item",
};

export const getItems = async (call: any, canteen: string) => {
  return callFrappe(call, ITEM_API.LIST, { canteen });
};

export const getItemDetail = async (call: any, item_code: string) => {
  return callFrappe(call, ITEM_API.DETAIL, { item_code });
};

export const createItem = async (call: any, data: any) => {
  return callFrappe(call, ITEM_API.CREATE, data);
};