const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    category: String,
    categoryImage: String,
  },
  { timestamps: true }
);
module.exports = mongoose.model("Category", CategorySchema);
