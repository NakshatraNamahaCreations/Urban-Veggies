const dlchargeController = require("../Controller/DeliveryCharge");
const express = require("express");
const router = express.Router();

router.post("/adddlcharge", dlchargeController.Adddlcharge);
router.get("/getalldlcharge", dlchargeController.getAlldlcharge);
router.put("/editdlcharge/:id", dlchargeController.update);
router.post("/trash/:id", dlchargeController.trash);
router.get("/getbyiddlcharge/:id", dlchargeController.getByid);
router.get("/getbyuser", dlchargeController.GetDataWithClients);
module.exports = router;
