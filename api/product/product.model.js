import mongoose from "mongoose";

// Set Rule
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      max_length: 55,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
      max_length: 55,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      max_length: 1000,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      enum: [
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
      ],
    },
    freeShipping: {
      type: Boolean,
      required: false,
      default: false,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    image: {
      type: String,
      required: false,
      trim: true,
      default: null,
    },
    // createdAt: {
    //   type: Date,
    //   default: Date.now // Sets the default value to the current date/time
    // },
  },
  {
    timestamps: true,
  },
  
);

// to remove sellerId field
productSchema.methods.toJSON = function () {
  var obj = this.toObject();
  delete obj.sellerId;
  return obj;
};
// Create Table
const Product = mongoose.model("Product", productSchema);
export default Product;
