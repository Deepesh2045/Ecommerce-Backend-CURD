import mongoose from "mongoose";

// const orderProductSchema = new mongoose.Schema({
//   productId: {
//     type: mongoose.ObjectId,
//     ref: "products",
//     required: true,
//   },
//   orderedQuantity: {
//     type: Number,
//     min: 1,
//     required: true,
//   },
// });
// set Rule
const orderSchema = new mongoose.Schema({
  buyerId: {
    type: mongoose.ObjectId,
    required: true,
    ref: "users",
  },
  sellerId: { type: mongoose.ObjectId, required: true, ref: "users" },

  unitPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  orderedQuantity: {
    type: Number,
    required: true,
    min: 1,
  },
  subTotal: {
    type: Number,
    required: true,
    min: 0,
  },
  productId: { type: mongoose.ObjectId, required: true, ref: "products" },

  paymentStatus: {
    type: String,
    required: true,
    enum: [
      "Completed",
      "Initiated",
      "Pending",
      "Expired",
      "Refunded",
      "User canceled",
      "Partially refunded",
    ],
  },
  // productList: {
  //   type: [orderProductSchema],
  //   required: true,
  // },

  pidx: {
    type: String,
    required: true,
  },
});

// Create Table
const Order = mongoose.model("Order", orderSchema);
export default Order;
