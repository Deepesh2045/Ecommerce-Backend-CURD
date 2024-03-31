import Yup from "yup";


export const addItemToCartValidationSchema = Yup.object({
  productId: Yup.string().required("Product id is required.").trim(),
  orderedQuantity: Yup.number()
    .required("Order quantity is required.")
    .min(1, "Order quantity must be at least 1"),
});
export const updateQuantityValidationSchema = Yup.object({
  action:Yup.string().required().oneOf(["inc","dec"])
})
