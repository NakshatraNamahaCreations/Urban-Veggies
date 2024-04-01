const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    CategoryId: { type: mongoose.Schema.Types.ObjectId },
    productname: { type: String },
    offerprice: { type: String },
    price: { type: String },
    offer: { type: String },
    description: { type: String },
    productimage: { type: String },
    GST: { type: String },
    clientId: { type: mongoose.Schema.Types.ObjectId },
    minqty: String,
    maxqty: String,
    clientName: String,
    unit: String,
  },

  { timestamps: true }
);
module.exports = mongoose.model("Product", ProductSchema);
