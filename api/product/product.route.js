import express from "express";
import Cart from "../cart/cart.model.js";
import {
  isBuyer,
  isSeller,
  isUser,
} from "../middleware/authentication.middleware.js";
import { checkMongoIdValidityFromParams } from "../middleware/mongoId.validity.middleware.js";
import { paginationValidationSchema } from "../utils/pagination.validation.js";
import Product from "./product.model.js";
import { addProductValidationSchema } from "./product.validation.js";
import Order from "../order/order.model.js";

const router = express.Router();

// add product system user role => seller
router.post(
  "/product/add",
  isSeller,
  async (req, res, next) => {
    // extract new product from req.body
    const newProduct = req.body;
    // validate new product
    try {
      const validatedData = await addProductValidationSchema.validate(
        newProduct
      );
      req.body = validatedData;
      next();
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
  },
  async (req, res) => {
    // extract new product from req.body
    const newProduct = req.body;
    // add sellerId
    newProduct.sellerId = req.loggedInUserId;

    // create Product
    await Product.create(newProduct);
    // send response
    return res.status(200).send({ message: "Product is added successfully." });
  }
);
// get product details
router.get(
  "/product/details/:id",
  isUser,
  checkMongoIdValidityFromParams,
  async (req, res) => {
    // extract product id from req.params
    const productId = req.params.id;
    // find product
    const product = await Product.findOne({ _id: productId });
    // if not find product throw error
    if (!product) {
      return res.status(404).send({ message: "Product does not exist." });
    }
    // send product as response
    return res
      .status(200)
      .send({ message: "Success", productDetails: product });
  }
);

// delete product
router.delete(
  "/product/delete/:id",
  isSeller,
  checkMongoIdValidityFromParams,
  async (req, res) => {
    // extract product id from req.params
    const productId = req.params.id;
    // find product
    const product = await Product.findById(productId);
    // if not product throw error
    if (!product) {
      return res.status(404).send({ message: "Product does not exist." });
    }
    // check for owner of product
    // loggedInUserId must be same with product's sellerId
    const isOwnerOfProduct = product.sellerId.equals(req.loggedInUserId);
    // if not owner of product throw error
    if (!isOwnerOfProduct) {
      return res
        .status(403)
        .send({ message: "You are not owner of this product." });
    }
    // delete product
    await Product.deleteOne({ _id: productId });
    // delete cart
    await Cart.deleteMany({ productId });
    return res
      .status(200)
      .send({ message: "Product is deleted successfully..." });
  }
);

// edit product
router.put(
  "/product/edit/:id",
  isSeller,
  checkMongoIdValidityFromParams,
  async (req, res, next) => {
    // extract new product from req.body
    const newProduct = req.body;
    // validate new product
    try {
      const validatedData = await addProductValidationSchema.validate(
        newProduct
      );
      req.body = validatedData;
      next();
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
  },
  async (req, res) => {
    // extract product id from req.params
    const productId = req.params.id;
    // find product
    const product = await Product.findById(productId);
    // if not find product throw error
    if (!product) {
      return res.status(404).send({ message: "Product does not exist" });
    }
    // check for ownership of product
    const isOwnerOfProduct = product.sellerId.equals(req.loggedInUserId);
    // if not ownership of product throw error
    if (!isOwnerOfProduct) {
      return res
        .status(403)
        .send({ message: "You are not owner of this product." });
    }
    // extract new value from req.body
    const newValues = req.body;
    // edit product
    await Product.updateOne(
      { _id: productId },
      {
        $set: {
          ...newValues,
        },
      }
    );
    // send response
    return res
      .status(200)
      .send({ message: "Product is updated successfully." });
  }
);

// get product list by buyer
router.post(
  "/product/list/buyer",
  isBuyer,
  async (req, res, next) => {
    // extract pagination data from req.body
    const paginationData = req.body;
    // validation pagination data
    try {
      const validatedData = await paginationValidationSchema.validate(
        paginationData
      );
      req.body = validatedData;
      next();
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
  },
  async (req, res) => {
    // extract pagination data from req.body
    // const {page,limit}= req.body
    const { page, limit, searchProduct, category, minPrice, maxPrice } =
      req.body;
    // calculate skip
    const skip = (page - 1) * limit;
    let match = {};
    if (searchProduct) {
      match = { ...match, name: { $regex: searchProduct, $options: "i" } };
    }
    if (category) {
      match = { ...match, category: category };
    }
    if (minPrice >= 0 && maxPrice) {
      match = { ...match, price: { $gte: minPrice, $lte: maxPrice } };
    }
    // run query
    const productList = await Product.aggregate([
      { $match: match },
      {
        $sort: { createdAt: -1 },
      },
      { $skip: skip },
      { $limit: limit },

      {
        $project: {
          name: 1,
          brand: 1,
          price: 1,
          description: { $substr: ["$description", 0, 80] },
          image: 1,
        },
      },
    ]);
    const totalProducts = await Product.find(match).countDocuments();
    const numberOfPages = Math.ceil(totalProducts / limit);
    return res
      .status(200)
      .send({ message: "Success", productList: productList, numberOfPages });
  }
);

// get product list by seller
router.post(
  "/product/list/seller",
  isSeller,
  async (req, res, next) => {
    // extract pagination data from req.body
    const paginationData = req.body;
    // validation pagination data
    try {
      const validatedData = await paginationValidationSchema.validate(
        paginationData
      );
      req.body = validatedData;
      next();
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
  },
  async (req, res) => {
    // extract pagination data from req.body
    // const {page,limit}= req.body
    const { page, limit } = req.body;
    // calculate skip
    const skip = (page - 1) * limit;
    // run query
    const productList = await Product.aggregate([
      { $match: {} },
      {
        $sort: { createdAt: -1 },
      },
      { $skip: skip },
      { $limit: limit },

      {
        $project: {
          name: 1,
          brand: 1,
          price: 1,
          description: { $substr: ["$description", 0, 80] },
          image: 1,
        },
      },
    ]);
    const totalProducts = await Product.find().countDocuments();
    const numberOfPages = Math.ceil(totalProducts / limit);
    return res
      .status(200)
      .send({ message: "Success", productList: productList, numberOfPages });
  }
);

// get latest Product
router.get("/product/list/latest", async (req, res) => {
  const products = await Product.aggregate([
    { $match: {} },
    {
      $sort: {
        createdAt: -1,
      },
    },

    { $limit: 5 },

    {
      $project: {
        image: 1,
        name: 1,
        price: 1,
        brand: 1,
      },
    },
  ]);
  return res.status(200).send({ message: "Success", latestProducts: products });
});

//--------------------------------------------------------------
// most sale product
router.get("/most/sale/products", isUser, async (req, res) => {
  const orderedProduct = await Order.aggregate([
    {
      $group: {
        _id: "$productId",
        count: { $sum: 1 },
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
        productId: "$_id",
        count: 1,
        name: { $first: "$productDetail.name" },
      },
    },
  ]);

  console.log(orderedProduct);
  return res
    .status(200)
    .send({ message: "Success", orderedProduct: orderedProduct });
});
//---------This Rout is not used------Testing Phase--------------

// get category list
router.get("/product/category/list", async (req, res) => {
  const categoryList = await Product.aggregate([
    { $match: {} },

    {
      $sort: {
        category: 1,
      },
    },

    {
      $project: {
        category: 1,
        image: 1,
      },
    },
  ]);

// A  New Set is a collection of unique values, meaning it cannot contain duplicate elements.
  const uniqueIdsSet = new Set();
  // This line creates a new array
  const uniqueCategories = categoryList.filter((item) => {
    // .has checks if the uniqueIdsSet
    if (!uniqueIdsSet.has(item.category)) {
    // If the category is unique, this line adds it to the uniqueIdsSet
      uniqueIdsSet.add(item.category);
      return true;
    }
    return false;
  });

  return res.status(200).send({ message: "Success", uniqueCategories });
});


// get product by category
router.get("/product/category-list/:id", checkMongoIdValidityFromParams, async (req, res) => {
  // extract product id from req.params
  const productId = req.params.id;
  // find product
  const product = await Product.findById(productId);
  // if not product throw error
  if (!product) {
    return res.status(404).send({ message: "Product does not exist." });
  }
  const productInSameCategory = await Product.find({
    category: product.category,
  });

  res.status(200).send({ message: "Success", productInSameCategory });
});



export default router;
