/**
 * ProductTypeInternal: Type dùng trong code và API
 * "apartment" | "villa" (tiếng Anh)
 */
export type ProductTypeInternal = "apartment" | "villa";

/**
 * Convert ProductTypeInternal sang text hiển thị cho user (tiếng Việt)
 */
export const getProductTypeDisplayText = (
  type: ProductTypeInternal
): string => {
  switch (type) {
    case "apartment":
      return "Căn hộ";
    case "villa":
      return "Villa";
    default:
      return type;
  }
};

/**
 * Parse string từ query param thành ProductTypeInternal
 */
export const parseProductTypeFromQuery = (
  value?: string | null
): ProductTypeInternal | undefined => {
  if (!value || value === "all") {
    return undefined;
  }

  const decodedValue = decodeURIComponent(value);

  if (decodedValue === "apartment" || decodedValue === "villa") {
    return decodedValue;
  }

  return undefined;
};
