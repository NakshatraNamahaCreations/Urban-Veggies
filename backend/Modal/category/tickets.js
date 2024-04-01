const mongoose = require("mongoose");

const TicketRising = new mongoose.Schema(
  {
    issues: String,
    categoryImage: String,
    ClientId: String,
  },
  { timestamps: true }
);
module.exports = mongoose.model("ticketsrise", TicketRising);
