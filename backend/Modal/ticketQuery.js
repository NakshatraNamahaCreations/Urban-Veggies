const mongoose = require("mongoose");

const ticketsQuery = new mongoose.Schema(
  {
    ticketsQuery: { type: String },
  },
  { timestamps: true }
);
module.exports = mongoose.model("ticketsQuery", ticketsQuery);
