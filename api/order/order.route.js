import express from "express";
import { isSeller } from "../middleware/authentication.middleware.js";
import Order from "./order.model.js";
import Product from "../product/product.model.js";
const router = express.Router();

//get order list by seller

router.get("/order/list", isSeller, async (req, res) => {
  const orders = await Order.aggregate([
    {
      $match: {
        sellerId: req.loggedInUserId,
        paymentStatus: "Completed",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "buyerId",
        foreignField: "_id",
        as: "buyerDetails",
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "productId",
        foreignField: "_id",
        as: "productDetail",
      },
    },
    {
      $project: {
        unitPrice: 1,
        orderedQuantity: 1,
        subTotal: 1,
        paymentStatus: 1,
        productId: 1,
        buyerData: {
          firstName: { $first: "$buyerDetails.firstName" },
          lastName: { $first: "$buyerDetails.lastName" },
          email: { $first: "$buyerDetails.email" },
        },
        productData: {
          name: { $first: "$productDetail.name" },
          category: { $first: "$productDetail.category" },
          brand: { $first: "$productDetail.brand" },
          availableQuantity: { $first: "$productDetail.quantity" },
        },
      },
    },
  ]);

  const updateQuantity = await Promise.all(
    orders.map(async (item) => {
      const totalProductQuantity = item.productData.availableQuantity;
      const totalOrderedQuantity = item.orderedQuantity;
      const status = item.paymentStatus;

      if (status === "Completed") {
        try {
          const updatedQuantity = totalProductQuantity - totalOrderedQuantity;

         await Product.updateOne(
            { _id: item.productId},
            { $set: { availableQuantities: updatedQuantity } }
          );
          return {success:true}
          
        } catch (error) {
          return {success: false, error}
          
        }
       
      }else{
        return {success: false,error: "Payment status not Completed"}
      }
    })
  );

  console.log(updateQuantity);

  
  return res.status(200).send({ message: "Success", updateQuantity:updateQuantity });
});

export default router;
