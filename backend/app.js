const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`Database connected successfully`);
  })
  .catch((err) => {
    console.error(`Error connecting to the database: ${err}`);
  });

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.static("Public"));
app.use(express.urlencoded({ extended: true }));


const Auth = require("./Controller/auth");
const Banner = require("./Controller/Banner");
const category = require("./Route/Category");
const client = require("./Route/Clients");
const DeliveryCharge = require("./Route/deliverycharge");
const Product = require("./Route/Product");
const cart = require("./Route/AddtoCart");
const Order = require("./Route/order");

const Tickets = require("./Route/tickets");

app.use("/api", Auth);
app.use("/api/banner", Banner);
app.use("/api/category", category);
app.use("/api/client", client);
app.use("/api", DeliveryCharge);
app.use("/api/product", Product);
app.use("/api/cart", cart);
app.use("/api/order", Order);
app.use("/api/tickets", Tickets);

const PORT = process.env.PORT || 9000;
console.log(PORT,"PORT")
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
