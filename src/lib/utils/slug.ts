/**
 * Tạo slug từ text tiếng Việt
 * Chuyển đổi tiếng Việt có dấu thành không dấu và format thành URL-friendly slug
 */
export const createSlug = (text: string): string => {
  // Map các ký tự tiếng Việt sang không dấu
  const vietnameseMap: Record<string, string> = {
    à: "a",
    á: "a",
    ạ: "a",
    ả: "a",
    ã: "a",
    â: "a",
    ầ: "a",
    ấ: "a",
    ậ: "a",
    ẩ: "a",
    ẫ: "a",
    ă: "a",
    ằ: "a",
    ắ: "a",
    ặ: "a",
    ẳ: "a",
    ẵ: "a",
    è: "e",
    é: "e",
    ẹ: "e",
    ẻ: "e",
    ẽ: "e",
    ê: "e",
    ề: "e",
    ế: "e",
    ệ: "e",
    ể: "e",
    ễ: "e",
    ì: "i",
    í: "i",
    ị: "i",
    ỉ: "i",
    ĩ: "i",
    ò: "o",
    ó: "o",
    ọ: "o",
    ỏ: "o",
    õ: "o",
    ô: "o",
    ồ: "o",
    ố: "o",
    ộ: "o",
    ổ: "o",
    ỗ: "o",
    ơ: "o",
    ờ: "o",
    ớ: "o",
    ợ: "o",
    ở: "o",
    ỡ: "o",
    ù: "u",
    ú: "u",
    ụ: "u",
    ủ: "u",
    ũ: "u",
    ư: "u",
    ừ: "u",
    ứ: "u",
    ự: "u",
    ử: "u",
    ữ: "u",
    ỳ: "y",
    ý: "y",
    ỵ: "y",
    ỷ: "y",
    ỹ: "y",
    đ: "d",
    À: "A",
    Á: "A",
    Ạ: "A",
    Ả: "A",
    Ã: "A",
    Â: "A",
    Ầ: "A",
    Ấ: "A",
    Ậ: "A",
    Ẩ: "A",
    Ẫ: "A",
    Ă: "A",
    Ằ: "A",
    Ắ: "A",
    Ặ: "A",
    Ẳ: "A",
    Ẵ: "A",
    È: "E",
    É: "E",
    Ẹ: "E",
    Ẻ: "E",
    Ẽ: "E",
    Ê: "E",
    Ề: "E",
    Ế: "E",
    Ệ: "E",
    Ể: "E",
    Ễ: "E",
    Ì: "I",
    Í: "I",
    Ị: "I",
    Ỉ: "I",
    Ĩ: "I",
    Ò: "O",
    Ó: "O",
    Ọ: "O",
    Ỏ: "O",
    Õ: "O",
    Ô: "O",
    Ồ: "O",
    Ố: "O",
    Ộ: "O",
    Ổ: "O",
    Ỗ: "O",
    Ơ: "O",
    Ờ: "O",
    Ớ: "O",
    Ợ: "O",
    Ở: "O",
    Ỡ: "O",
    Ù: "U",
    Ú: "U",
    Ụ: "U",
    Ủ: "U",
    Ũ: "U",
    Ư: "U",
    Ừ: "U",
    Ứ: "U",
    Ự: "U",
    Ử: "U",
    Ữ: "U",
    Ỳ: "Y",
    Ý: "Y",
    Ỵ: "Y",
    Ỷ: "Y",
    Ỹ: "Y",
    Đ: "D",
  };

  return text
    .split("")
    .map((char) => vietnameseMap[char] || char)
    .join("")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Loại bỏ ký tự đặc biệt
    .replace(/[\s_]+/g, "-") // Thay khoảng trắng và underscore bằng dấu gạch ngang
    .replace(/-+/g, "-") // Loại bỏ nhiều dấu gạch ngang liên tiếp
    .replace(/^-+|-+$/g, ""); // Loại bỏ dấu gạch ngang ở đầu và cuối
};

/**
 * Tạo slug cho sản phẩm từ tên
 * Format: {slug-from-name}
 * Ví dụ: "havila-luxury-can-ho-the-song-vung-tau-cho-nhom-ban-luxury-tien-ich-5-gan-bai-sau"
 *
 * @param name - Tên sản phẩm (đã được validate là unique)
 */
export const createProductSlug = (name: string): string => {
  return createSlug(name);
};

/**
 * Parse slug để lấy ID (6 ký tự cuối)
 */
export const parseSlugToId = (slug: string): string | null => {
  const parts = slug.split("-");
  const lastPart = parts[parts.length - 1];

  // Kiểm tra xem phần cuối có phải là 6 ký tự hex không (ID thường là hex)
  if (lastPart && /^[a-f0-9]{6}$/i.test(lastPart)) {
    return lastPart;
  }

  return null;
};
