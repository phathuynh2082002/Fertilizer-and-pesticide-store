import express from "express";
import asyncHandler from "express-async-handler";
import Product from "./../Models/ProductModel.js";
import { Subcategory, Category, Plant } from "../Models/CategoryModel.js";
import { admin, protect } from "../Middleware/AuthMiddleware.js";

const productRoute = express.Router();

// GET ALL PRODUCT
// productRoute.get(
//   "/",
//   asyncHandler(async (req, res) => {
//     const pageSize = 12;
//     const page = Number(req.query.pageNumber) || 1;
//     const { keyword, category, subcategory, sort } = req.query;
//     const searchCriteria = {};

//     if (keyword) {
//       searchCriteria.name = {
//         $regex: keyword,
//         $options: "i",
//       };
//     }

//     if (category) {
//       searchCriteria["category.id"] = category;
//     }

//     if (subcategory) {
//       searchCriteria["subcategory.id"] = {
//         $all: subcategory,
//       };
//     }

//     const count = await Product.countDocuments(searchCriteria);

//     let productsQuery = Product.find(searchCriteria);

//     if (sort === "newest") {
//       productsQuery = productsQuery.sort({ _id: -1 });
//     } else if (sort === "cheapest") {
//       productsQuery = productsQuery.sort({ price: 1 });
//     } else if (sort === "expensive") {
//       productsQuery = productsQuery.sort({ price: -1 });
//     } else if (sort === "highestRated") {
//       productsQuery = productsQuery.sort({ rating: -1 });
//     } else if (sort === "highestRatedNumber") {
//       productsQuery = productsQuery.sort({ numReviews: -1 });
//     } else if (sort === "bestSellers") {
//       const bestSellers = await Order.aggregate([
//         { $unwind: "$orderItems" },
//         {
//           $group: {
//             _id: "$orderItems.product",
//             totalQty: { $sum: "$orderItems.qty" },
//           },
//         },
//         { $sort: { totalQty: -1 } },
//       ]);

//       const bestSellerIds = bestSellers.map((item) => item._id);

//       if (bestSellerIds.length > 0) {
//         productsQuery = await productsQuery.sort({
//           _id: { $in: bestSellerIds },
//         });
//         console.log(productsQuery);
//       } else {
//         productsQuery = productsQuery.sort({ _id: -1 });
//       }
//     } else if (sort === "worseSellers") {
//       const bestSellers = await Order.aggregate([
//         { $unwind: "$orderItems" },
//         {
//           $group: {
//             _id: "$orderItems.product",
//             totalQty: { $sum: "$orderItems.qty" },
//           },
//         },
//         { $sort: { totalQty: 1 } },
//       ]);

//       const bestSellerIds = bestSellers.map((item) => item._id);

//       if (bestSellerIds.length > 0) {
//         productsQuery = productsQuery.find({ _id: { $in: bestSellerIds } });
//       } else {
//         productsQuery = productsQuery.sort({ _id: -1 });
//       }
//     }

//     const products = await productsQuery
//       .limit(pageSize)
//       .skip(pageSize * (page - 1));

//     res.json({ products, page, pages: Math.ceil(count / pageSize) });
//   })
// );

// GET ALL PRODUCT ADMIN
productRoute.get(
  "/all",
  asyncHandler(async (req, res) => {
    const products = await Product.find().sort({ _id: -1 });
    res.json(products);
  })
);

// GET SINGLE PRODUCT
productRoute.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(400);
      throw new Error("Sản phẩm không tồn tại");
    } else {
      const categoryExist = await Category.findById(product.category.id);
      const subcategoryExist = await Subcategory.find({
        _id: { $in: product.subcategory.map((sub) => sub.id) },
      });

      if (!categoryExist) {
        res.status(404);
        throw new Error("Loại sản phẩm không tồn tại");
      } else {
        if (subcategoryExist.length !== product.subcategory.length) {
          res.status(404);
          throw new Error("Một hoặc vài loại sản phẩm nhỏ không tồn tại");
        }
      }
    }

    res.json({ product });
  })
);

