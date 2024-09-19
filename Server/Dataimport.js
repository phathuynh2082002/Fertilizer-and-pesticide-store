import express from "express";
import Product from "./Models/ProductModel.js";
import asyncHandler from "express-async-handler";

const ImportData = express.Router();
const csvFilePath = "path/to/your/file.csv";

ImportData.post(
  "/products",
  asyncHandler(async (req, res) => {    await Product.deleteMany({});

    const data = [];

    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on("data", (row) => {
        data.push(row);
      })
      .on("end", async () => {
        const result = await Product.insertMany(data);
        console.log(`${result.length} documents inserted`);
      });
  })
);

export default ImportData;
