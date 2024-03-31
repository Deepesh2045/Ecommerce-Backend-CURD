import express, { response } from "express";
import { isBuyer } from "../middleware/authentication.middleware.js";
import axios from "axios";
import { generateRandomString } from "../utils/generate.random.string.js";
import Order from "../order/order.model.js";
import Cart from "../cart/cart.model.js";
import mongoose from "mongoose";

const router = express.Router();

// initiate payment
router.post("/payment/khalti/start", isBuyer, async (req, res) => {
  const { amount, productList } = req.body;
  const purchaseOrderId = generateRandomString();

  try {
    const khaltiResponse = await axios.post(
      "https://a.khalti.com/api/v2/epayment/initiate/",
      {
        return_url: "http://localhost:5173/payment/khalti/success/",
        website_url: "http://localhost:5173/",
        amount: Number(amount) * 100, //convert into paisa
        purchase_order_id: purchaseOrderId,
        purchase_order_name: `item-${purchaseOrderId}`,
      },
      {
        headers: {
          Authorization: "key cbeae82c02564daeaeea88827fcb673d",
          "Content-Type": "application/json",
        },
      }
    );
    // await Order.create({
    //   buyerId: req.loggedInUserId,
    //   totalAmount: amount,
    //   paymentStatus: "Initiated",
    //   productList,
    //   pidx: khaltiResponse?.data?.pidx,
    // });
    await Promise.all(
      productList.map(async (item) => {
        await Order.create({
          buyerId: req.loggedInUserId,
          sellerId: new mongoose.Types.ObjectId(item?.sellerId),
          unitPrice: item?.unitPrice,
          orderedQuantity: item?.orderedQuantity,
          subTotal: item?.subTotal,
          productId: new mongoose.Types.ObjectId(item?.productId),
          paymentStatus: "Initiated",
          pidx: khaltiResponse?.data?.pidx,
        });
      })
    );

    return res
      .status(200)
      .send({ message: "Success", paymentDetails: khaltiResponse?.data });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Payment initialization failed" });
  }
});

// Verify Route
router.post("/payment/khalti/verify", isBuyer, async (req, res) => {
  const { pidx } = req.body;

  const khaltiResponse = await axios.post(
    "https://a.khalti.com/api/v2/epayment/lookup/",
    {
      pidx,
    },
    {
      headers: {
        Authorization: "key cbeae82c02564daeaeea88827fcb673d",
        "Content-Type": "application/json",
      },
    }
  );
  await Order.updateMany(
    { pidx },
    {
      $set: {
        paymentStatus: khaltiResponse?.data?.status,
      },
    }
  );
  if (khaltiResponse?.data?.status !== "Completed") {
    return res.status(400).send({ message: "Khalti Payment status failed." });
  }
  await Cart.deleteMany({ buyerId: req.loggedInUserId });
  return res.status(200).send({ message: "Khalti payment is successful." });
});
export default router;
