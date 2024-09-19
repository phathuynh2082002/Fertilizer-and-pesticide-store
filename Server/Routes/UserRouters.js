import express from "express";
import asyncHandler from "express-async-handler";
import User from "./../Models/UserModel.js";
import generateToken from "../Utils/generateToken.js";
import { protect, admin } from "../Middleware/AuthMiddleware.js";

const userRouter = express.Router();

// LOGIN
userRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.macthPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
        createdAt: user.createdAt,
      });
    } else {
      res.status(401);
      throw new Error("Mật khẩu hoặc email không hợp lệ");
    }
  })
);

// REGISTER
userRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const { name, email, password, isAdmin } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("Email đã được sử dụng");
    }

    const user = await User.create({
      name,
      email,
      password,
      isAdmin,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Dữ liệu người dùng không hợp lệ");
    }
  })
);

// PROFILE
userRouter.get(
  "/profile",
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        address: user.shippingAddress.address,
        wards: user.shippingAddress.wards,
        city: user.shippingAddress.city,
        province: user.shippingAddress.province,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
      });
    } else {
      res.status(404);
      throw new Error("Người dùng không tồn tại");
    }
  })
);

// UPDATE PROFILE
userRouter.put(
  "/profile",
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.shippingAddress.address =
        req.body.address || user.shippingAddress.address;
      user.shippingAddress.wards = req.body.wards || user.shippingAddress.wards;
      user.shippingAddress.city = req.body.city || user.shippingAddress.city;
      user.shippingAddress.province =
        req.body.province || user.shippingAddress.province;
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updateUser = await user.save();

      res.json({
        _id: updateUser._id,
        name: updateUser.name,
        email: updateUser.email,
        address: updateUser.shippingAddress.address,
        wards: updateUser.shippingAddress.wards,
        city: updateUser.shippingAddress.city,
        province: updateUser.shippingAddress.province,
        isAdmin: updateUser.isAdmin,
        createdAt: updateUser.createdAt,
        token: generateToken(updateUser._id),
      });
    } else {
      res.status(404);
      throw new Error("Người dùng không tồn tại");
    }
  })
);

// GET ALL USER ADMIN
userRouter.get(
  "/all",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const { keyword, page } = req.query;

    const pageSize = 10;
    const searchCondition = {};
    let users;
    let count;

    if (keyword) {
      searchCondition.name = { $regex: new RegExp(keyword, "i") };
    }

    users = await User.find(searchCondition)
      .limit(pageSize)
      .skip(pageSize * (page-1))
      .sort({ _id: -1 });

    count = await User.countDocuments(searchCondition);
    res.json({ users, pages: Math.ceil(count / pageSize) });
  })
);

// DELETE USER
userRouter.delete(
  "/:id",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      await User.deleteOne(user);
      res.json({ message: "Tài khoản đã dược xóa" });
    } else {
      res.status(404);
      throw new Error("Tài khoản không tồn tại");
    }
  })
);

export default userRouter;
