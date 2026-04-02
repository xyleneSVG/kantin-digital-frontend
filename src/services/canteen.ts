import { callFrappe } from "../lib/frappe";

const CANTEEN_API = {
  CREATE: "kantin_stemba.api.canteen.create_canteen",
};

export const createCanteen = async (call: any, data: any) => {
  return callFrappe(call, CANTEEN_API.CREATE, data);
};