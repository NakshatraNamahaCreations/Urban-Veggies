const TicketsController = require("../Controller/tickets");
const express = require("express");
const router = express.Router();

router.post("/addtickets", TicketsController.AddTickets);
router.get("/getalltickets", TicketsController.getAllTickets);
router.get("/getbyticketsid/:id", TicketsController.getByid);
router.put("/edittickets/:id", TicketsController.update);
router.post("/trash/:id", TicketsController.trash);
router.get("/getbyuser", TicketsController.GetDataWithClients);
router.get("/getbyuserid/:id", TicketsController.getByUserid);

// add query

router.post("/addquery", TicketsController.AddTicketsQuery);
router.get("/getallquery", TicketsController.getAllQuery);
router.put("/editquery/:id", TicketsController.updateQuery);
router.post("/trashquery/:id", TicketsController.trashQuery);
router.get("/getbyid/:id", TicketsController.getQuerByid);
module.exports = router;
