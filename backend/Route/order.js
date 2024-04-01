const OrderController = require("../Controller/Order");
const express = require("express");
const router = express.Router();

router.post("/addorder", OrderController.AddOrder);
router.get("/getallorder", OrderController.getAllOrder);
router.get("/getbyorderid/:id", OrderController.getByid);
router.get("/getorderbyuser/:id", OrderController.getByUserid);
router.post("/trash/:id", OrderController.trash);
router.put("/editorder/:id", OrderController.update);
router.get("/getbyuser", OrderController.GetDataWithClients);
module.exports = router;
