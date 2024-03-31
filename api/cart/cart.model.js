import mongoose from "mongoose";
import { number } from "yup";

// set rule
const cartSchema = new mongoose.Schema({
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "users",
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "products",
  },
  orderedQuantity: {
    type: Number,
    required: true,
    min_quantity: 1,
  },
});

// create table
const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
