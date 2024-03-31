import express from "express";
import connectDb from "./connect.db.js";
import userRoutes from "./user/user.route.js";
import productRoutes from "./product/product.route.js";
import cartRoutes from "./cart/cart.routes.js";
import cors from "cors"
import paymentRoutes from "./payment/payment.route.js"
import orderRoute from "./order/order.route.js"
import resetPasswordRoutes from "./user/reset.password.route.js"

const app = express();
// to make app understand json
app.use(express.json());
app.use(cors())


//connect database
connectDb();

// register routes
app.use(userRoutes);
app.use(productRoutes);
app.use(cartRoutes);
app.use(paymentRoutes)
app.use(orderRoute)
app.use(resetPasswordRoutes)

// server and network port
const port = process.env.API_PORT;

app.listen(port, () => {
  console.log(`App is listing on port ${port}`);
});
