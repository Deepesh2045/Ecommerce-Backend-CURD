import Yup from "yup";
export const addProductValidationSchema = Yup.object({
  name: Yup.string()
    .required("Name is required.")
    .trim()
    .max(55, "Name must be at max 55 character."),
  brand: Yup.string()
    .required("Brand is required.")
    .trim()
    .max(55, "Brand must be at max 55 character."),
  price: Yup.number()
    .required("Price is required.")
    .min(0, "Price must be at least 0."),
  quantity: Yup.number()
    .required("Quantity is required.")
    .min(1, "Quantity must be at least 1."),
  category: Yup.string()
    .required("Category is required.")
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
    ]),
  freeShipping: Yup.boolean().default(false),
  description: Yup.string()
    .required("Description is required.")
    .trim()
    .min(500, "Description must be at least 500 character.")
    .max(1000, "Description must be at max 1000 character."),
  image: Yup.string().trim().nullable(),
});
