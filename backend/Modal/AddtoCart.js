const mongoose = require("mongoose");

const AddToCart = new mongoose.Schema(
  {
    ProductId: { type: mongoose.Schema.Types.ObjectId },
    ClientId: { type: mongoose.Schema.Types.ObjectId },
    Quantity: { type: Number },
    Amount: { type: Number },
  },
  { timestamps: true }
);
module.exports = mongoose.model("addtocart", AddToCart);
