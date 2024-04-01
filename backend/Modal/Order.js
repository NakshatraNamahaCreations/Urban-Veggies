const mongoose = require("mongoose");

const Order = new mongoose.Schema(
  {
    Products: { type: Array },
    ClientId: { type: mongoose.Schema.Types.ObjectId },
    BillingDetails: { type: Object },
    orderStatus: String,
    OrderID: String,
  },
  { timestamps: true }
);
module.exports = mongoose.model("Order", Order);
