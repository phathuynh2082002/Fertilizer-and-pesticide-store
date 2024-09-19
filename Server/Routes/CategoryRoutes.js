import express from "express";
import asyncHandler from "express-async-handler";
import { Category, Plant, Subcategory } from "../Models/CategoryModel.js";
import { admin, protect } from "../Middleware/AuthMiddleware.js";

const categoryRouter = express.Router();

// CREATE CATEGORY
categoryRouter.post(
  "/",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const { name } = req.body;
    const categoryExist = await Category.findOne({ name });
    if (categoryExist) {
      res.status(400);
      throw new Error("Tên loại sản phẩm đã tồn tại");
    } else {
      const category = new Category({ name });
      if (category) {
        const createCategory = await category.save();
        res.json(createCategory);
      } else {
        res.status(400);
        throw new Error("Dữ liệu loại sản phẩm không hợp lệ");
      }
    }
  })
);

// CREATE PLANT
categoryRouter.post(
  "/plant",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const { name } = req.body;
    const plantExist = await Plant.findOne({ name });
    if (plantExist) {
      res.status(400);
      throw new Error("Tên cây trồng đã tồn tại");
    } else {
      const plant = new Plant({ name });
      if (plant) {
        const createPlant = await plant.save();
        res.json(createPlant);
      } else {
        res.status(400);
        throw new Error("Dữ liệu cây trồng không hợp lệ");
      }
    }
  })
);

// CREATE SUBCATEGORY
categoryRouter.post( 
  "/:id",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const { name } = req.body;

    const category = await Category.findById(req.params.id);

    if (!category) {
      res.status(400);
      throw new Error("Loại sản phẩm không tồn tại");
    }

    const existingSubcategory = await Subcategory.findOne({
      name,
      category: req.params.id,
    });

    if (existingSubcategory) {
      res.status(400);
      throw new Error("Loại sản phẩm nhỏ đã tồn tại");
    }

    const subcategory = await Subcategory.create({
      name,
      category: req.params.id,
    });

    res.json(subcategory);
  })
);

// UPDATE CATEGORY
categoryRouter.put(
  "/:id",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const { name } = req.body;

    const category = await Category.findById(req.params.id);

    if (!category) {
      res.status(400);
      throw new Error("Loại sản phẩm không tồn tại");
    }

    category.name = name;

    const updatedCategory = await category.save();

    res.json(updatedCategory);
  })
);

// UPDATE PLANT
categoryRouter.put(
  "/plant/:id",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const { name } = req.body;

    const plant = await Plant.findById(req.params.id);

    if (!plant) {
      res.status(400);
      throw new Error("Cây trồng không tồn tại");
    }

    plant.name = name;

    const updatedPlant = await plant.save();

    res.json(updatedPlant);
  })
);

// UPDATE SUBCATEGORY
categoryRouter.put(
  "/sub/:subcategoryId",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const { name } = req.body;
    const { subcategoryId } = req.params;

    const subcategory = await Subcategory.findById(subcategoryId);

    if (!subcategory) {
      res.status(400);
      throw new Error("Loại sản phẩm nhỏ không tồn tại");
    }

    subcategory.name = name;

    const updatedSubcategory = await subcategory.save();

    res.json(updatedSubcategory);
  })
);

// DELETE CATEGORY
categoryRouter.delete(
  "/:categoryId",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const { categoryId } = req.params;

    const category = await Category.findById(categoryId);

    if (!category) {
      res.status(400);
      throw new Error("Loại sản phẩm không tồn tại");
    }
    const subcategories = await Subcategory.find({ category: categoryId });

    for (const subcategory of subcategories) {
      await Subcategory.deleteOne({ _id: subcategory._id });
    }

    await Category.deleteOne(category);

    res.json({ message: "Loại sản phẩm đã bị xóa" });
  })
);

// DELETE PLANT
categoryRouter.delete(
  "/plant/:plantId",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const { plantId } = req.params;

    const plant = await Plant.findById(plantId);

    if (!plant) {
      res.status(400);
      throw new Error("Cây trồng không tồn tại");
    }

    await Plant.deleteOne(plant);

    res.json({ message: "Cây trồng đã bị xóa" });
  })
);

// DELETE SUBCATEGORY
categoryRouter.delete(
  "/sub/:subcategoryId",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const { subcategoryId } = req.params;

    const subcategory = await Subcategory.findById(subcategoryId);

    if (!subcategory) {
      res.status(400);
      throw new Error("Loại sản phẩm nhỏ không tồn tại");
    }

    await Subcategory.deleteOne(subcategory);

    res.json({ message: "Loại sản phẩm nhỏ đã bị xóa" });
  })
);

// LIST CATEGORY
categoryRouter.get(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const categorys = await Category.find();
    res.json(categorys);
  })
);

// LIST PLANT
categoryRouter.get(
  "/plant",
  protect,
  asyncHandler(async (req, res) => {
    const plants = await Plant.find();
    res.json(plants);
  })
);

// GET SUBCATEGORY
categoryRouter.get(
  "/sub",
  protect,
  asyncHandler(async (req, res) => {
    const { id } = req.query;

    const subcategory = await Subcategory.find({ category: id });

    if (!subcategory) {
      res.status(400);
      throw new Error("Loại sản phẩm không tồn tại");
    }

    res.json({ subcategory, id });
  })
);

export default categoryRouter;
