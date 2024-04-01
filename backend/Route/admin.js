
const express = require("express");
const router = express.Router();
const AdminController = require("../Controller/auth");

router.post("/addadmin", AdminController.AddUser);

module.exports = router;
