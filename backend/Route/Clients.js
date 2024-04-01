const ClientController = require("../Controller/Clients");
const express = require("express");
const router = express.Router();

router.post("/addClient", ClientController.AddClients);
router.post("/loginclient", ClientController.LoginClient);
router.get("/getallClient", ClientController.getAllClient);
router.get("/getClient", ClientController.getSearchedClient);
router.get("/getbyClientid/:id", ClientController.getByid);
router.put("/editClient/:id", ClientController.update);
router.post("/trash/:id", ClientController.trash);

module.exports = router;
