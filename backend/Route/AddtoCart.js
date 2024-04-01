const CartController = require("../Controller/AddToCart");
const express = require("express");
const router = express.Router();

router.post("/addcart", CartController.AddCart);
router.get("/getallcart", CartController.getAllCart);
router.get("/getbycartid/:id", CartController.getByid);
router.get("/getcartbyuser/:id", CartController.getByUserid);
router.put("/editcart/:id", CartController.update);
router.post("/trash/:id", CartController.trash);

module.exports = router;
