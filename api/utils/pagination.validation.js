import Yup from "yup";

export const paginationValidationSchema = Yup.object({
  page: Yup.number().default(1).min(1, "Page must be at least 1."),
  limit: Yup.number().default(6).min(1, "Limit must be at least 1."),
  searchProduct: Yup.string().nullable().trim(),
  category: Yup.string()
    .trim()
    .oneOf([
      "mobiles",
      "electronics",
      "kitchen",
      "clothing",
      "shoes",
      "grocery",
      "auto",
      "sports",
      "cosmetics",
      "furniture",
      "liquor",
    ]).nullable(),
  minPrice: Yup.number().min(0),
  maxPrice: Yup.number().min(0),
});
