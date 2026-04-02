export const callFrappe = async (
  call: any,
  method: string,
  args?: Record<string, any>
) => {
  try {
    const res = await call({
      method,
      args,
    });

    return res?.message;
  } catch (err) {
    console.error("Frappe API Error:", err);
    throw err;
  }
};