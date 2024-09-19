import express from "express";
import asyncHandler from "express-async-handler";
import Order from "../Models/OrderModel.js";
import { admin, protect } from "../Middleware/AuthMiddleware.js";
import Product from "../Models/ProductModel.js";
import User from "../Models/UserModel.js";

const orderRouter = express.Router();

// CREATE ORDER
orderRouter.post(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error("Hóa đơn không có bất kì sản phẩm nào!");
    } else {
      const order = new Order({
        orderItems,
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      });

      const insufficientQuantityProduct = await checkQty(order);
      if (insufficientQuantityProduct) {
        res.status(400);
        throw new Error(
          `Số lượng sản phẩm ${insufficientQuantityProduct.productName} tồn kho còn lại ${insufficientQuantityProduct.availableQuantity}.`
        );
      }

      const createOrder = await order.save();
      res.status(201).json(createOrder);
    }
  })
);

// ADMIN GET FILTERED ORDERS
orderRouter.get(
  "/all",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const { keyword, show, limit } = req.query;
    const searchConditions = {};

    if (keyword) {
      const users = await User.find({
        name: { $regex: keyword, $options: "i" },
      });

      if (users.length === 0) {
        return res.status(404).json({ message: "Không tìm thấy khách hàng" });
      }

      const userIds = users.map((user) => user._id);

      searchConditions["user"] = { $in: userIds };
    }

    if (show && show !== "all") {
      switch (show) {
        case "unpaid":
          searchConditions.isPaid = false;
          break;
        case "paid":
          searchConditions.isPaid = true;
          break;
        case "unpended":
        case "pended":
        case "shipping":
        case "delivered":
        case "cancel":
          searchConditions.statuss = show;
          break;
        default:
          break;
      }
    }

    const orders = await Order.find(searchConditions)
      .sort({ _id: -1 })
      .populate("user", "id name email")
      .limit(parseInt(limit) || 10);

    res.json(orders);
  })
);

// ADMIN GET ALL ORDERS
orderRouter.get(
  "/all-statistic",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const orders = await Order.find()
      .sort({ _id: -1 })
      .populate("user", "id name email");

    res.json(orders);
  })
);

// USER LOGIN ORDERS
orderRouter.get(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const order = await Order.find({ user: req.user._id }).sort({ _id: -1 });
    res.json(order);
  })
);

// ALERT ORDER FOR USER
orderRouter.get(
  "/order-update",
  protect,
  asyncHandler(async (req, res) => {
    const order = await Order.find({ user: req.user._id }).sort({ _id: -1 });

    const filteredOrders = order.filter((order) => {
      const createdAt = order.createdAt.toISOString().slice(0, 19);
      const updatedAt = order.updatedAt.toISOString().slice(0, 19);
      const statussAt = order.statussAt.toISOString().slice(0, 19);
      const statuss = order.statuss;

      return (
        createdAt !== updatedAt &&
        updatedAt !== statussAt &&
        statuss !== "unpended"
      );
    });

    res.json(filteredOrders);
  })
);

// CHECK ORDER
orderRouter.put(
  "/:id/check",
  protect,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );
    if (order) {
      order.statussAt = Date.now();
      const updateOrder = await order.save();
      res.json(updateOrder);
    } else {
      res.status(404);
      throw new Error("Hóa đơn không tồn tại");
    }
  })
);

const exceptQty = async (item) => {
  const product = await Product.findById(item.product);
  product.countInStock = product.countInStock - item.qty;
  await product.save();
};

const checkQty = async (order) => {
  for (let item of order.orderItems) {
    const product = await Product.findById(item.product);
    if (product.countInStock < item.qty) {
      return {
        productName: product.name,
        availableQuantity: product.countInStock,
      };
    }
  }
  return null;
};

// ORDER SET STATUS
orderRouter.put(
  "/:id/status",
  protect,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    const { statuss } = req.body;
    let updateOrder;

    if (order) {
      await checkQty(order).then(async (check) => {
        switch (statuss) {
          case "pended":
            if (check) {
              res.status(400);
              throw new Error(
                "Hóa đơn có sản phẩm không còn đủ số lượng tồn kho"
              );
            } else {
              order.statuss = "pended";
              updateOrder = await order.save();
              res.json(updateOrder);
            }
            break;
          case "shipping":
            if (check) {
              res.status(400);
              throw new Error(
                "Hóa đơn có sản phẩm không còn đủ số lượng tồn kho"
              );
            } else {
              order.statuss = "shipping";
              updateOrder = await order.save();
              res.json(updateOrder);
            }
            break;
          case "delivered":
            if (check) {
              res.status(400);
              throw new Error(
                "Hóa đơn có sản phẩm không còn đủ số lượng tồn kho"
              );
            } else {
              await order.orderItems.map((item) => exceptQty(item));
              order.statuss = "delivered";
              updateOrder = await order.save();
              res.json(updateOrder);
            }
            break;
          default:
            break;
        }
      });
    } else {
      res.status(404);
      throw new Error("Hóa đơn không tồn tại");
    }
  })
);

// ORDER IS PAID
orderRouter.put(
  "/:id/pay",
  protect,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };
      const updateOrder = await order.save();
      res.json(updateOrder);
    } else {
      res.status(404);
      throw new Error("Hóa đơn không tồn tại");
    }
  })
);

// DELETE ORDER BY ID
orderRouter.delete(
  "/:id",
  protect,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      await Order.deleteOne(order);
      res.json({ message: "Hóa đơn đã được xóa" });
    } else {
      res.status(404);
      throw new Error("Hóa đơn không tồn tại");
    }
  })
);

// CANCLE ORDER BY ID
orderRouter.put(
  "/:id",
  protect,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.statuss = "cancel";
      const updateOrder = await order.save();
      res.json(updateOrder);
    } else {
      res.status(404);
      throw new Error("Hóa đơn không tồn tại");
    }
  })
);

// GET ORDER BY ID
orderRouter.get(
  "/:id",
  protect,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (order) {
      res.json(order);
    } else {
      res.status(404);
      throw new Error("Hóa đơn không tồn tại");
    }
  })
);

export default orderRouter;