// PRODUCT REVIEW CREATE
productRoute.post(
  "/:id/review",
  protect,
  asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const areadlyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );
      if (areadlyReviewed) {
        res.status(400);
        throw new Error("Sản phẩm đã được đánh giá");
      }
      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: "Đánh giá đã được thêm vào" });
    } else {
      res.status(404);
      throw new Error("Sản phẩm không tồn tại");
    }
  })
);

// DELETE PRODUCT
productRoute.delete(
  "/:id",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      const deleteProduct = await Product.deleteOne({ _id: req.params.id });
      res.json({ message: "Sản phẩm đã dược xóa" });
    } else {
      res.status(404);
      throw new Error("Sản phẩm không tồn tại");
    }
  })
);

// CREATE PRODUCT
productRoute.post(
  "/",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const {
      name,
      category,
      subcategory,
      price,
      description,
      image,
      countInStock,
      unit,
      company,
    } = req.body;

    const productExist = await Product.findOne({ name });
    const categoryExist = await Category.findById(category);
    const subcategoryExist = await Subcategory.find({
      _id: { $in: subcategory },
    });
    const plants = [
      ...new Set(
        description.instructions.flatMap((ins) =>
          ins.plants.map((plant) => plant.id)
        )
      ),
    ];
    const plantExist = await Plant.find({
      _id: { $in: plants },
    });

    if (productExist) {
      res.status(400);
      throw new Error("Tên sản phẩm đã tồn tại");
    } else if (!categoryExist) {
      res.status(404);
      throw new Error("Loại sản phẩm không hợp lệ");
    } else if (subcategoryExist.length !== subcategory.length) {
      res.status(404);
      throw new Error("Một hoặc vài loại sản phẩm nhỏ không tồn tại");
    } else if (plantExist.length !== plants.length) {
      res.status(404);
      throw new Error("Một hoặc vài loại cây trồng không tồn tại");
    }

    const product = new Product({
      name,
      category: {
        name: categoryExist.name,
        id: categoryExist._id,
      },
      subcategory: subcategoryExist.map((sub) => ({
        name: sub.name,
        id: sub._id,
      })),
      price,
      description,
      image,
      countInStock,
      unit,
      company,
      user: req.user_id,
    });
    if (product) {
      const createdProduct = await product.save();
      res.status(201).json(createdProduct);
    } else {
      res.status(400);
      throw new Error("Dữ liệu sản phẩm không hợp lệ");
    }
  })
);

// UPDATE PRODUCT
productRoute.put(
  "/:id",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const {
      name,
      category,
      subcategory,
      price,
      description,
      image,
      countInStock,
      unit,
      company,
    } = req.body;

    const product = await Product.findById(req.params.id);

    const categoryExist = await Category.findById(category);

    const subcategoryExist = await Subcategory.find({
      _id: { $in: subcategory },
    });
    const plants = [
      ...new Set(
        description.instructions.flatMap((ins) =>
          ins.plants.map((plant) => plant.id)
        )
      ),
    ];
    const plantExist = await Plant.find({
      _id: { $in: plants },
    });

    if (!product) {
      res.status(400);
      throw new Error("Sản phẩm không tồn tại");
    } else if (!categoryExist) {
      res.status(404);
      throw new Error("Loại sản phẩm không tồn tại");
    } else if (subcategoryExist.length !== subcategory.length) {
      res.status(404);
      throw new Error("Một hoặc vài loại sản phẩm nhỏ không tồn tại");
    } else if (plantExist.length !== plants.length) {
      res.status(404);
      throw new Error("Một hoặc vài loại cây trồng không tồn tại");
    }
    product.name = name || product.name;
    product.category = product.category =
      {
        name: categoryExist.name,
        id: categoryExist._id,
      } || product.category;
    product.subcategory =
      subcategoryExist.map((sub) => ({
        name: sub.name,
        id: sub._id,
      })) || product.subcategory;
    product.plants =
      plantExist.map((sub) => ({
        name: sub.name,
        id: sub._id,
      })) || product.plants;
    product.price = price || product.price;
    product.description = description || product.description;
    product.image = image || product.image;
    product.countInStock = countInStock || product.countInStock;
    product.unit = unit || product.unit;
    product.company = company || product.company;

    const updatedProduct = await product.save();

    res.json(updatedProduct);
  })
);

export default productRoute;
