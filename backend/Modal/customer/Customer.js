const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema(
  {
    Id: { type: String, required: true },
    joiningdate: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Customer", CustomerSchema);
