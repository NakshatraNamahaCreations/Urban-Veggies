const mongoose = require("mongoose");

const tickets = new mongoose.Schema(
  {
    OrderId: { type: mongoose.Schema.Types.ObjectId },
    ClientId: { type: mongoose.Schema.Types.ObjectId },
    comments: String,
    TickesStatus: { type: String },
  },
  { timestamps: true }
);
module.exports = mongoose.model("ticket", tickets);
