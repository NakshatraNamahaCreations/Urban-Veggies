const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const AuthSchema = new mongoose.Schema(
  {
    username: String,
    email: String,
    password: String,
    cpassword: String,
    token: String,
  },
  { timestamps: true }
);

AuthSchema.methods.comparePassword = async function (adminpasswrod) {
  try {
    const isMatch = await bcrypt.compare(adminpasswrod, this.password);
    return isMatch;
  } catch (error) {
    throw error;
  }
};
const AdminModal = mongoose.model("admin", AuthSchema);

module.exports = AdminModal;
