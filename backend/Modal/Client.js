const mongoose = require("mongoose");

const ClientSchema = new mongoose.Schema(
  {
    clientname: { type: String },
    email: { type: String },
    contact: { type: String },
    altcontact: { type: String },
    city: { type: String },
    state: { type: String },
    address: { type: String },
    password:{type:String}
  },
  { timestamps: true }
);
module.exports = mongoose.model("Client", ClientSchema);
