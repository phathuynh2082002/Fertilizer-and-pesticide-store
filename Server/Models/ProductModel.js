import mongoose from "mongoose";

const reviewSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

const instructionSchema = mongoose.Schema({
  plants: [
    {
      name: { type: String },
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subcategory",
      },
    },
  ],
  object: { type: String },
  dosage: { type: String },
  usage: { type: String },
});

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      components: { type: String },
      uses: { type: String },
      instructions: [instructionSchema],
      note: { type: String },
    },
    reviews: [reviewSchema],
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
    category: {
      name: { type: String, required: true },
      id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Category",
      },
    },
    subcategory: [
      {
        name: { type: String, required: true },
        id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Subcategory",
        },
      },
    ],
    unit: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
