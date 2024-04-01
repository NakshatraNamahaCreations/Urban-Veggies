const mongoose = require("mongoose");

const Deliverycharge = new mongoose.Schema(
  {
    dlcharge: { type: String, required: true },
    ClientId: { type: mongoose.Schema.Types.ObjectId },
  },

  { timestamps: true }
);
module.exports = mongoose.model("deliverycharge", Deliverycharge);
