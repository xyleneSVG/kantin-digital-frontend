export const validateAllFieldsFilled = (
  form: Record<string, string>,
  requiredFields: string[]
): boolean => {
  return requiredFields.every((field) => {
    const val = form[field];
    return val && val.trim().length > 0;
  });
};